import type { GameMap, Enemy } from '../models/combat';

// Helper to create simple enemies
const createEnemy = (id: string, name: string, realmId: number, hp: number, atk: number, def: number, exp: number, drops: { itemId: string, chance: number }[] = []): Enemy => ({
    id, name, level: realmId, realmId,
    stats: { hp, maxHp: hp, atk, def },
    expReward: exp,
    drops: drops.map(d => ({ ...d, min: 1, max: 1 }))
});

export const MAPS: GameMap[] = [
    {
        id: 'm1',
        name: '后山',
        desc: '宗门后山的外围区域，常有野兽出没。',
        reqRealmId: 1, // 练气一层
        enemies: [
            createEnemy('e1', '野狼', 1, 50, 8, 0, 5, [
                { itemId: 'mat_wolf_fang', chance: 1.0 }, // 100%
                { itemId: 'weap_iron_sword', chance: 0.2 } // 20%
            ]),
            createEnemy('e2', '狂暴野猪', 2, 80, 12, 2, 8, [
                { itemId: 'mat_boar_skin', chance: 1.0 }, // 100%
                { itemId: 'armor_cloth', chance: 0.2 } // 20%
            ]),
        ]
    },
    {
        id: 'm2',
        name: '幽暗密林',
        desc: '阳光难以穿透的密林，阴气森森。',
        reqRealmId: 5, // 练气五层
        enemies: [
            createEnemy('e3', '青蛇', 5, 200, 30, 10, 20, [
                { itemId: 'mat_herb', chance: 0.5 }
            ]),
            createEnemy('e4', '幽灵', 6, 150, 45, 5, 25, [
                { itemId: 'spirit_stone', chance: 0.3 }
            ]),
        ]
    },
    {
        id: 'sect_patrol',
        name: '宗门周边',
        desc: '宗门巡逻区域，偶尔有宵小之辈出没。',
        reqRealmId: 1,
        enemies: [] // Scaled dynamics handled in logic
    }
];
