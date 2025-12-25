import type { Item } from '../models/item';

export const ITEMS: Record<string, Item> = {
    // ... existing items ...
    'spirit_stone': { id: 'spirit_stone', name: '下品灵石', type: 'material', desc: '修仙界的通用货币，蕴含微量灵气。', salePrice: 1, stackable: true },
    'mat_herb': { id: 'mat_herb', name: '低阶灵草', type: 'material', desc: '炼制丹药的基础材料。', salePrice: 5, stackable: true },

    // Equipment (Examples)
    // Equipment (Fantasy Westward Journey Style)
    'weapon_youlong': { id: 'weapon_youlong', name: '游龙剑', type: 'equipment', slot: 'weapon', desc: '古代名剑。剑身柔软，可如腰带般束于腰间。', salePrice: 500, stats: { atk: 15 }, stackable: false },
    'weapon_pophe': { id: 'weapon_pophe', name: '破魄', type: 'equipment', slot: 'weapon', desc: '剑身由玄铁铸造，隐隐透出一股寒气，摄人心魄。', salePrice: 2000, stats: { atk: 45, critRate: 0.05 }, stackable: false },

    'armor_wucai': { id: 'armor_wucai', name: '五彩裙', type: 'equipment', slot: 'armor', desc: '用五彩丝线织成的裙子，色彩绚丽。', salePrice: 500, stats: { def: 10, hp: 50 }, stackable: false },
    'armor_skull': { id: 'armor_skull', name: '骷髅战甲', type: 'equipment', slot: 'armor', desc: '魔界流传出的宝甲，以上古魔兽骨骼打造。', salePrice: 2000, stats: { def: 30, hp: 200 }, stackable: false },

    'accessory_moon': { id: 'accessory_moon', name: '月光', type: 'equipment', slot: 'accessory', desc: '吸收了月之精华的项链，佩戴者心静如水。', salePrice: 500, stats: { mp: 50, atk: 5 }, stackable: false },
    'accessory_rainbow': { id: 'accessory_rainbow', name: '七彩玲珑石', type: 'equipment', slot: 'accessory', desc: '女娲补天遗留下的七彩神石，拥有神秘的力量。', salePrice: 2000, stats: { mp: 150, atk: 15, hp: 100 }, stackable: false },

    // Skill Manuals
    'manual_sweep': { id: 'manual_sweep', name: '《横扫千军》残页', type: 'consumable', desc: '记载着大唐官府的入门绝技。使用后学习【横扫千军】。', salePrice: 100, useEffect: { type: 'learn_skill', value: 'skill_sweep' }, stackable: true, icon: 'icon_skills' },
    'manual_dragon_storm': { id: 'manual_dragon_storm', name: '《龙卷雨击》真解', type: 'consumable', desc: '东海龙宫的不传之秘。使用后学习【龙卷雨击】。', salePrice: 500, useEffect: { type: 'learn_skill', value: 'skill_dragon_storm' }, stackable: true, icon: 'icon_skills' },
    'manual_meditation_heal': { id: 'manual_meditation_heal', name: '《气疗术》', type: 'consumable', desc: '基础的疗伤法门。使用后学习【气疗术】。', salePrice: 50, useEffect: { type: 'learn_skill', value: 'skill_meditation_heal' }, stackable: true, icon: 'icon_skills' },

    // Elixirs
    'pill_foundation': { id: 'pill_foundation', name: '筑基丹', type: 'consumable', desc: '突破筑基期的必备丹药，增加突破成功率。', salePrice: 1000, stackable: true, breakthroughBonus: 0.2 },
    'pill_gold_core': { id: 'pill_gold_core', name: '金元丹', type: 'consumable', desc: '凝结金丹的辅助丹药，提升结丹概率。', salePrice: 5000, stackable: true, breakthroughBonus: 0.15 },
    'pill_nascent': { id: 'pill_nascent', name: '凝婴丹', type: 'consumable', desc: '突破元婴期的稀世丹药。', salePrice: 20000, stackable: true, breakthroughBonus: 0.1 },
    'pill_spirit': { id: 'pill_spirit', name: '化神丹', type: 'consumable', desc: '感悟天地规则，助你化神。', salePrice: 100000, stackable: true, breakthroughBonus: 0.05 },

    // --- FWJ Gems ---
    'gem_sun': { id: 'gem_sun', name: '太阳石', type: 'material', desc: '至阳之石，镶嵌在武器上可提升攻击力。', salePrice: 1000, stackable: true, stats: { atk: 8 }, icon: 'ui_stat_atk' },
    'gem_moon': { id: 'gem_moon', name: '月亮石', type: 'material', desc: '至阴之石，镶嵌在防具上可提升防御力。', salePrice: 1000, stackable: true, stats: { def: 12 }, icon: 'ui_stat_def' },
    'gem_light': { id: 'gem_light', name: '光芒石', type: 'material', desc: '光芒四射，镶嵌在防具/饰品上可提升气血。', salePrice: 1000, stackable: true, stats: { hp: 40 }, icon: 'ui_stat_hp' },
    'gem_black': { id: 'gem_black', name: '黑宝石', type: 'material', desc: '神秘的黑宝石，镶嵌在饰品上可提升速度（闪避）。', salePrice: 1000, stackable: true, stats: { critRate: 0.01 }, icon: 'ui_stat_mp' }, // Using crit/speed loosely

    // --- FWJ High Tier Equipment ---
    // Lv 60
    'weapon_qinggang': { id: 'weapon_qinggang', name: '青刚剑', type: 'equipment', slot: 'weapon', desc: '百炼精钢打造，削铁如泥。', salePrice: 5000, stats: { atk: 180 }, stackable: false, gemSlots: 3 },
    'armor_night': { id: 'armor_night', name: '夜魔披风', type: 'equipment', slot: 'armor', desc: '来自魔界的披风，隐匿气息。', salePrice: 5000, stats: { def: 55, hp: 300 }, stackable: false, gemSlots: 3 },
    'accessory_flower': { id: 'accessory_flower', name: '花雨', type: 'equipment', slot: 'accessory', desc: '花瓣凝聚而成的项链，香气袭人。', salePrice: 5000, stats: { mp: 200, critRate: 0.02 }, stackable: false, gemSlots: 3 },

    // Lv 80
    'weapon_beidou': { id: 'weapon_beidou', name: '北斗七星剑', type: 'equipment', slot: 'weapon', desc: '剑身镶嵌七星，引动星辰之力。', salePrice: 20000, stats: { atk: 320, critRate: 0.05 }, stackable: false, gemSlots: 4 },
    'armor_dragon': { id: 'armor_dragon', name: '龙骨甲', type: 'equipment', slot: 'armor', desc: '上古龙骨打磨而成的战甲。', salePrice: 20000, stats: { def: 110, hp: 800 }, stackable: false, gemSlots: 4 },
    'accessory_phoenix': { id: 'accessory_phoenix', name: '凤翅项链', type: 'equipment', slot: 'accessory', desc: '凤凰羽翼化作的项链，涅槃重生。', salePrice: 20000, stats: { mp: 500, hp: 200, atk: 20 }, stackable: false, gemSlots: 4 },

    // Lv 100
    'weapon_yitian': { id: 'weapon_yitian', name: '倚天剑', type: 'equipment', slot: 'weapon', desc: '安得倚天抽宝剑，将汝裁为三截！', salePrice: 100000, stats: { atk: 600, critRate: 0.1 }, stackable: false, gemSlots: 5 },
    'armor_golden': { id: 'armor_golden', name: '金蚕衣', type: 'equipment', slot: 'armor', desc: '金蚕丝混以天蚕丝织就，水火不侵。', salePrice: 100000, stats: { def: 250, hp: 2000 }, stackable: false, gemSlots: 5 },
    'accessory_soul': { id: 'accessory_soul', name: '万里追魂', type: 'equipment', slot: 'accessory', desc: '追魂夺命，无处可逃。', salePrice: 100000, stats: { mp: 1000, atk: 50, critRate: 0.05 }, stackable: false, gemSlots: 5 },
};

export const getItem = (id: string) => ITEMS[id];
