import type { Item } from '../models/item';

export const ITEMS: Record<string, Item> = {
    // ... existing items ...
    'spirit_stone': { id: 'spirit_stone', name: '下品灵石', type: 'material', desc: '修仙界的通用货币，蕴含微量灵气。', price: 1, stackable: true },
    'mat_herb': { id: 'mat_herb', name: '低阶灵草', type: 'material', desc: '炼制丹药的基础材料。', price: 5, stackable: true },

    // Equipment (Examples)
    'novice_sword': { id: 'novice_sword', name: '铁剑', type: 'weapon', desc: '凡人铁匠打造的剑。', price: 10, stats: { atk: 5 } },
    'iron_armor': { id: 'iron_armor', name: '铁甲', type: 'armor', desc: '普通的铁制护甲。', price: 10, stats: { def: 3, hp: 20 } },
    'spirit_ring': { id: 'spirit_ring', name: '聚气戒', type: 'accessory', desc: '稍微加快灵气凝聚。', price: 50, stats: { hp: 10, atk: 2 } },

    // Skill Manuals
    'manual_sweep': { id: 'manual_sweep', name: '《横扫千军》残页', type: 'consumable', desc: '记载着大唐官府的入门绝技。使用后学习【横扫千军】。', price: 100, useEffect: { type: 'learn_skill', value: 'skill_sweep' } },
    'manual_dragon_storm': { id: 'manual_dragon_storm', name: '《龙卷雨击》真解', type: 'consumable', desc: '东海龙宫的不传之秘。使用后学习【龙卷雨击】。', price: 500, useEffect: { type: 'learn_skill', value: 'skill_dragon_storm' } },
    'manual_meditation_heal': { id: 'manual_meditation_heal', name: '《气疗术》', type: 'consumable', desc: '基础的疗伤法门。使用后学习【气疗术】。', price: 50, useEffect: { type: 'learn_skill', value: 'skill_meditation_heal' } },
};

export const getItem = (id: string) => ITEMS[id];
