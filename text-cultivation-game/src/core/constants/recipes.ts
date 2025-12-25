
export interface Recipe {
    id: string;
    name: string;
    outputId: string; // ID from items.ts
    cost: {
        wood?: number;
        iron?: number;
        herb?: number;
        spiritStones?: number;
    };
    description: string;
    unlockLevel: number; // Abode Level required
}

export const RECIPES: Recipe[] = [
    // --- Basic Weapons ---
    {
        id: 'craft_weapon_youlong',
        name: '打造 [游龙剑]',
        outputId: 'weapon_youlong',
        cost: {
            wood: 50,
            iron: 20,
            spiritStones: 100
        },
        description: '消耗灵石与凡铁，尝试打造一把游龙剑。',
        unlockLevel: 1
    },
    // --- Basic Armor ---
    {
        id: 'craft_armor_wucai',
        name: '缝制 [五彩裙]',
        outputId: 'armor_wucai',
        cost: {
            wood: 30,
            herb: 50,
            spiritStones: 100
        },
        description: '以灵草纤维与木材，编织五彩丝线。',
        unlockLevel: 1
    },
    // --- Intermediate Weapons (Example) ---
    {
        id: 'craft_weapon_pophe',
        name: '铸造 [破魄]',
        outputId: 'weapon_pophe',
        cost: {
            iron: 200,
            wood: 50,
            spiritStones: 500
        },
        description: '需大量玄铁，辅以灵石之火锻造。',
        unlockLevel: 2
    },
    // --- Intermediate Armor ---
    {
        id: 'craft_armor_skull',
        name: '炼制 [骷髅战甲]',
        outputId: 'armor_skull',
        cost: {
            iron: 150,
            herb: 100, // Bones replaced by "organic" cost representation
            spiritStones: 500
        },
        description: '需消耗大量材料模拟魔兽骨骼的硬度。',
        unlockLevel: 2
    },
    // --- Consumables ---
    // Maybe alchemy later? For now just equipment forging.
];

export const getRecipesByLevel = (level: number) => {
    return RECIPES.filter(r => r.unlockLevel <= level);
};
