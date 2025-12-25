import type { Skill } from '../models/skill';

export const SKILLS: Record<string, Skill> = {
    // --- Physics / Melee (Physical) ---
    'skill_sweep': {
        id: 'skill_sweep',
        name: '横扫千军',
        desc: '消耗气血，对敌人造成300%攻击力的物理伤害，气势如虹。',
        type: 'active',
        damageType: 'physical',
        target: 'single',
        cooldown: 10,
        cost: 0, // Costs HP logic to be handled separately or simulated as high MP for MVP? Let's use MP for now for simplicity, or 0.
        effect: { type: 'damage', value: 3.0 },
        reqRealmId: 1
    },
    'skill_slash': {
        id: 'skill_slash',
        name: '破釜沉舟',
        desc: '孤注一掷，对敌人造成250%攻击力的伤害。',
        type: 'active',
        damageType: 'physical',
        target: 'single',
        cooldown: 8,
        cost: 20,
        effect: { type: 'damage', value: 2.5 },
        reqRealmId: 1
    },

    // --- Magic (Spells) ---
    'skill_dragon_storm': {
        id: 'skill_dragon_storm',
        name: '龙卷雨击',
        desc: '召唤水龙卷，对敌人造成180%攻击力的水系伤害。',
        type: 'active',
        damageType: 'water',
        target: 'all', // Treating as AoE (though 1v1 mostly now)
        cooldown: 6,
        cost: 30,
        effect: { type: 'damage', value: 1.8 },
        reqRealmId: 2
    },
    'skill_samadhi_fire': {
        id: 'skill_samadhi_fire',
        name: '三昧真火',
        desc: '喷吐无法熄灭的真火，造成220%攻击力的火系伤害。',
        type: 'active',
        damageType: 'fire',
        target: 'single',
        cooldown: 5,
        cost: 25,
        effect: { type: 'damage', value: 2.2 },
        reqRealmId: 2
    },
    'skill_thunder': {
        id: 'skill_thunder',
        name: '五雷轰顶',
        desc: '引动九天神雷，造成280%攻击力的雷系伤害。',
        type: 'active',
        damageType: 'thunder',
        target: 'single',
        cooldown: 12,
        cost: 50,
        effect: { type: 'damage', value: 2.8 },
        reqRealmId: 3
    },

    // --- Support ---
    'skill_diamond_protect': {
        id: 'skill_diamond_protect',
        name: '金刚护体',
        desc: '如金刚怒目，提升自身防御力。',
        type: 'active',
        target: 'self',
        cooldown: 20,
        cost: 40,
        effect: { type: 'buff_def', value: 0.5, duration: 10 }, // +50% Def for 10s
        reqRealmId: 2
    },
    'skill_meditation_heal': {
        id: 'skill_meditation_heal',
        name: '气疗术',
        desc: '调运气机，恢复20%最大生命值。',
        type: 'active',
        target: 'self',
        cooldown: 15,
        cost: 30,
        effect: { type: 'heal', value: 0.2 },
        reqRealmId: 1
    }
};

export function getSkill(id: string): Skill | undefined {
    return SKILLS[id];
}
