import type { GameMap, Enemy, DropItem } from '../models/combat';
import { getEnemy, getMonstersByLevel } from './enemies';
// @ts-ignore
import mhxyMapsRaw from './mhxy_maps.json';

// Commercial v6.9 Map Drops & Enemies (MHXY Strict)
// Loaded from JSON

interface MhxyMap {
    "地图编号": number;
    "名称": string;
    "等级": number | null;
    "怪兽等级": number | null;
}

const mhxyMaps = mhxyMapsRaw as unknown as MhxyMap[];

// Drop Scaling Logic
const getRealmDropConfig = (realmId: number) => {
    // Economy scales 3.5x per realm. 
    const multi = Math.pow(3.5, realmId - 1);
    const equipChance = Math.max(0.05, 0.5 - (realmId - 1) * 0.05);

    return {
        ssMin: Math.floor(10 * multi),
        ssMax: Math.floor(25 * multi),
        matChance: 0.2,
        equipChance: equipChance,
        ssChance: 0.3
    };
};

// Map MHXY Level to Game Realm Requirement (ID)
const getRealmRequirement = (level: number): number => {
    if (level <= 10) return Math.max(1, level); // Qi 1-10

    // For levels > 10, map to Major Realms (21, 31, 41...)
    // Rough Mapping:
    // 11-20: Foundation (21)
    // 21-40: Golden Core (31)
    // 41-60: Nascent Soul (41)
    // 61-90: Spirit Severing (51)
    // 91-120: Void (61)
    // 121-150: Integration (91) - Skipping some for density
    // 150+: Mahayana (101)

    if (level <= 20) return 21; // Foundation
    if (level <= 40) return 31; // Golden Core
    if (level <= 60) return 41; // Nascent Soul
    if (level <= 90) return 51; // Spirit Severing
    if (level <= 110) return 61; // Void
    if (level <= 130) return 71; // Out of Body
    if (level <= 150) return 81; // Distraction
    return 101; // Mahayana+
};

const generateMaps = (): GameMap[] => {
    const maps: GameMap[] = [];
    const processedNames = new Set<string>();

    mhxyMaps.forEach(m => {
        // 1. Filter Non-Combat / Invalid Maps
        if (!m['名称']) return;
        if (!m['等级']) return;

        // 2. Filter Explicit Non-Combat Keywords
        const name = m['名称'];
        if (name.includes('帮派') || name.includes('家') || name.includes('店') || name.includes('擂台') || name.includes('牢')) return;

        // 3. Deduplicate
        if (processedNames.has(name)) return;
        processedNames.add(name);

        const mapLevel = m['等级'];
        const reqRealmId = getRealmRequirement(mapLevel);
        const majorRealm = Math.floor(reqRealmId / 10);

        const mapId = `map_${m['地图编号']}`;
        const dCfg = getRealmDropConfig(majorRealm);

        // Dynamic Monster Generation
        const enemies: Enemy[] = [];
        const monsterIds = getMonstersByLevel(mapLevel, 4);

        monsterIds.forEach(mid => {
            enemies.push(getEnemy(mid, majorRealm));
        });

        if (enemies.length === 0) {
            enemies.push(getEnemy('turtle', majorRealm));
        }

        // Map Drops (Balanced)
        const mapDrops: DropItem[] = [];
        mapDrops.push({ itemId: 'spirit_stone', min: dCfg.ssMin, max: dCfg.ssMax, chance: dCfg.ssChance });

        const mats = ['mat_herb', 'mat_wood', 'mat_iron', 'mat_copper', 'mat_crystal', 'mat_essence'];
        const specialtyMat = mats[m['地图编号'] % mats.length];
        mapDrops.push({ itemId: specialtyMat, min: 1, max: 1 + Math.floor(majorRealm / 5), chance: dCfg.matChance });

        const slot = ['weapon', 'armor', 'helm', 'boots'][m['地图编号'] % 4];
        mapDrops.push({ itemId: `loot_eq_${majorRealm}_${slot}`, min: 1, max: 1, chance: dCfg.equipChance });

        maps.push({
            id: mapId,
            name: name,
            desc: `探索等级: ${mapLevel}`,
            reqRealmId: reqRealmId,
            // Category determined by Major Realm
            // 1-3: Mortal (Qi, Foun, Gold)
            // 4-6: Spirit (Nascent, Spirit, Void)
            // 7+: Celestial
            category: majorRealm >= 7 ? '仙界' : (majorRealm >= 4 ? '灵界' : '凡人界'),
            enemies: enemies,
            drops: mapDrops
        });
    });

    // Sort by Realm Req
    maps.sort((a, b) => a.reqRealmId - b.reqRealmId);

    return maps;
};

const SPECIAL_MAPS: GameMap[] = [
    {
        id: 'sect_patrol',
        name: '宗门周边',
        desc: '宗门巡逻区域。',
        reqRealmId: 1,
        category: '宗门任务',
        isHidden: true,
        enemies: [
            getEnemy('robber', 1, '鬼祟之人')
        ],
        // Patrol pays well but low mat chance
        drops: [{ itemId: 'spirit_stone', min: 50, max: 100, chance: 1.0 }]
    }
];

export const MAPS: GameMap[] = [...generateMaps(), ...SPECIAL_MAPS];
