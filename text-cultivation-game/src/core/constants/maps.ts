import type { GameMap, Enemy, DropItem } from '../models/combat';
import { getEnemy } from './enemies';

// Commercial v6.9 Map Drops & Enemies (MHXY Strict)

interface FwjMapConfig {
    realmId: number;
    maps: {
        name: string;
        desc: string;
        enemies: string[];
        boss?: string;
        drops?: string[]; // Gathering / Map Drops
    }[];
}

const FWJ_CONFIG: FwjMapConfig[] = [
    // 1. 练气 (Qi) - East Bay
    {
        realmId: 1,
        maps: [
            {
                name: '建邺城郊', desc: '祥和的郊外，偶有野兽出没。',
                enemies: ['turtle', 'frog', 'boar'],
                drops: ['mat_herb', 'mat_wood']
            },
            {
                name: '东海湾', desc: '海风拂面，沙滩上爬满了甲壳生物。',
                enemies: ['turtle', 'frog', 'caterpillar', 'tree_monster'],
                drops: ['mat_sea_shell', 'mat_herb']
            },
            {
                name: '沉船', desc: '阴暗潮湿的船舱，藏着古老的冤魂。',
                enemies: ['caterpillar', 'frog', 'shrimp', 'crab'], boss: 'frog',
                drops: ['mat_iron', 'mat_sea_shell']
            }
        ]
    },
    // 2. 筑基 (Foundation) - Pagoda
    {
        realmId: 2,
        maps: [
            { name: '江南野外', desc: '连接长安的交通要道。', enemies: ['boar', 'robber', 'gambler', 'wolf'], drops: ['mat_wood', 'mat_herb'] },
            { name: '大雁塔一层', desc: '镇妖塔底层，妖气尚浅。', enemies: ['fox', 'spider', 'sheep', 'toad'], drops: ['mat_iron', 'mat_copper'] },
            { name: '大雁塔顶层', desc: '塔顶妖气冲天，非强者勿入。', enemies: ['bat', 'barbarian', 'tiger'], boss: 'boss_ghost_king', drops: ['mat_essence'] }
        ]
    },
    // 3. 金丹 (Golden Core) - Hell Maze
    {
        realmId: 3,
        maps: [
            { name: '海底迷宫', desc: '深海之下的神秘宫殿。', enemies: ['shrimp', 'crab', 'turtle'], drops: ['mat_crystal', 'mat_sea_shell'] },
            { name: '地狱迷宫', desc: '阴森恐怖，鬼火磷磷。', enemies: ['ghost', 'vampire', 'zombie', 'skeleton'], boss: 'boss_ghost_king', drops: ['mat_bone', 'mat_essence'] },
            { name: '盘丝岭', desc: '盘丝洞外，蛛网密布。', enemies: ['spider', 'rabbit', 'flower'], drops: ['mat_silk', 'mat_herb'] }
        ]
    },
    // 4. 元婴 (Nascent) - Beiju / Dragon Cave
    {
        realmId: 4,
        maps: [
            { name: '北俱芦洲', desc: '冰封万里的苦寒之地。', enemies: ['bear', 'ancient_rui', 'butterfly'], drops: ['mat_crystal'] },
            { name: '龙窟', desc: '蜿蜒曲折的龙之巢穴。', enemies: ['dragon', 'phoenix', 'wind_god'], boss: 'boss_dragon_god', drops: ['mat_essence', 'mat_meteor'] },
            { name: '凤巢', desc: '传说中凤凰栖息之地。', enemies: ['phoenix', 'rain_master'], drops: ['mat_herb'] }
        ]
    },
    // 5. 化神 (Spirit) - Ghost City / Heaven
    {
        realmId: 5,
        maps: [
            { name: '女娲神迹', desc: '上古大神女娲的遗迹。', enemies: ['heaven_soldier', 'heaven_general', 'nuwa_law'], drops: ['mat_crystal'] },
            { name: '无名鬼城', desc: '被遗忘的沙漠古城。', enemies: ['ghost_general', 'vampire', 'nether_judge'], boss: 'boss_ghost_king', drops: ['mat_bone'] },
            { name: '蓬莱仙岛', desc: '云雾缭绕的海上仙山。', enemies: ['turtle', 'dragon_tortoise', 'fog_fairy'], drops: ['mat_herb'] }
        ]
    },
    // 6. 炼虚 (Void) - XiaoXiTian
    {
        realmId: 6,
        maps: [
            { name: '小西天', desc: '佛光中透着诡异妖气。', enemies: ['heaven_soldier', 'flame_demon', 'crane'], drops: ['mat_essence'] },
            { name: '小雷音寺', desc: '伪佛之地。', enemies: ['crane', 'fog_fairy', 'king_kong'], boss: 'boss_ghost_king', drops: ['mat_meteor'] },
            { name: '朱紫国', desc: '西域风情的古国。', enemies: ['puppet_man', 'puppet_beast', 'puppet_bird'], drops: ['mat_silk'] }
        ]
    },
    // 7. 出窍 (Out of Body) - Kylin Mtn
    {
        realmId: 7,
        maps: [
            { name: '麒麟山', desc: '太岁头上动土。', enemies: ['spider', 'rat_general', 'barbarian'], drops: ['mat_bone'] },
            { name: '波月洞', desc: '碗子山的一处妖洞。', enemies: ['cat_spirit', 'leopard', 'scorpion'], boss: 'boss_ghost_king', drops: ['mat_stone'] },
            { name: '墨家村', desc: '隐世的机关术村落。', enemies: ['snake_demon', 'puppet_man', 'asura'], drops: ['mat_wood', 'mat_iron'] }
        ]
    },
    // 8. 分神 (Distraction) - Sumeru
    {
        realmId: 8,
        maps: [
            { name: '须弥东界', desc: '佛家清净地，护法众多。', enemies: ['guard', 'child', 'guangmu'], drops: ['mat_crystal'] },
            { name: '凌云渡', desc: '通往灵山的最后关隘。', enemies: ['guangmu', 'miaoyin', 'king_kong'], drops: ['mat_essence'] },
            { name: '青丘', desc: '九尾狐族的聚居地。', enemies: ['fox', 'moon_charm'], drops: ['mat_herb'] }
        ]
    },
    // 9. 合体 (Integration) - Chi Shui
    {
        realmId: 9,
        maps: [
            { name: '赤水洲', desc: '上古旱魃封印之地。', enemies: ['sun_meteor', 'leopard', 'scorpion'], drops: ['mat_meteor'] },
            { name: '双子峰', desc: '阴阳交汇之地。', enemies: ['moon_charm', 'sun_meteor'], drops: ['mat_crystal'] },
            { name: '轮回司', desc: '掌控生死的终极机构。', enemies: ['ghost_general', 'nether_judge', 'ox_head', 'horse_face'], boss: 'boss_ghost_king', drops: ['mat_bone'] }
        ]
    },
    // 10. 大乘 (Mahayana) - End Game Mortal
    {
        realmId: 10,
        maps: [
            { name: '银华境', desc: '月光凝聚的秘境。', enemies: ['moon_charm', 'dragon_tortoise'], drops: ['mat_essence'] },
            { name: '混沌秘境', desc: '天地初开的一角。', enemies: ['child', 'guard', 'asura'], boss: 'listen', drops: ['mat_meteor'] }
        ]
    },
    // Immortals: High Tier cycling or re-use of Divine pets
    {
        realmId: 17,
        maps: [
            { name: '紫霄宫', desc: '道祖鸿钧讲道之地，万法源头。', enemies: ['heaven_general', 'phoenix', 'child', 'guard', 'listen'], boss: 'boss_chi_you', drops: ['mat_meteor', 'mat_crystal'] }
        ]
    }
];

// Drop Scaling Logic
const getRealmDropConfig = (realmId: number) => {
    // Economy scales 3.5x per realm. 
    // Realm 1: 10-25 SS. Realm 10: ~1M SS.
    const multi = Math.pow(3.5, realmId - 1);

    // Equipment Drop Rate Scaling:
    // Realm 1: 50% (High hook)
    // Decreases by 5% per realm until Realm 10 (5% floor)
    const equipChance = Math.max(0.05, 0.5 - (realmId - 1) * 0.05);

    return {
        ssMin: Math.floor(10 * multi),
        ssMax: Math.floor(25 * multi),
        matChance: 0.2, // 20% chance for materials
        equipChance: equipChance,
        ssChance: 0.3 // 30% chance for Currency (per check)
    };
};

const generateMaps = (): GameMap[] => {
    const maps: GameMap[] = [];

    // 1. Process FWJ Mapped Configs
    FWJ_CONFIG.forEach(config => {
        const realmId = config.realmId;
        const dCfg = getRealmDropConfig(realmId);

        config.maps.forEach((mapCfg, idx) => {
            const mapId = `map_${realmId}_${idx}`;
            const reqRealmExact = realmId <= 1 ? 1 : (realmId - 1) * 10 + 1;

            const enemies: Enemy[] = [];

            // Standard Mobs
            mapCfg.enemies.forEach((tplId) => {
                enemies.push(getEnemy(tplId, realmId));
            });

            // Boss
            if (mapCfg.boss) {
                enemies.push(getEnemy(mapCfg.boss, realmId));
            }

            // Map Drops (Balanced)
            const mapDrops: DropItem[] = [];

            // 1. Spirit Stones (Scaled)
            mapDrops.push({
                itemId: 'spirit_stone',
                min: dCfg.ssMin,
                max: dCfg.ssMax,
                chance: dCfg.ssChance
            });

            // 2. Materials (Fixed config from FWJ_CONFIG)
            if (mapCfg.drops) {
                mapCfg.drops.forEach(d => {
                    mapDrops.push({
                        itemId: d,
                        min: 1,
                        max: 1 + Math.floor(realmId / 5), // Quantities increase slowly
                        chance: dCfg.matChance
                    });
                });
            }

            // 3. Random Equipment (Low chance, appropriate tier)
            const slot = ['weapon', 'armor', 'helm', 'boots'][idx % 4];
            mapDrops.push({
                itemId: `eq_${realmId}_${slot}_common`,
                min: 1,
                max: 1,
                chance: dCfg.equipChance
            });

            maps.push({
                id: mapId,
                name: mapCfg.name,
                desc: mapCfg.desc,
                reqRealmId: reqRealmExact,
                category: realmId > 11 ? '仙界' : (realmId > 5 ? '灵界' : '凡人界'),
                enemies: enemies,
                drops: mapDrops
            });
        });
    });

    // 2. Fallback Gen
    for (let r = 1; r <= 17; r++) {
        if (!FWJ_CONFIG.find(c => c.realmId === r)) {
            const dCfg = getRealmDropConfig(r);

            const enemies = [getEnemy('child', r), getEnemy('guard', r), getEnemy('listen', r)];
            const drops = [
                { itemId: 'spirit_stone', min: dCfg.ssMin, max: dCfg.ssMax, chance: dCfg.ssChance },
                { itemId: 'mat_meteor', min: 1, max: 1, chance: dCfg.matChance },
                { itemId: `eq_${r}_weapon_common`, min: 1, max: 1, chance: dCfg.equipChance }
            ];

            ['天界', '秘境', '禁地'].forEach((type, idx) => {
                maps.push({
                    id: `map_${r}_gen_${idx}`,
                    name: `${r}阶·${type}`,
                    desc: '高阶修士探索之地',
                    reqRealmId: r <= 1 ? 1 : (r - 1) * 10 + 1,
                    category: '仙界',
                    enemies: enemies,
                    drops: drops
                });
            });
        }
    }

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
