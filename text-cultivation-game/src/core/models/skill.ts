export type DamageType = 'physical' | 'fire' | 'water' | 'wood' | 'metal' | 'earth' | 'thunder';
export type SkillType = 'active' | 'passive';
export type SkillTarget = 'single' | 'all' | 'self';

export interface SkillEffect {
    type: 'damage' | 'heal' | 'buff_def' | 'buff_atk';
    value: number; // For damage: multiplier of ATK. For heal: multiplier of MaxHP or flat.
    duration?: number; // For buffs (turns or seconds, we use seconds for now)
}

export interface Skill {
    id: string;
    name: string;
    desc: string;
    type: SkillType;
    damageType?: DamageType;
    target: SkillTarget;

    cooldown: number; // Seconds
    cost: number; // MP cost

    effect: SkillEffect;

    reqRealmId?: number; // Minimum realm to learn
}

export interface PlayerSkillState {
    learnedSkills: string[];
    equippedSkills: string[]; // Max 3
}
