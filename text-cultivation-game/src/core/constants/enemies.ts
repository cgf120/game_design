import type { Enemy } from '../models/combat';
import { REALMS } from './realms';

// Commercial v6.6 Enemy Configuration (Full MHXY Roster)
// Centralized DB for all enemy templates

export interface EnemyTemplate {
    id: string;
    name: string;
    desc?: string;
    skills: string[]; // Skill IDs
    baseStats: {
        hp: number;
        atk: number;
        def: number;
        spd: number;
    };
    isBoss?: boolean;
}

const TEMPLATES: Record<string, EnemyTemplate> = {
    // --- 0-10: Novice (Qi) ---
    'turtle': { id: 'turtle', name: '大海龟', skills: ['es_thick_skin'], baseStats: { hp: 1.2, atk: 0.8, def: 1.3, spd: 0.5 } },
    'frog': { id: 'frog', name: '巨蛙', skills: ['es_water_jet'], baseStats: { hp: 1.0, atk: 1.0, def: 0.9, spd: 1.1 } },
    'caterpillar': { id: 'caterpillar', name: '海毛虫', skills: ['es_poison'], baseStats: { hp: 0.8, atk: 1.3, def: 0.7, spd: 1.2 } },
    'boar': { id: 'boar', name: '野猪', skills: [], baseStats: { hp: 1.4, atk: 0.9, def: 1.0, spd: 0.8 } },
    'tree_monster': { id: 'tree_monster', name: '树怪', skills: ['es_heal'], baseStats: { hp: 1.5, atk: 0.8, def: 1.2, spd: 0.6 } },
    'robber': { id: 'robber', name: '强盗', skills: ['es_sweep'], baseStats: { hp: 1.0, atk: 1.2, def: 0.9, spd: 1.0 } },
    'gambler': { id: 'gambler', name: '赌徒', skills: [], baseStats: { hp: 0.9, atk: 1.1, def: 0.8, spd: 1.1 } },

    // --- 15-35: Early (Foundation) ---
    'wolf': { id: 'wolf', name: '狼', skills: [], baseStats: { hp: 1.0, atk: 1.3, def: 0.8, spd: 1.3 } },
    'spider': { id: 'spider', name: '蜘蛛精', skills: ['es_poison'], baseStats: { hp: 0.9, atk: 1.2, def: 0.9, spd: 1.1 } },
    'toad': { id: 'toad', name: '蛤蟆精', skills: ['es_poison'], baseStats: { hp: 1.3, atk: 0.9, def: 1.1, spd: 0.7 } },
    'fox': { id: 'fox', name: '狐狸精', skills: ['es_charm'], baseStats: { hp: 0.8, atk: 1.3, def: 0.8, spd: 1.4 } },
    'bat': { id: 'bat', name: '大蝙蝠', skills: ['es_high_dodge'], baseStats: { hp: 0.9, atk: 1.1, def: 0.9, spd: 1.5 } },
    'sheep': { id: 'sheep', name: '羊头怪', skills: [], baseStats: { hp: 1.1, atk: 1.1, def: 1.0, spd: 0.9 } },
    'barbarian': { id: 'barbarian', name: '野猪精', skills: ['es_sweep'], baseStats: { hp: 1.5, atk: 1.2, def: 1.0, spd: 0.8 } }, // Using boar spirit name
    'flower': { id: 'flower', name: '花妖', skills: ['es_heal'], baseStats: { hp: 1.1, atk: 0.9, def: 1.1, spd: 1.0 } },
    'tiger': { id: 'tiger', name: '老虎', skills: ['es_sweep'], baseStats: { hp: 1.2, atk: 1.4, def: 1.0, spd: 1.1 } },
    'bear': { id: 'bear', name: '黑熊', skills: ['es_thick_skin'], baseStats: { hp: 1.6, atk: 1.0, def: 1.2, spd: 0.7 } },

    // --- 45-55: Golden Core ---
    'rabbit': { id: 'rabbit', name: '兔子怪', skills: ['es_high_dodge'], baseStats: { hp: 0.9, atk: 1.1, def: 0.8, spd: 1.6 } },
    'black_demon': { id: 'black_demon', name: '黑山老妖', skills: ['es_thick_skin', 'es_vampirism'], baseStats: { hp: 1.5, atk: 1.2, def: 1.4, spd: 0.8 } },
    'bull_demon': { id: 'bull_demon', name: '牛妖', skills: ['es_sweep'], baseStats: { hp: 1.4, atk: 1.3, def: 1.1, spd: 0.9 } },
    'skeleton': { id: 'skeleton', name: '骷髅怪', skills: ['es_ghost_spirit'], baseStats: { hp: 0.8, atk: 1.4, def: 0.7, spd: 1.2 } },
    'zombie': { id: 'zombie', name: '僵尸', skills: ['es_ghost_spirit', 'es_poison'], baseStats: { hp: 1.5, atk: 1.1, def: 1.2, spd: 0.6 } },
    'horse_face': { id: 'horse_face', name: '马面', skills: ['es_ghost_spirit'], baseStats: { hp: 1.2, atk: 1.2, def: 1.0, spd: 1.0 } },
    'ox_head': { id: 'ox_head', name: '牛头', skills: ['es_ghost_spirit'], baseStats: { hp: 1.2, atk: 1.2, def: 1.0, spd: 1.0 } },
    'crab': { id: 'crab', name: '蟹将', skills: ['es_thick_skin'], baseStats: { hp: 1.1, atk: 1.2, def: 1.3, spd: 0.8 } },
    'shrimp': { id: 'shrimp', name: '虾兵', skills: ['es_sweep'], baseStats: { hp: 1.0, atk: 1.1, def: 1.0, spd: 1.1 } },

    // --- 65-75: Nascent ---
    'butterfly': { id: 'butterfly', name: '蝴蝶仙子', skills: ['es_high_dodge', 'es_heal'], baseStats: { hp: 0.9, atk: 1.1, def: 0.9, spd: 1.4 } },
    'ancient_rui': { id: 'ancient_rui', name: '古代瑞兽', skills: ['es_hellfire'], baseStats: { hp: 1.2, atk: 1.3, def: 1.1, spd: 1.0 } },
    'hell_guard': { id: 'hell_guard', name: '地狱战神', skills: ['es_sweep', 'es_high_crit'], baseStats: { hp: 1.3, atk: 1.4, def: 1.1, spd: 1.1 } },
    'wind_god': { id: 'wind_god', name: '风伯', skills: ['es_high_dodge'], baseStats: { hp: 1.0, atk: 1.2, def: 1.0, spd: 1.5 } },
    'rain_master': { id: 'rain_master', name: '雨师', skills: ['es_flood'], baseStats: { hp: 1.1, atk: 1.2, def: 1.1, spd: 1.1 } },
    'dragon': { id: 'dragon', name: '蛟龙', skills: ['es_flood'], baseStats: { hp: 1.2, atk: 1.4, def: 1.1, spd: 1.2 } },
    'phoenix': { id: 'phoenix', name: '凤凰', skills: ['es_hellfire', 'es_high_dodge'], baseStats: { hp: 1.1, atk: 1.4, def: 1.0, spd: 1.4 } },

    // --- 85-95: Spirit Severing ---
    'heaven_soldier': { id: 'heaven_soldier', name: '天兵', skills: ['es_thick_skin'], baseStats: { hp: 1.4, atk: 1.2, def: 1.5, spd: 0.9 } },
    'heaven_general': { id: 'heaven_general', name: '天将', skills: ['es_sweep'], baseStats: { hp: 1.3, atk: 1.4, def: 1.2, spd: 1.0 } },
    'vampire': { id: 'vampire', name: '吸血鬼', skills: ['es_vampirism', 'es_ghost_spirit'], baseStats: { hp: 1.1, atk: 1.3, def: 1.0, spd: 1.2 } },
    'ghost_general': { id: 'ghost_general', name: '鬼将', skills: ['es_high_crit', 'es_sweep'], baseStats: { hp: 1.2, atk: 1.6, def: 1.1, spd: 1.0 } },
    'ghost': { id: 'ghost', name: '幽灵', skills: ['es_ghost_spirit'], baseStats: { hp: 1.0, atk: 1.1, def: 1.0, spd: 1.3 } },
    'nether_judge': { id: 'nether_judge', name: '吸血鬼王', skills: ['es_vampirism'], baseStats: { hp: 1.5, atk: 1.5, def: 1.2, spd: 1.1 } }, // Reusing/Mapping

    // --- 105: Void Refining ---
    'nuwa_law': { id: 'nuwa_law', name: '律法女娲', skills: ['es_sweep', 'es_thick_skin'], baseStats: { hp: 1.3, atk: 1.5, def: 1.3, spd: 1.2 } },
    'nuwa_magic': { id: 'nuwa_magic', name: '灵符女娲', skills: ['es_hellfire'], baseStats: { hp: 1.2, atk: 1.6, def: 1.1, spd: 1.1 } },
    'nuwa_bottle': { id: 'nuwa_bottle', name: '净瓶女娲', skills: ['es_heal'], baseStats: { hp: 1.5, atk: 1.0, def: 1.4, spd: 1.0 } },

    // --- 125+: Out of Body ---
    'fog_fairy': { id: 'fog_fairy', name: '雾中仙', skills: ['es_high_dodge'], baseStats: { hp: 1.2, atk: 1.1, def: 1.1, spd: 1.6 } },
    'crane': { id: 'crane', name: '灵鹤', skills: ['es_thunder_storm'], baseStats: { hp: 1.0, atk: 1.7, def: 0.9, spd: 1.4 } },
    'flame_demon': { id: 'flame_demon', name: '炎魔神', skills: ['es_hellfire'], baseStats: { hp: 1.4, atk: 1.5, def: 1.3, spd: 0.9 } },
    'night_rakshasa': { id: 'night_rakshasa', name: '夜罗刹', skills: ['es_high_crit'], baseStats: { hp: 1.1, atk: 1.8, def: 0.9, spd: 1.5 } },

    // --- 135+: Distraction ---
    'king_kong': { id: 'king_kong', name: '大力金刚', skills: ['es_sweep'], baseStats: { hp: 1.4, atk: 1.8, def: 1.2, spd: 1.0 } },
    'dragon_tortoise': { id: 'dragon_tortoise', name: '龙龟', skills: ['es_water_jet', 'es_thick_skin'], baseStats: { hp: 1.8, atk: 1.0, def: 1.8, spd: 0.8 } },
    'cat_spirit': { id: 'cat_spirit', name: '猫灵', skills: ['es_high_crit', 'es_high_dodge'], baseStats: { hp: 1.0, atk: 1.5, def: 1.0, spd: 1.7 } },
    'leopard': { id: 'leopard', name: '狂豹', skills: ['es_high_crit'], baseStats: { hp: 1.2, atk: 1.6, def: 1.1, spd: 1.3 } },
    'scorpion': { id: 'scorpion', name: '蝎子精', skills: ['es_poison'], baseStats: { hp: 1.2, atk: 1.4, def: 1.2, spd: 1.2 } },
    'snake_demon': { id: 'snake_demon', name: '巴蛇', skills: ['es_poison'], baseStats: { hp: 1.3, atk: 1.3, def: 1.1, spd: 1.4 } },

    // --- 155+: Integration ---
    'puppet_man': { id: 'puppet_man', name: '机关人', skills: ['es_thick_skin'], baseStats: { hp: 1.6, atk: 1.5, def: 1.6, spd: 0.8 } },
    'puppet_beast': { id: 'puppet_beast', name: '机关兽', skills: ['es_sweep'], baseStats: { hp: 1.5, atk: 1.6, def: 1.4, spd: 1.0 } },
    'puppet_bird': { id: 'puppet_bird', name: '机关鸟', skills: ['es_high_dodge'], baseStats: { hp: 1.2, atk: 1.5, def: 1.1, spd: 1.5 } },
    'asura': { id: 'asura', name: '修罗傀儡鬼', skills: ['es_high_crit'], baseStats: { hp: 1.3, atk: 1.8, def: 1.0, spd: 1.2 } },

    // --- 175+: Mahayana/Immortal ---
    'child': { id: 'child', name: '毗舍童子', skills: ['es_sweep', 'es_high_crit'], baseStats: { hp: 1.3, atk: 1.7, def: 1.2, spd: 1.2 } },
    'guard': { id: 'guard', name: '持国巡守', skills: ['es_hellfire', 'es_thick_skin'], baseStats: { hp: 1.5, atk: 1.5, def: 1.5, spd: 1.0 } },
    'listen': { id: 'listen', name: '谛听', skills: ['es_thunder_storm', 'es_hellfire', 'es_flood'], baseStats: { hp: 1.4, atk: 2.0, def: 1.3, spd: 1.3 } }, // The magic nuke
    'moon_charm': { id: 'moon_charm', name: '月魅', skills: ['es_charm'], baseStats: { hp: 1.2, atk: 1.6, def: 1.2, spd: 1.4 } },
    'sun_meteor': { id: 'sun_meteor', name: '日陨', skills: ['es_hellfire'], baseStats: { hp: 1.5, atk: 1.5, def: 1.2, spd: 1.0 } },
    'guangmu': { id: 'guangmu', name: '广目巡守', skills: ['es_thick_skin'], baseStats: { hp: 1.8, atk: 1.1, def: 1.8, spd: 0.9 } },
    'miaoyin': { id: 'miaoyin', name: '妙音鸟', skills: ['es_high_dodge'], baseStats: { hp: 1.0, atk: 1.4, def: 1.0, spd: 1.8 } },

    // Boss Templates
    'boss_ghost_king': { id: 'boss_ghost_king', name: '[BOSS] 万年鬼王', isBoss: true, skills: ['es_hellfire', 'es_vampirism', 'es_sweep'], baseStats: { hp: 5.0, atk: 2.0, def: 1.5, spd: 1.2 } },
    'boss_dragon_god': { id: 'boss_dragon_god', name: '[BOSS] 龙神', isBoss: true, skills: ['es_flood', 'es_thunder_storm', 'es_thick_skin'], baseStats: { hp: 8.0, atk: 2.5, def: 2.0, spd: 1.5 } },
    'boss_chi_you': { id: 'boss_chi_you', name: '[BOSS] 蚩尤', isBoss: true, skills: ['es_sweep', 'es_high_crit', 'es_hellfire'], baseStats: { hp: 10.0, atk: 3.0, def: 2.5, spd: 1.5 } },
};

// Generic fallback
const DEFAULT_TEMPLATE: EnemyTemplate = { id: 'mob', name: '未知怪物', skills: [], baseStats: { hp: 1, atk: 1, def: 1, spd: 1 } };

// Calculate stats based on Realm ID
const getRealmBaseStats = (realmId: number) => {
    // 3.5x scaling
    const multi = Math.pow(3.5, realmId - 1);
    return {
        hp: Math.floor(2000 * multi),
        atk: Math.floor(100 * multi),
        def: Math.floor(80 * multi),
        exp: Math.floor(50 * Math.pow(1.1, (realmId - 1) * 10)),
    };
};

export const getEnemy = (templateId: string, realmId: number, overrideName?: string): Enemy => {
    const tpl = TEMPLATES[templateId] || { ...DEFAULT_TEMPLATE, name: overrideName || '怪物' };
    const base = getRealmBaseStats(realmId);

    const isBoss = tpl.isBoss || false;

    const hp = Math.floor(base.hp * tpl.baseStats.hp * (isBoss ? 20 : 1));
    const maxHp = hp;
    const atk = Math.floor(base.atk * tpl.baseStats.atk);
    const def = Math.floor(base.def * tpl.baseStats.def);

    // Drops logic
    const drops: any[] = [{ itemId: 'spirit_stone', min: 1, max: realmId * 10, chance: 0.5 }];
    if (isBoss) {
        const slot = ['weapon', 'armor', 'necklace', 'belt', 'boots'][realmId % 5];
        drops.push({ itemId: `eq_${realmId}_${slot}_legend`, chance: 0.1, min: 1, max: 1 });
        drops.push({ itemId: `eq_${realmId}_${slot}_rare`, chance: 0.5, min: 1, max: 1 });
    } else if (Math.random() > 0.8) {
        const slot = ['weapon', 'armor', 'helm'][Math.floor(Math.random() * 3)];
        drops.push({ itemId: `eq_${realmId}_${slot}_common`, chance: 0.05, min: 1, max: 1 });
    }

    // Skill Logic: ensure valid skill IDs, map generic ones if needed, or leave as is since they are strings

    return {
        id: `e_${templateId}_${realmId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: overrideName || tpl.name,
        level: realmId,
        realmId: realmId,
        stats: { hp, maxHp, atk, def },
        expReward: base.exp * (isBoss ? 5 : 1),
        drops: drops,
        skills: tpl.skills
    };
};
