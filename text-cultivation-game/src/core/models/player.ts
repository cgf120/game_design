// Core interfaces for the Player

export interface PlayerStats {
    atk: number;
    def: number;
    hp: number;
    maxHp: number;
    critRate: number; // 0-1
    dodgeRate: number; // 0-1
}

export interface PlayerEquipment {
    weapon?: string; // Item ID
    armor?: string;  // Item ID
    accessory?: string; // Item ID
}

export interface SpiritRoot {
    metal: number; // 金
    wood: number;  // 木
    water: number; // 水
    fire: number;  // 火
    earth: number; // 土
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

    // Resources
    spiritStones: number; // 灵石
    immortalStones: number; // 仙石

    // Meta
    createTime: number;
    lastLoginTime: number;
}
