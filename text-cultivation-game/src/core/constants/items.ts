import type { Item } from '../models/item';

export const ITEMS: Record<string, Item> = {
    // --- Materials ---
    'mat_wolf_fang': {
        id: 'mat_wolf_fang',
        name: '狼牙',
        type: 'material',
        desc: '野狼的锋利牙齿，可用于锻造。',
        salePrice: 1,
        stackable: true,
    },
    'mat_boar_skin': {
        id: 'mat_boar_skin',
        name: '野猪皮',
        type: 'material',
        desc: '厚实的野猪皮，是制作护甲的基础材料。',
        salePrice: 2,
        stackable: true,
    },

    // --- Consumables ---
    'pill_hp_small': {
        id: 'pill_hp_small',
        name: '回春丹(小)',
        type: 'consumable',
        desc: '初级疗伤丹药，回复 50 点气血。',
        salePrice: 5,
        effectValue: 50,
        stackable: true,
    },

    // --- Equipment (Weapons) ---
    'weap_iron_sword': {
        id: 'weap_iron_sword',
        name: '铁剑',
        type: 'equipment',
        desc: '凡铁打造的长剑。',
        salePrice: 10,
        slot: 'weapon',
        stats: { atk: 5 },
        stackable: false,
    },

    // --- Equipment (Armor) ---
    'armor_cloth': {
        id: 'armor_cloth',
        name: '布衣',
        type: 'equipment',
        desc: '普通的粗布衣裳。',
        salePrice: 5,
        slot: 'armor',
        stats: { def: 2, hp: 10 },
        stackable: false,
    },
};

export const getItem = (id: string): Item | undefined => ITEMS[id];
