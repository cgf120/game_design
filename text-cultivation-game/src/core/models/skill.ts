export type SkillCategory = 'sect' | 'gang' | 'equip_active' | 'equip_passive' | 'enemy';
export type SkillType = 'active' | 'passive';
export type DamageType = 'physical' | 'fire' | 'water' | 'wood' | 'metal' | 'earth' | 'thunder' | 'none';
export type SkillTarget = 'single' | 'all' | 'self' | 'ally' | 'row';
export type CostType = 'mp' | 'hp' | 'sp' | 'none';

export interface SkillEffect {
    type: 'damage' | 'heal' | 'buff_stats' | 'debuff_stats' | 'seal' | 'revive' | 'cleanse' | 'multi_hit';
    value: number; // Multiplier or Flat value
    subType?: string; // For buff/debuff: 'atk', 'def', 'spd'. For damage: element.
    turnDuration?: number; // Duration in Turns
    chance?: number; // 0-1
}

export interface Skill {
    id: string;
    name: string;
    desc: string;
    category: SkillCategory;
    type: SkillType;
    damageType?: DamageType;
    target: SkillTarget;

    cooldown: number; // Rounds
    costType: CostType;
    cost: number;

    effect: SkillEffect;
    reqRealmId?: number;
}

export interface PlayerSkillState {
    learnedSkills: string[];
    equippedSkills: string[]; // Max 3
}
