export type ItemType = 'material' | 'consumable' | 'equipment';
export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export interface ItemStats {
    atk?: number;
    def?: number;
    hp?: number;
    mp?: number;
    critRate?: number;
    dodgeRate?: number;
}

export interface ItemStatsRange {
    atk?: [number, number];
    def?: [number, number];
    hp?: [number, number];
    mp?: [number, number];
    critRate?: [number, number];
    dodgeRate?: [number, number];
}

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    desc: string;
    salePrice: number;
    icon?: string; // Optional icon override

    // Specifics
    slot?: EquipmentSlot; // For equipment
    stats?: ItemStats;    // Base stats or Average stats for display
    statsRange?: ItemStatsRange; // Min-Max range for RNG
    effectValue?: number; // For consumables (e.g. restore HP)
    useEffect?: { type: string, value: string }; // For special consumables
    breakthroughBonus?: number; // Probability boost (0.0 - 1.0)
    stackable: boolean;
    gemSlots?: number; // Max sockets for gems
}

export interface InventorySlot {
    itemId: string;
    count: number;
    // For unique items (equipment with gems/levels)
    instanceId?: string;
    instanceData?: {
        gems?: string[]; // Array of gem itemIds
        level?: number;  // Enhancement level
        stats?: ItemStats; // Rolled stats for this specific instance
    };
}
