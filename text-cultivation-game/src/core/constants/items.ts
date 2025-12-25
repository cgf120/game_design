import type { Item } from '../models/item';

export const ITEMS: Record<string, Item> = {
    // ... existing items ...
    'spirit_stone': { id: 'spirit_stone', name: '下品灵石', type: 'material', desc: '修仙界的通用货币，蕴含微量灵气。', salePrice: 1, stackable: true },
    'mat_herb': { id: 'mat_herb', name: '低阶灵草', type: 'material', desc: '炼制丹药的基础材料。', salePrice: 5, stackable: true },

    // Equipment (Examples)
    'novice_sword': { id: 'novice_sword', name: '铁剑', type: 'equipment', slot: 'weapon', desc: '凡人铁匠打造的剑。', salePrice: 10, stats: { atk: 5 }, stackable: false },
    'iron_armor': { id: 'iron_armor', name: '铁甲', type: 'equipment', slot: 'armor', desc: '普通的铁制护甲。', salePrice: 10, stats: { def: 3, hp: 20 }, stackable: false },
    'spirit_ring': { id: 'spirit_ring', name: '聚气戒', type: 'equipment', slot: 'accessory', desc: '稍微加快灵气凝聚。', salePrice: 50, stats: { hp: 10, atk: 2 }, stackable: false },

    // Skill Manuals
    'manual_sweep': { id: 'manual_sweep', name: '《横扫千军》残页', type: 'consumable', desc: '记载着大唐官府的入门绝技。使用后学习【横扫千军】。', salePrice: 100, useEffect: { type: 'learn_skill', value: 'skill_sweep' }, stackable: true },
    'manual_dragon_storm': { id: 'manual_dragon_storm', name: '《龙卷雨击》真解', type: 'consumable', desc: '东海龙宫的不传之秘。使用后学习【龙卷雨击】。', salePrice: 500, useEffect: { type: 'learn_skill', value: 'skill_dragon_storm' }, stackable: true },
    'manual_meditation_heal': { id: 'manual_meditation_heal', name: '《气疗术》', type: 'consumable', desc: '基础的疗伤法门。使用后学习【气疗术】。', salePrice: 50, useEffect: { type: 'learn_skill', value: 'skill_meditation_heal' }, stackable: true },

    // Elixirs
    'pill_foundation': { id: 'pill_foundation', name: '筑基丹', type: 'consumable', desc: '突破筑基期的必备丹药，增加突破成功率。', salePrice: 1000, stackable: true, breakthroughBonus: 0.2 },
    'pill_gold_core': { id: 'pill_gold_core', name: '金元丹', type: 'consumable', desc: '凝结金丹的辅助丹药，提升结丹概率。', salePrice: 5000, stackable: true, breakthroughBonus: 0.15 },
    'pill_nascent': { id: 'pill_nascent', name: '凝婴丹', type: 'consumable', desc: '突破元婴期的稀世丹药。', salePrice: 20000, stackable: true, breakthroughBonus: 0.1 },
    'pill_spirit': { id: 'pill_spirit', name: '化神丹', type: 'consumable', desc: '感悟天地规则，助你化神。', salePrice: 100000, stackable: true, breakthroughBonus: 0.05 },
};

export const getItem = (id: string) => ITEMS[id];
