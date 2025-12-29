export interface DropItem {
    itemId: string;
    chance: number; // 0-1
    min: number;
    max: number;
}

export interface Enemy {
    id: string;
    name: string;
    level: number;
    realmId: number; // Strength approximation
    stats: {
        hp: number;
        maxHp: number;
        atk: number;
        def: number;
    };
    expReward: number;
    drops: DropItem[];
    skills: string[]; // List of Skill IDs
}

export interface GameMap {
    id: string;
    name: string;
    desc: string;
    reqRealmId: number; // Minimum realm to enter
    enemies: Enemy[]; // Possible enemies in this map
    category?: string; // Optional grouping
    isHidden?: boolean; // If true, only show when active
    drops?: DropItem[]; // Gathering / Global drops
}
