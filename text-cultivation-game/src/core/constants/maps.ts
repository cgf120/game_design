import type { GameMap, Enemy } from '../models/combat';

// Helper to create simple enemies
const createEnemy = (id: string, name: string, realmId: number, hp: number, atk: number, def: number, exp: number, drops: { itemId: string, chance: number }[] = []): Enemy => ({
    id, name, level: realmId, realmId,
    stats: { hp, maxHp: hp, atk, def },
    expReward: exp,
    drops: drops.map(d => ({ ...d, min: 1, max: 1 }))
});

export const MAPS: GameMap[] = [
    // --- 新手区域 (Novice) ---
    {
        id: 'xy_city_outskirts',
        name: '建邺城郊',
        desc: '新手初入江湖的地方，海风吹拂。',
        reqRealmId: 1, // 练气一层
        category: '新手区域',
        enemies: [
            createEnemy('e_turtle', '大海龟', 1, 30, 5, 0, 5, [{ itemId: 'spirit_stone', chance: 0.1 }]),
            createEnemy('e_frog', '巨蛙', 2, 50, 8, 2, 8, [{ itemId: 'mat_herb', chance: 0.2 }]),
        ]
    },
    {
        id: 'dh_bay',
        name: '东海湾',
        desc: '风景秀丽的海湾，曾有神龙出没的传说。',
        reqRealmId: 3, // 练气三层
        category: '新手区域',
        enemies: [
            createEnemy('e_crab', '海毛虫', 3, 100, 15, 5, 12),
            createEnemy('e_shrimp', '虾兵', 4, 150, 20, 8, 15, [{ itemId: 'weap_iron_sword', chance: 0.1 }]),
        ]
    },

    // --- 神州大地 (Divine Land) ---
    {
        id: 'jn_field',
        name: '江南野外',
        desc: '连接长安城的主要道路，草木茂盛。',
        reqRealmId: 5, // 练气五层
        category: '神州大地',
        enemies: [
            createEnemy('e_boar', '野猪', 5, 200, 30, 10, 20, [{ itemId: 'mat_boar_skin', chance: 0.5 }]),
            createEnemy('e_bandit', '强盗', 6, 250, 40, 12, 25, [{ itemId: 'spirit_stone', chance: 0.3 }]),
        ]
    },
    {
        id: 'dt_border',
        name: '大唐国境',
        desc: '国境边缘，治安混乱，常有猛兽。',
        reqRealmId: 8, // 练气八层
        category: '神州大地',
        enemies: [
            createEnemy('e_bear', '黑熊', 8, 500, 60, 20, 40),
            createEnemy('e_tiger', '老虎', 9, 600, 70, 25, 50),
        ]
    },
    {
        id: 'dy_pagoda',
        name: '大雁塔',
        desc: '塔内镇压着无数妖魔鬼怪，越往上越危险。',
        reqRealmId: 11, // 筑基初期
        category: '神州大地',
        enemies: [
            createEnemy('e_fox', '狐狸精', 11, 2000, 150, 50, 100, [{ itemId: 'pill_foundation', chance: 0.05 }]),
            createEnemy('e_bat', '大蝙蝠', 12, 2500, 180, 60, 120),
        ]
    },

    // --- 幽冥鬼界 (Netherworld) ---
    {
        id: 'df_maze',
        name: '地狱迷宫',
        desc: '阴森恐怖的地下迷宫，冤魂不散。',
        reqRealmId: 13, // 筑基后期
        category: '幽冥鬼界',
        enemies: [
            createEnemy('e_ghost', '幽灵', 13, 5000, 300, 100, 200),
            createEnemy('e_vampire', '吸血鬼', 14, 8000, 400, 150, 300, [{ itemId: 'pill_gold_core', chance: 0.02 }]),
        ]
    },

    // --- 海外仙岛 (Overseas) ---
    {
        id: 'bj_north',
        name: '北俱芦洲',
        desc: '终年积雪的苦寒之地，人迹罕至。',
        reqRealmId: 21, // 金丹初期
        category: '海外仙岛',
        enemies: [
            createEnemy('e_bear_polar', '白熊', 21, 20000, 1000, 500, 1000),
            createEnemy('e_ancient_瑞', '古代瑞兽', 22, 30000, 1500, 800, 1500),
        ]
    },
    {
        id: 'long_palace',
        name: '龙窟',
        desc: '传说中神龙的巢穴，藏宝无数。',
        reqRealmId: 31, // 元婴初期
        category: '海外仙岛',
        enemies: [
            createEnemy('e_dragon_guard', '龙宫护卫', 31, 100000, 5000, 2000, 5000, [{ itemId: 'pill_nascent', chance: 0.01 }]),
            createEnemy('e_phoenix', '凤凰', 33, 200000, 8000, 3000, 8000),
        ]
    },

    // --- 天界 (Celestial) ---
    {
        id: 'st_mountain',
        name: '狮驼岭',
        desc: '妖魔聚集之地，凶险异常。',
        reqRealmId: 41, // 化神初期
        category: '天界',
        enemies: [
            createEnemy('e_lion_king', '狮驼岭大王', 41, 1000000, 20000, 10000, 50000, [{ itemId: 'pill_spirit', chance: 0.005 }]),
        ]
    },
    {
        id: 'small_thunder',
        name: '小雷音寺',
        desc: '伪佛之地，金碧辉煌中透着妖气。',
        reqRealmId: 43, // 化神后期
        category: '天界',
        enemies: [
            createEnemy('e_evil_monk', '妖僧', 43, 2000000, 40000, 20000, 100000),
        ]
    },

    // --- Special / Task Maps ---
    {
        id: 'sect_patrol',
        name: '宗门周边',
        desc: '宗门巡逻区域，潜伏着不明身份的敌人。',
        reqRealmId: 1,
        category: '宗门任务',
        isHidden: true,
        enemies: [
            createEnemy('sect_intruder', '鬼祟之人', 2, 80, 15, 5, 10, [{ itemId: 'spirit_stone', chance: 0.5 }])
        ]
    }
];
