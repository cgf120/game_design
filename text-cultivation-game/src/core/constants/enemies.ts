import type { Enemy } from '../models/combat';
// @ts-ignore
import mhxyMonstersRaw from './mhxy_monsters.json';
import { getRandomEquipmentId } from './items';

// Type definition for MHXY Monster
interface MhxyMonster {
    "编号": number;
    "名称": string;
    "等级": number | null;
    "气血": number;
    "防御": number;
    "伤害": number;
    "速度": number;
    "难度": number; // usually < 1, e.g. 0.3
    "技能": string; // "{skill1,skill2}"
}

const mhxyMonsters = mhxyMonstersRaw as MhxyMonster[];

// Index monsters by level for fast lookup
const MONSTERS_BY_LEVEL: Record<number, MhxyMonster[]> = {};
const LEVEL_KEYS: number[] = [];

mhxyMonsters.forEach(m => {
    // Basic filter: only summon beasts or standard mobs
    if (!m['等级']) return;

    // Bucket by exact level
    const lvl = m['等级'];
    if (!MONSTERS_BY_LEVEL[lvl]) {
        MONSTERS_BY_LEVEL[lvl] = [];
        LEVEL_KEYS.push(lvl);
    }
    MONSTERS_BY_LEVEL[lvl].push(m);
});
LEVEL_KEYS.sort((a, b) => a - b);

// Helper to get monsters near a level
export const getMonstersByLevel = (targetLevel: number, count: number = 3): string[] => {
    // Find levels within range (e.g. +/- 5 levels)
    const min = Math.max(0, targetLevel - 5);
    const max = targetLevel + 5;

    let candidates: MhxyMonster[] = [];

    // Safe spread
    LEVEL_KEYS.forEach(lvl => {
        if (lvl >= min && lvl <= max) {
            const batch = MONSTERS_BY_LEVEL[lvl];
            if (batch) candidates.push(...batch);
        }
    });

    if (candidates.length === 0) {
        // Fallback: find closest level
        if (LEVEL_KEYS.length === 0) return ['turtle'];
        const closest = LEVEL_KEYS.reduce((prev, curr) =>
            Math.abs(curr - targetLevel) < Math.abs(prev - targetLevel) ? curr : prev
        );
        const batch = MONSTERS_BY_LEVEL[closest];
        if (batch) candidates = batch || [];
    }

    if (candidates.length === 0) return ['turtle']; // Ultimate fallback

    // Shuffle and pick
    const selected: string[] = [];
    for (let i = 0; i < count; i++) {
        const m = candidates[Math.floor(Math.random() * candidates.length)];
        // We use a prefix to identify MHXY ID: mhxy_ID
        selected.push(`mhxy_${m['编号']}`);
    }
    return [...new Set(selected)]; // Unique identifiers
};

// Map MHXY stats to Game stats
const mapMhxyEnemy = (m: MhxyMonster, realmId: number): Enemy => {
    // Scaling stats based on realmId to ensure balance
    const realmMult = Math.pow(1.5, realmId - 1) * (m['难度'] || 0.5) * 5;

    const maxHp = Math.floor(100 * realmMult);
    const atk = Math.floor(10 * realmMult);
    const def = Math.floor(5 * realmMult);
    const spd = Math.floor(5 * (m['速度'] > 10 ? 1.5 : 1));

    // Dynamic Drops
    const drops: any[] = [{ itemId: 'spirit_stone', min: realmId * 5, max: realmId * 15, chance: 0.5 }];

    // Add Equipment Drop
    const slot = ['weapon', 'armor', 'helm', 'boots'][realmId % 4];
    drops.push({ itemId: `loot_eq_${realmId}_${slot}`, chance: 0.1, min: 1, max: 1 });

    return {
        id: `mhxy_${m['编号']}_${Date.now()}`, // Unique instance ID
        name: m['名称'].replace(/[{}]/g, ''), // Remove braces
        level: m['等级'] || (realmId * 10),
        realmId: realmId,
        expReward: Math.floor(50 * realmMult),
        stats: {
            maxHp, hp: maxHp,
            atk, def, spd,
            critRate: 0.05, dodgeRate: 0.05
        },
        drops,
        skills: [] // Skills not yet parsed from string
    };
};

const LEGACY_TEMPLATES: Record<string, any> = {
    'turtle': { name: '大海龟', stats: { hp: 50, atk: 8, def: 2, spd: 5 } },
    'frog': { name: '巨蛙', stats: { hp: 40, atk: 12, def: 1, spd: 4 } },
};

export const getEnemy = (templateId: string, realmId: number, overrideName?: string): Enemy => {
    // 1. Check if it's a MHXY ID
    if (templateId.startsWith('mhxy_')) {
        const idStr = templateId.replace('mhxy_', '');
        const m = mhxyMonsters.find(x => x['编号'] == parseInt(idStr));
        if (m) {
            const e = mapMhxyEnemy(m, realmId);
            if (overrideName) e.name = overrideName;
            return e;
        }
    }

    // 2. Legacy Fallback
    const tpl = LEGACY_TEMPLATES[templateId] || LEGACY_TEMPLATES['turtle'];

    const realmMult = Math.pow(1.5, realmId - 1);
    const base = tpl.stats;
    const maxHp = Math.floor(base.hp * realmMult);

    // Drops: dynamic
    const slot = ['weapon', 'armor', 'helm', 'boots'][realmId % 4];
    const drops = [
        { itemId: 'spirit_stone', min: realmId * 2, max: realmId * 8, chance: 0.5 },
        { itemId: `loot_eq_${realmId}_${slot}`, chance: 0.05, min: 1, max: 1 }
    ];

    return {
        id: `gen_${templateId}_${Date.now()}`,
        name: overrideName || tpl.name,
        level: realmId * 10 - 5,
        realmId: realmId,
        expReward: Math.floor(30 * realmMult),
        stats: {
            maxHp, hp: maxHp,
            atk: Math.floor(base.atk * realmMult),
            def: Math.floor(base.def * realmMult),
            spd: Math.floor(base.spd * 1),
            critRate: 0.05, dodgeRate: 0.05
        },
        drops,
        skills: []
    };
};
