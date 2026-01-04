export type ItemType = 'material' | 'consumable' | 'equipment' | 'gem';
export type EquipmentSlot = 'weapon' | 'armor' | 'accessory' | 'helm' | 'boots' | 'necklace' | 'belt';

export interface ItemStats {
    atk?: number;
    def?: number;
    hp?: number;
    mp?: number;
    critRate?: number;
    dodgeRate?: number;
    spd?: number; // Speed
}

export interface ItemStatsRange {
    atk?: [number, number];
    def?: [number, number];
    hp?: [number, number];
    mp?: [number, number];
    critRate?: [number, number];
    dodgeRate?: [number, number];
    spd?: [number, number];
}

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    desc: string;
    salePrice: number;
    icon?: string;

    // Specifics
    slot?: EquipmentSlot;
    stats?: ItemStats;
    statsRange?: ItemStatsRange;
    effectValue?: number;
    useEffect?: { type: string, value: string };
    breakthroughBonus?: number;
    stackable: boolean;
    gemSlots?: number;

    // New Fields
    skills?: string[]; // IDs of attached skills (Teji/Texiao)
}

export interface InventorySlot {
    itemId: string;
    count: number;
    instanceId?: string;
    instanceData?: {
        gems?: string[];
        level?: number;
        stats?: ItemStats;
        skills?: string[]; // Rolled skills
    };
}
