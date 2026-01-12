import mhxyDataRaw from './mhxy_items.json';
import type { Item, EquipmentSlot, ItemType } from '../models/item';

// --- Configuration & Constants ---

// Realm config for scaling reference (Level 1-10 -> Realm 1, etc.)
const STAT_GROWTH = 3.5;
const BASE_STATS: Record<string, number> = {
    atk: 50, def: 20, hp: 200, mp: 100, spd: 10, critRate: 0.01, dodgeRate: 0.01
};

// Slot Mapping (MHXY Chinese to Internal ID)
const SLOT_MAP: Record<string, EquipmentSlot> = {
    '武器': 'weapon',
    '刀': 'weapon',
    '剑': 'weapon',
    '枪': 'weapon',
    '斧': 'weapon',
    '棒': 'weapon',
    '弓弩': 'weapon',
    '扇': 'weapon', // Fan is weapon
    '双短剑': 'weapon',
    '飘带': 'weapon',
    '爪刺': 'weapon',
    '锤': 'weapon',
    '鞭': 'weapon',
    '环圈': 'weapon',
    '巨剑': 'weapon',
    '灯笼': 'weapon',
    '宝珠': 'weapon',
    '伞': 'weapon',


    '铠甲': 'armor',
    '男衣': 'armor',
    '女衣': 'armor',
    '衣': 'armor',

    '头盔': 'helm',
    '发钗': 'helm',
    '冠': 'helm', // Official term often

    '鞋子': 'boots',
    '靴': 'boots',

    '腰带': 'belt',

    '饰品': 'necklace',
    '项链': 'necklace',
};

// Icon Mapping
const ICON_MAP: Record<string, string> = {
    weapon: 'icon_type_weapon',
    armor: 'icon_type_armor',
    helm: 'icon_type_armor',
    boots: 'icon_type_armor',
    necklace: 'icon_type_accessory',
    belt: 'icon_type_accessory',
    gem: 'icon_jewel',
    consumable: 'icon_type_pill',
    material: 'icon_type_material',
};

// --- Helper Functions ---

function getRealmFromLevel(level: number): number {
    if (!level || isNaN(level)) return 1;
    // Map existing items (which go up to ~150-160) to Realms (1-17)
    // Simple 10 levels per realm
    return Math.max(1, Math.ceil(level / 10));
}

function getStatsForSlot(slot: EquipmentSlot, realm: number, qualityMult: number = 1): { stats: any, statsRange: any } {
    const realmMult = Math.pow(STAT_GROWTH, realm - 1); // Realm 1 = Growth^0 = 1

    // Define Main/Sub stats per slot
    const slotCfg = {
        'weapon': { main: 'atk', sub: 'critRate' },
        'armor': { main: 'def', sub: 'hp' },
        'helm': { main: 'hp', sub: 'def' },
        'boots': { main: 'spd', sub: 'dodgeRate' },
        'necklace': { main: 'mp', sub: 'atk' },
        'belt': { main: 'hp', sub: 'def' },
        'accessory': { main: 'hp', sub: 'atk' } // Fallback
    }[slot] || { main: 'hp', sub: 'def' };

    const statsRange: any = {};

    // Helper to calculate range
    const setRange = (key: string, base: number) => {
        const val = base * realmMult * qualityMult;
        const isRate = key.includes('Rate');

        if (isRate) {
            // Rates shouldn't scale exponentially to infinity, clamp them
            // Or use a much lower growth for rates
            const rateVal = Math.min(0.5, val); // Max 50%
            const min = parseFloat((rateVal * 0.8).toFixed(4));
            const max = parseFloat((rateVal * 1.2).toFixed(4));
            statsRange[key] = [min, max];
        } else {
            const min = Math.max(1, Math.floor(val * 0.8));
            const max = Math.floor(val * 1.2);
            statsRange[key] = [min, max];
        }
    };

    setRange(slotCfg.main, BASE_STATS[slotCfg.main] || 10);
    if (slotCfg.sub) {
        // Sub stat is weaker? Let's say 50% effectiveness for secondary
        setRange(slotCfg.sub, (BASE_STATS[slotCfg.sub] || 10) * 0.5);
    }

    return { stats: {}, statsRange }; // Return empty fixed stats, allow rolling via statsRange
}

function parseGemStats(effect: string): any {
    if (!effect) return {};
    const stats: any = {};

    // Example: "【效果】增加12点防御力"
    // Regex mapping
    if (effect.includes('防御')) stats.def = extractNumber(effect);
    if (effect.includes('伤害')) stats.atk = extractNumber(effect);
    if (effect.includes('灵力')) stats.mp = extractNumber(effect);
    if (effect.includes('气血')) stats.hp = extractNumber(effect);
    if (effect.includes('速度')) stats.spd = extractNumber(effect);
    if (effect.includes('躲避')) stats.dodgeRate = extractNumber(effect) / 1000;
    if (effect.includes('命中')) stats.critRate = extractNumber(effect) / 2000;

    if (effect.includes('吸收率')) stats.def = 5; // Placeholder

    return stats;
}

function extractNumber(str: string): number {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1]!) : 0;
}

// --- Generator ---

const generateItems = (): Record<string, Item> => {
    const items: Record<string, Item> = {};


    // 1. Load MHXY Data (Filtered)
    (mhxyDataRaw as any[]).forEach((entry: any, index: number) => {
        let type: ItemType = 'material'; // Default
        let slot: EquipmentSlot | undefined = undefined;
        const name = entry['名称'];
        const chineseType = entry['类型'];
        const level = entry['等级'] || 0;

        let id = `mhxy_${index}`;

        // --- Categorization ---
        if (['宝石'].includes(chineseType)) {
            type = 'gem';
            id = `gem_${name}`; // Readable ID for gems
        } else if (['药品', '三级药', '二级药'].some(t => chineseType && chineseType.includes(t))) {
            type = 'consumable';
        } else {
            // Check for equipment slots
            // MHXY uses '部位' (Slot) like '铠甲', '剑'
            const part = entry['部位'];

            // Check Explicit Slot (mapped from '部位')
            if (part && typeof part === 'string') {
                const mappedSlot = Object.entries(SLOT_MAP).find(([k]) => part.includes(k))?.[1];
                if (mappedSlot) {
                    slot = mappedSlot;
                    type = 'equipment';
                }
            }

            // Fallback: Check Type (e.g. Type="武器")
            if (!slot && chineseType) {
                const mappedSlot = Object.entries(SLOT_MAP).find(([k]) => chineseType.includes(k))?.[1];
                if (mappedSlot) {
                    slot = mappedSlot;
                    type = 'equipment';
                }
            }
        }

        // --- Filter ---
        if (chineseType && chineseType.includes('召唤兽')) return;
        if (chineseType === '元身' && isNaN(level)) return; // Skip crafting bases for now

        // --- Construction ---
        // If we found a valid category
        if (type === 'equipment' && slot) {
            // Normalize ID
            const baseId = `eq_${name}`;
            id = items[baseId] ? `eq_${name}_${index}` : baseId;

            const realm = getRealmFromLevel(level);
            const { statsRange } = getStatsForSlot(slot, realm);

            items[id] = {
                id,
                name: name,
                type: 'equipment',
                slot: slot,
                desc: entry['说明'] || '无描述',
                salePrice: Math.max(10, entry['价格'] || 100),
                stackable: false,
                icon: ICON_MAP[slot],
                statsRange,
                gemSlots: Math.max(1, Math.floor(level / 30)),
                reqRealm: realm
            };
        } else if (type === 'gem') {
            const stats = parseGemStats(entry['效果'] || '');
            // Skip invalid gems w/o stats
            if (Object.keys(stats).length === 0) return;

            if (items[id]) return; // Skip duplicates

            items[id] = {
                id,
                name: name,
                type: 'gem',
                desc: entry['说明'],
                salePrice: entry['价格'] || 500,
                stackable: true,
                icon: ICON_MAP['gem'],
                stats
            };
        }
    });

    // 2. Add Essential Functional Items (Preserve Logic)
    // Custom Pills with logic
    items['pill_foundation'] = { id: 'pill_foundation', name: '筑基丹', type: 'consumable', desc: '突破筑基期的关键丹药 (+20%成功率)', salePrice: 1000, stackable: true, icon: 'icon_type_pill', breakthroughBonus: 0.2 };
    items['pill_gold_core'] = { id: 'pill_gold_core', name: '金丹', type: 'consumable', desc: '凝结金丹的辅助丹药 (+20%成功率)', salePrice: 5000, stackable: true, icon: 'icon_type_pill', breakthroughBonus: 0.2 };

    // Essential Currency
    items['spirit_stone'] = { id: 'spirit_stone', name: '灵石', type: 'material', desc: '通用货币', salePrice: 1, stackable: true, icon: 'ui_stat_spiritstone' };

    // Manuals
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
            value: 'sk_sect_sweep'
        }
    };

    return items;
};

export const ITEMS = generateItems();
export const getItem = (id: string) => ITEMS[id];

export const getRandomEquipmentId = (realm: number, slot?: string): string => {
    const candidates = Object.values(ITEMS).filter(i =>
        i.type === 'equipment' &&
        i.reqRealm === realm &&
        (!slot || i.slot === slot)
    );

    if (candidates.length === 0) {
        // Fallback: try finding ANY equipment near this realm
        const fallback = Object.values(ITEMS).filter(i => i.type === 'equipment' && i.reqRealm);
        if (fallback.length === 0) return 'spirit_stone';
        // Find closest realm match
        fallback.sort((a, b) => Math.abs((a.reqRealm || 0) - realm) - Math.abs((b.reqRealm || 0) - realm));
        return fallback[0].id;
    }

    const item = candidates[Math.floor(Math.random() * candidates.length)];
    return item.id;
};
