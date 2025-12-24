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
}

export interface GameMap {
    id: string;
    name: string;
    desc: string;
    reqRealmId: number; // Minimum realm to enter
    enemies: Enemy[]; // Possible enemies in this map
}
