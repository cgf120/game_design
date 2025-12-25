export type ItemType = 'material' | 'consumable' | 'equipment';
export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export interface ItemStats {
    atk?: number;
    def?: number;
    hp?: number;
}

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    desc: string;
    salePrice: number;

    // Specifics
    slot?: EquipmentSlot; // For equipment
    stats?: ItemStats;    // For equipment
    effectValue?: number; // For consumables (e.g. restore HP)
    useEffect?: { type: string, value: string }; // For special consumables
    breakthroughBonus?: number; // Probability boost (0.0 - 1.0)
    stackable: boolean;
}

export interface InventorySlot {
    itemId: string;
    count: number;
}
