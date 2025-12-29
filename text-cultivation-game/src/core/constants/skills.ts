import type { Skill } from '../models/skill';

// Commercial v6.7 Unified Skill Database (MHXY Style)
// Categories: Sect, Enemy, Equip, Gang

// 1. SECT SKILLS (Player)
// ----------------------------------------------------------------
const SECT_SKILLS: Record<string, Skill> = {
    // --- 1. Datang Government (DT) - Physical Burst ---
    'dt_sweep': {
        id: 'dt_sweep', name: '横扫千军', desc: '消耗气血，对敌人造成3次毁灭性打击，下回合休息。',
        category: 'sect', type: 'active', damageType: 'physical', target: 'single',
        cooldown: 0, costType: 'hp', cost: 10, // 10% Current HP (Need logic support)
        effect: { type: 'multi_hit', value: 3, subType: 'physical' }
    },
    'dt_slash': {
        id: 'dt_slash', name: '后发制人', desc: '临时提高防御，下回合第一速度攻击敌人。',
        category: 'sect', type: 'active', damageType: 'physical', target: 'single',
        cooldown: 2, costType: 'mp', cost: 50,
        effect: { type: 'damage', value: 1.5 }
    },
    'dt_break': {
        id: 'dt_break', name: '破釜沉舟', desc: '攻击多个敌人，伤害不俗。',
        category: 'sect', type: 'active', damageType: 'physical', target: 'row',
        cooldown: 1, costType: 'mp', cost: 80,
        effect: { type: 'damage', value: 1.2 }
    },

    // --- 2. Dragon Palace (LG) - Magic AoE ---
    'lg_tornado': {
        id: 'lg_tornado', name: '龙卷雨击', desc: '召唤水龙卷攻击全体敌人。',
        category: 'sect', type: 'active', damageType: 'water', target: 'all',
        cooldown: 0, costType: 'mp', cost: 100,
        effect: { type: 'damage', value: 0.9 } // Scaling w/ targets? Simple for now
    },
    'lg_shot': {
        id: 'lg_shot', name: '龙腾', desc: '单体强力水系法术。',
        category: 'sect', type: 'active', damageType: 'water', target: 'single',
        cooldown: 0, costType: 'mp', cost: 50,
        effect: { type: 'damage', value: 1.5 }
    },
    'lg_buff': {
        id: 'lg_buff', name: '逆鳞', desc: '提升自身法术伤害。',
        category: 'sect', type: 'active', target: 'self',
        cooldown: 5, costType: 'hp', cost: 50,
        effect: { type: 'buff_stats', value: 0.2, subType: 'atk', turnDuration: 5 }
    },

    // --- 3. Shituo Ridge (STL) - Physical Transformation ---
    'stl_transform': {
        id: 'stl_transform', name: '变身', desc: '进入变身状态，允许使用鹰击/象形。',
        category: 'sect', type: 'active', target: 'self',
        cooldown: 6, costType: 'mp', cost: 30,
        effect: { type: 'buff_stats', value: 0.1, subType: 'atk', turnDuration: 4 }
    },
    'stl_eagle': {
        id: 'stl_eagle', name: '鹰击', desc: '（需变身）攻击全体敌人，下回合休息。',
        category: 'sect', type: 'active', damageType: 'physical', target: 'all',
        cooldown: 0, costType: 'mp', cost: 50,
        effect: { type: 'damage', value: 1.1 }
    },
    'stl_lion': {
        id: 'stl_lion', name: '狮搏', desc: '（需变身）忽视大量防御攻击单体。',
        category: 'sect', type: 'active', damageType: 'physical', target: 'single',
        cooldown: 0, costType: 'mp', cost: 40,
        effect: { type: 'damage', value: 1.4 } // Ignore def logic needed
    },

    // --- 4. Putuo Mt (PT) - Fixed Dmg / Support ---
    'pt_five': {
        id: 'pt_five', name: '五行咒', desc: '对多个敌人造成固定伤害。',
        category: 'sect', type: 'active', damageType: 'metal', target: 'all',
        cooldown: 0, costType: 'mp', cost: 50,
        effect: { type: 'damage', value: 1.0 } // Fixed dmg usually
    },
    'pt_lantern': {
        id: 'pt_lantern', name: '普渡众生', desc: '持续恢复目标气血。',
        category: 'sect', type: 'active', target: 'ally',
        cooldown: 0, costType: 'mp', cost: 80,
        effect: { type: 'heal', value: 0.2, turnDuration: 3 }
    },
    'pt_revive': {
        id: 'pt_revive', name: '杨柳甘露', desc: '复活并恢复气血。',
        category: 'sect', type: 'active', target: 'ally',
        cooldown: 5, costType: 'mp', cost: 150,
        effect: { type: 'revive', value: 0.5 }
    }
};

// 2. ENEMY SKILLS (AI)
// ----------------------------------------------------------------
const ENEMY_SKILLS: Record<string, Skill> = {
    // Passives
    'es_high_crit': {
        id: 'es_high_crit', name: '高级必杀', desc: '物理暴击率提升20%。',
        category: 'enemy', type: 'passive', target: 'self', cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'buff_stats', value: 0.2, subType: 'critRate' }
    },
    'es_high_dodge': {
        id: 'es_high_dodge', name: '高级飞行', desc: '物理闪避率提升20%。',
        category: 'enemy', type: 'passive', target: 'self', cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'buff_stats', value: 0.2, subType: 'dodgeRate' }
    },
    'es_vampirism': {
        id: 'es_vampirism', name: '高级吸血', desc: '物理攻击时吸取30%气血。',
        category: 'enemy', type: 'passive', target: 'self', cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'heal', value: 0.3 } // Subtype logic needed for on-hit
    },
    'es_ghost_spirit': {
        id: 'es_ghost_spirit', name: '高级鬼魂', desc: '死亡5回合后自动复活。',
        category: 'enemy', type: 'passive', target: 'self', cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'revive', value: 1.0 }
    },
    'es_thick_skin': {
        id: 'es_thick_skin', name: '高级防御', desc: '物理防御提升20%。',
        category: 'enemy', type: 'passive', target: 'self', cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'buff_stats', value: 0.2, subType: 'def' }
    },

    // Actives
    'es_hellfire': {
        id: 'es_hellfire', name: '地狱烈火', desc: '群体火系法术。',
        category: 'enemy', type: 'active', damageType: 'fire', target: 'all',
        cooldown: 3, costType: 'mp', cost: 0,
        effect: { type: 'damage', value: 1.4 }
    },
    'es_water_jet': {
        id: 'es_water_jet', name: '水漫金山', desc: '群体水系法术。',
        category: 'enemy', type: 'active', damageType: 'water', target: 'all',
        cooldown: 3, costType: 'mp', cost: 0,
        effect: { type: 'damage', value: 1.4 }
    },
    'es_thunder_storm': {
        id: 'es_thunder_storm', name: '雷霆万钧', desc: '单体强力雷咒。',
        category: 'enemy', type: 'active', damageType: 'thunder', target: 'single',
        cooldown: 2, costType: 'mp', cost: 0,
        effect: { type: 'damage', value: 2.0 }
    },
    'es_sweep': {
        id: 'es_sweep', name: '连环击', desc: '疯狂攻击敌人（仿横扫）。',
        category: 'enemy', type: 'active', damageType: 'physical', target: 'single',
        cooldown: 4, costType: 'hp', cost: 0,
        effect: { type: 'multi_hit', value: 3 }
    },
    'es_poison': {
        id: 'es_poison', name: '尸腐毒', desc: '攻击并附加中毒效果。',
        category: 'enemy', type: 'active', damageType: 'wood', target: 'single',
        cooldown: 2, costType: 'mp', cost: 0,
        effect: { type: 'debuff_stats', value: 0.1, subType: 'hp', turnDuration: 3 }
    },
    'es_charm': {
        id: 'es_charm', name: '含情脉脉', desc: '封印敌人行动。',
        category: 'enemy', type: 'active', target: 'single',
        cooldown: 5, costType: 'mp', cost: 0,
        effect: { type: 'seal', value: 1.0, turnDuration: 2 }
    }
};

// 3. EQUIPMENT SKILLS (Teji / SP)
// ----------------------------------------------------------------
const EQUIP_SKILLS: Record<string, Skill> = {
    'tj_shatter': {
        id: 'tj_shatter', name: '破血狂攻', desc: '消耗80愤怒，对敌方单体进行2次物理攻击。',
        category: 'equip_active', type: 'active', damageType: 'physical', target: 'single',
        cooldown: 0, costType: 'sp', cost: 80,
        effect: { type: 'multi_hit', value: 2 }
    },
    'tj_weakness': {
        id: 'tj_weakness', name: '弱点击破', desc: '消耗50愤怒，忽视高防御进行攻击。',
        category: 'equip_active', type: 'active', damageType: 'physical', target: 'single',
        cooldown: 0, costType: 'sp', cost: 50,
        effect: { type: 'damage', value: 1.2 } // + Ignore def
    },
    'tj_iq': {
        id: 'tj_iq', name: '破碎无双', desc: '消耗100愤怒，物理攻击同时打掉对方魔法。',
        category: 'equip_active', type: 'active', damageType: 'physical', target: 'single',
        cooldown: 0, costType: 'sp', cost: 100,
        effect: { type: 'damage', value: 1.0 } // + Mana burn
    },
    'tj_mercy': {
        id: 'tj_mercy', name: '慈航普渡', desc: '消耗150愤怒（需满气血），复活全体队友并回满血。',
        category: 'equip_active', type: 'active', target: 'all',
        cooldown: 10, costType: 'sp', cost: 150,
        effect: { type: 'revive', value: 1.0 }
    },
    'tj_cleanse': {
        id: 'tj_cleanse', name: '晶清诀', desc: '消耗150愤怒，解除全体异常并回血15%。',
        category: 'equip_active', type: 'active', target: 'all',
        cooldown: 5, costType: 'sp', cost: 150,
        effect: { type: 'cleanse', value: 0.15 }
    },
    // Passives (Texiao)
    'tx_rage': {
        id: 'tx_rage', name: '愤怒', desc: '使用特技消耗的愤怒值减少20%。',
        category: 'equip_passive', type: 'passive', target: 'self',
        cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'buff_stats', value: 0.8, subType: 'sp_cost' }
    },
    'tx_god_bless': {
        id: 'tx_god_bless', name: '神佑', desc: '死亡时有20%几率复活并恢复300 HP。',
        category: 'equip_passive', type: 'passive', target: 'self',
        cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'revive', value: 300, chance: 0.2 }
    }
};

// 4. GANG SKILLS (Passive Boosts)
// ----------------------------------------------------------------
const GANG_SKILLS: Record<string, Skill> = {
    'gang_strong_body': {
        id: 'gang_strong_body', name: '强身术', desc: '永久增加气血上限。',
        category: 'gang', type: 'passive', target: 'self',
        cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'buff_stats', value: 0.01, subType: 'hp' } // 1% per level
    },
    'gang_meditation': {
        id: 'gang_meditation', name: '冥想', desc: '永久增加魔法上限。',
        category: 'gang', type: 'passive', target: 'self',
        cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'buff_stats', value: 0.01, subType: 'mp' }
    },
    'gang_iron_skin': {
        id: 'gang_iron_skin', name: '钢筋铁骨', desc: '永久增加防御力。',
        category: 'gang', type: 'passive', target: 'self',
        cooldown: 0, costType: 'none', cost: 0,
        effect: { type: 'buff_stats', value: 0.01, subType: 'def' }
    }
};

// --- EXPORT ---
export const SKILLS: Record<string, Skill> = {
    ...SECT_SKILLS,
    ...ENEMY_SKILLS,
    ...EQUIP_SKILLS,
    ...GANG_SKILLS
};

export const getSkill = (id: string): Skill | undefined => SKILLS[id];

export const getSkillsByCategory = (category: string): Skill[] => {
    return Object.values(SKILLS).filter(s => s.category === category);
};
