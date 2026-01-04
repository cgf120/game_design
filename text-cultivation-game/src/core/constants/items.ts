import type { Item } from '../models/item';

// Commercial v6.8 Refined Naming & Generation System (Skills Integrated)

const SLOTS = ['weapon', 'armor', 'helm', 'boots', 'necklace', 'belt'] as const;
const QUALITIES = [
    { id: 'common', name: '凡品', color: '#fff', mult: 1.0 },
    { id: 'uncommon', name: '下品', color: '#4caf50', mult: 1.2 },
    { id: 'rare', name: '中品', color: '#2196f3', mult: 1.5 },
    { id: 'epic', name: '上品', color: '#9c27b0', mult: 2.0 },
    { id: 'legend', name: '极品', color: '#ff9800', mult: 3.0 },
];

const PREFIX_ATTR = ['寒冰', '烈火', '青木', '庚金', '厚土', '疾风', '紫电', '幽冥', '光明', '混沌'];
const PREFIX_BEAST = ['青龙', '白虎', '朱雀', '玄武', '麒麟', '饕餮', '穷奇', '鲲鹏', '真龙', '天凤'];
const MATERIAL_LOW = ['凡铁', '精钢', '赤铜', '寒铁', '百炼钢'];
const MATERIAL_MID = ['玄铁', '秘银', '精金', '乌金', '星辰砂', '雷击木', '万年冰', '赤焰石'];
const MATERIAL_HIGH = ['天外陨铁', '太乙精金', '混沌原石', '补天石', '世界树枝', '九天息壤', '鸿蒙紫气', '虚空结晶'];

const SLOT_NAMES: Record<string, string[]> = {
    'weapon': ['剑', '刀', '枪', '戟', '尺', '印', '幡', '鼎'],
    'armor': ['甲', '衣', '袍', '铠', '纱', '宝衣'],
    'helm': ['冠', '盔', '巾', '发簪', '面具'],
    'boots': ['靴', '履', '鞋', '步云履', '摘星靴'],
    'necklace': ['链', '佩', '珠', '护符', '璎珞'],
    'belt': ['带', '腰带', '束带', '如意扣', '混天绫'],
};

// Skill Pools - IDs must match skills.ts
const TEJI_POOL = ['tj_shatter', 'tj_weakness', 'tj_iq', 'tj_mercy', 'tj_cleanse'];
const TEXIAO_POOL = ['tx_rage', 'tx_god_bless'];

// Realm config
const REALM_CONFIG = [
    { id: 1, name: '练气', mat: MATERIAL_LOW },
    { id: 2, name: '筑基', mat: MATERIAL_LOW },
    { id: 3, name: '金丹', mat: MATERIAL_MID },
    { id: 4, name: '元婴', mat: MATERIAL_MID },
    { id: 5, name: '化神', mat: MATERIAL_MID },
    { id: 6, name: '炼虚', mat: MATERIAL_HIGH },
    { id: 7, name: '出窍', mat: MATERIAL_HIGH },
    { id: 8, name: '分神', mat: MATERIAL_HIGH },
    { id: 9, name: '合体', mat: MATERIAL_HIGH },
    { id: 10, name: '大乘', mat: MATERIAL_HIGH },
    { id: 11, name: '渡劫', mat: MATERIAL_HIGH },
    { id: 12, name: '散仙', mat: MATERIAL_HIGH },
    { id: 13, name: '真仙', mat: MATERIAL_HIGH },
    { id: 14, name: '玄仙', mat: MATERIAL_HIGH },
    { id: 15, name: '金仙', mat: MATERIAL_HIGH },
    { id: 16, name: '准圣', mat: MATERIAL_HIGH },
    { id: 17, name: '圣人', mat: MATERIAL_HIGH },
];

const BASE_STATS: Record<string, number> = { atk: 50, def: 20, hp: 200, mp: 100, spd: 10, critRate: 0.01, dodgeRate: 0.01 };
const STAT_GROWTH = 3.5;

function getName(realmId: number, slot: string, qualityId: string): string {
    const rConf = REALM_CONFIG[realmId - 1] || REALM_CONFIG[REALM_CONFIG.length - 1];
    const mats = rConf.mat;

    // Deterministic Pick
    const mat = mats[(realmId + slot.length) % mats.length];
    const type = SLOT_NAMES[slot][(realmId * 2) % SLOT_NAMES[slot].length];

    if (qualityId === 'common' || qualityId === 'uncommon') {
        return `${mat}${type}`;
    } else if (qualityId === 'rare' || qualityId === 'epic') {
        const attr = PREFIX_ATTR[(realmId + slot.length) % PREFIX_ATTR.length];
        return `${attr}${mat}${type}`;
    } else {
        const beast = PREFIX_BEAST[(realmId + slot.length) % PREFIX_BEAST.length];
        return `${beast}${mat}${type}`;
    }
}

// Icon Mapping Strategy (Matched to existing assets):
const ICON_MAP: Record<string, string> = {
    weapon: 'icon_type_weapon',
    armor: 'icon_type_armor',
    helm: 'icon_type_armor',   // Fallback to armor icon
    boots: 'icon_type_armor',  // Fallback to armor icon
    necklace: 'icon_type_accessory',
    belt: 'icon_type_accessory'
};

const generateItems = (): Record<string, Item> => {
    const items: Record<string, Item> = {};

    items['spirit_stone'] = { id: 'spirit_stone', name: '灵石', type: 'material', desc: '通用货币', salePrice: 1, stackable: true, icon: 'ui_stat_spiritstone' };

    // Gathering Materials
    // Using 'icon_type_material' for general mats if specific ones don't exist
    // 'item_herb' etc do NOT exist, so use generic
    const MATS = [
        { id: 'mat_herb', name: '药草', desc: '普通的草药。', price: 5, icon: 'icon_type_material' },
        { id: 'mat_wood', name: '木材', desc: '建筑材料。', price: 5, icon: 'icon_type_material' },
        { id: 'mat_iron', name: '铁矿', desc: '锻造材料。', price: 10, icon: 'icon_type_material' },
        { id: 'mat_copper', name: '铜矿', desc: '锻造材料。', price: 10, icon: 'icon_type_material' },
        { id: 'mat_sea_shell', name: '海贝', desc: '海边的贝壳。', price: 5, icon: 'icon_type_material' },
        { id: 'mat_essence', name: '妖气结晶', desc: '妖兽掉落的结晶。', price: 50, icon: 'icon_type_material' },
        { id: 'mat_bone', name: '兽骨', desc: '炼器材料。', price: 20, icon: 'icon_type_material' },
        { id: 'mat_silk', name: '蛛丝', desc: '编织材料。', price: 30, icon: 'icon_type_material' },
        { id: 'mat_crystal', name: '水晶', desc: '蕴含灵气。', price: 100, icon: 'icon_type_material' },
        { id: 'mat_stone', name: '矿石', desc: '普通的矿石。', price: 15, icon: 'icon_type_material' },
        { id: 'mat_meteor', name: '陨铁', desc: '天外之物。', price: 500, icon: 'icon_type_material' },
    ];

    MATS.forEach(m => {
        items[m.id] = { id: m.id, name: m.name, type: 'material', desc: m.desc, salePrice: m.price, stackable: true, icon: m.icon };
    });

    // --- NEW: Pills (Breakthrough) ---
    const PILLS = [
        { id: 'pill_foundation', name: '筑基丹', desc: '突破筑基期的关键丹药，增加突破成功率。', price: 1000 },
        { id: 'pill_gold_core', name: '金丹', desc: '凝结金丹的辅助丹药。', price: 5000 },
        { id: 'pill_nascent', name: '元婴丹', desc: '碎丹成婴的灵丹妙药。', price: 20000 },
        { id: 'pill_spirit', name: '化神丹', desc: '化神期突破专用。', price: 100000 },
        { id: 'pill_void', name: '炼虚丹', desc: '感悟虚空的丹药。', price: 500000 },
    ];
    PILLS.forEach(p => {
        items[p.id] = {
            id: p.id,
            name: p.name,
            type: 'consumable',
            desc: p.desc,
            salePrice: p.price,
            stackable: true,
            icon: 'icon_type_pill',
            breakthroughBonus: 0.2 // 20% success rate bonus per pill
        };
    });

    // --- NEW: Gems ---
    // Using standard types that map to stats
    const GEMS = [
        { id: 'gem_atk', name: '红玛瑙', desc: '蕴含狂暴力量的宝石 (攻+50)', stats: { atk: 50 }, color: '#f44336' },
        { id: 'gem_def', name: '月亮石', desc: '坚硬无比的宝石 (防+20)', stats: { def: 20 }, color: '#9e9e9e' },
        { id: 'gem_hp', name: '光芒石', desc: '充满生命力的宝石 (血+200)', stats: { hp: 200 }, color: '#4caf50' },
        { id: 'gem_spd', name: '黑宝石', desc: '轻盈的宝石 (速+5)', stats: { spd: 5 }, color: '#212121' },
    ];
    GEMS.forEach(g => {
        items[g.id] = {
            id: g.id,
            name: g.name,
            type: 'gem', // New type
            desc: g.desc,
            salePrice: 200,
            stackable: true,
            icon: 'icon_jewel', // Make sure this asset exists or use fallback
            stats: g.stats
        };
    });

    // --- NEW: Manuals (Skill Books) ---
    // Placeholder for manual_sweep used in SettingsView
    items['manual_sweep'] = {
        id: 'manual_sweep',
        name: '《横扫千军》秘籍',
        type: 'consumable',
        desc: '记载着强力功法的卷轴。',
        salePrice: 0,
        stackable: true,
        icon: 'icon_type_paper',
        useEffect: {
            type: 'learn_skill',
            value: 'sk_sect_sweep' // Must match ID in skills.ts
        }
    };


    REALM_CONFIG.forEach((realm, rIdx) => {
        const realmMult = Math.pow(STAT_GROWTH, rIdx);

        SLOTS.forEach(slot => {
            const tiers = ['common', 'rare', 'legend'];

            tiers.forEach(tierKey => {
                const quality = QUALITIES.find(q => q.id === tierKey)!;
                const itemId = `eq_${realm.id}_${slot}_${tierKey}`;

                const fancyName = getName(realm.id, slot, tierKey);

                const slotCfg = {
                    'weapon': { main: 'atk', sub: 'critRate' },
                    'armor': { main: 'def', sub: 'hp' },
                    'helm': { main: 'hp', sub: 'def' },
                    'boots': { main: 'spd', sub: 'dodgeRate' },  // Boots provide Speed
                    'necklace': { main: 'mp', sub: 'atk' },
                    'belt': { main: 'hp', sub: 'def' },
                }[slot];

                // Stats Range Logic
                // Guobiao (Standard) = Min = Base Value
                // Max = Guobiao / 0.75 (Implies Guobiao is 75% of Max)
                const statsRange: any = {};

                // Helper to set range
                const setRange = (key: string, baseVal: number, isRate: boolean) => {
                    if (baseVal <= 0) return;

                    if (isRate) {
                        const min = parseFloat(baseVal.toFixed(4));
                        const max = parseFloat((baseVal / 0.75).toFixed(4));
                        statsRange[key] = [min, max];
                    } else {
                        // Integer types
                        const min = Math.max(1, Math.floor(baseVal));
                        const max = Math.floor(baseVal / 0.75);
                        statsRange[key] = [min, max];
                    }
                };

                const mainVal = (BASE_STATS[slotCfg.main] || 0) * realmMult * quality.mult;

                const isMainRate = slotCfg.main.includes('Rate');
                const mainBase = isMainRate ? Math.min(0.3, mainVal) : Math.floor(mainVal);
                setRange(slotCfg.main, mainBase, isMainRate);

                if (slotCfg.sub) {
                    const subVal = (BASE_STATS[slotCfg.sub] || 0) * realmMult * quality.mult * 0.5;
                    const isSubRate = slotCfg.sub.includes('Rate');
                    const subBase = isSubRate ? Math.min(0.15, subVal) : Math.floor(subVal);
                    setRange(slotCfg.sub, subBase, isSubRate);
                }

                // Skill Logic
                const itemSkills: string[] = [];
                if (tierKey === 'legend') {
                    if (slot === 'belt') {
                        itemSkills.push('tx_rage');
                    } else if (slot === 'necklace' || slot === 'helm') {
                        itemSkills.push(TEJI_POOL[rIdx % TEJI_POOL.length]);
                    } else if (Math.random() > 0.5) {
                        itemSkills.push(TEJI_POOL[(rIdx + 1) % TEJI_POOL.length]);
                    }
                }

                const iconKey = ICON_MAP[slot] || 'icon_bag';

                items[itemId] = {
                    id: itemId,
                    name: fancyName,
                    type: 'equipment',
                    slot: slot,
                    desc: `流传于${realm.name}修士之间的${quality.name}法宝。`,
                    salePrice: Math.floor(100 * realmMult * quality.mult),
                    stackable: false,
                    statsRange: statsRange,
                    gemSlots: Math.floor(rIdx / 4) + 1,
                    skills: itemSkills.length > 0 ? itemSkills : undefined,
                    icon: iconKey
                };
            });
        });
    });

    return items;
};

export const ITEMS = generateItems();
export const getItem = (id: string) => ITEMS[id];
