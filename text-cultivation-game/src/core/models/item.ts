export type ItemType = 'material' | 'consumable' | 'equipment';
export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

atk ?: number;
def ?: number;
hp ?: number;
mp ?: number;
critRate ?: number;
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
    stats?: ItemStats;    // For equipment
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
    };
}
