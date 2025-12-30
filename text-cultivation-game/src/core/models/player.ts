import type { InventorySlot } from './item';
import type { PlayerSectInfo } from './sect';

// Core interfaces for the Player

export interface PlayerStats {
    atk: number;
    def: number;
    hp: number;
    maxHp: number;
    mp: number; // Spirit / Mana
    maxMp: number;
    critRate: number; // 0-1
    dodgeRate: number; // 0-1
}

export interface PlayerEquipment {
    weapon?: InventorySlot;
    armor?: InventorySlot;
    accessory?: InventorySlot; // Generic Accessory
    helm?: InventorySlot; // Head
    boots?: InventorySlot; // Legs
    necklace?: InventorySlot; // Accessory 1
    belt?: InventorySlot; // Accessory 2 / Relic
}

export interface SpiritRoot {
    metal: number; // 金
    wood: number;  // 木
    water: number; // 水
    fire: number;  // 火
    earth: number; // 土
}

export interface PlayerResources {
    food: number;
    wood: number;
    iron: number;
    herb: number; // New: Spirit Herbs
    maxFood: number;
    maxWood: number;
    maxIron: number;
    maxHerb: number;
}

export interface PlayerAbode {
    level: number; // Cave Level
    servants: {
        total: number;
        // Assignments:
        food: number;
        wood: number;
        iron: number;
        herb: number; // New servant role
        max: number;
    };
    gatheringArrayLevel: number;
    spiritGardenLevel: number; // New facility
}

export interface CultivationState {
    realmId: number; // Current Realm ID (matches constants/realms.ts)
    currentExp: number; // Current Cultivation (Xiuwei)
    bodyRealmId: number; // Body Cultivation Realm ID (future use)
}

export interface Player {
    id: string;
    name: string;
    stats: PlayerStats;
    cultivation: CultivationState;
    spiritRoot: SpiritRoot;
    equipment: PlayerEquipment;
    sect?: PlayerSectInfo;
    skills: {
        learned: string[];
        equipped: string[];
    };
    inventory: InventorySlot[];

    // Resources
    spiritStones: number; // 灵石
    immortalStones: number; // 仙石

    // Abode & Production
    resources: PlayerResources;
    abode: PlayerAbode;

    // Meta
    createTime: number;
    lastLoginTime: number;
}
