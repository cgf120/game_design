export interface Realm {
    id: number;
    name: string;
    expReq: number; // Experience required to reach the NEXT level (or break through)
    atkBonus: number;
    hpBonus: number;
    defBonus: number;
}

export const REALMS: Realm[] = [
    // 1. 练气期 (Qi Condensation) - 10 Layers
    { id: 1, name: '练气一层', expReq: 100, atkBonus: 10, hpBonus: 100, defBonus: 0 },
    { id: 2, name: '练气二层', expReq: 200, atkBonus: 15, hpBonus: 150, defBonus: 1 },
    { id: 3, name: '练气三层', expReq: 350, atkBonus: 20, hpBonus: 200, defBonus: 2 },
    { id: 4, name: '练气四层', expReq: 500, atkBonus: 25, hpBonus: 250, defBonus: 3 },
    { id: 5, name: '练气五层', expReq: 700, atkBonus: 30, hpBonus: 300, defBonus: 4 },
    { id: 6, name: '练气六层', expReq: 1000, atkBonus: 35, hpBonus: 350, defBonus: 5 },
    { id: 7, name: '练气七层', expReq: 1500, atkBonus: 40, hpBonus: 400, defBonus: 6 },
    { id: 8, name: '练气八层', expReq: 2200, atkBonus: 45, hpBonus: 450, defBonus: 7 },
    { id: 9, name: '练气九层', expReq: 3000, atkBonus: 50, hpBonus: 500, defBonus: 8 },
    { id: 10, name: '练气圆满', expReq: 5000, atkBonus: 60, hpBonus: 600, defBonus: 10 },

    // 2. 筑基期 (Foundation Establishment) - Initial
    { id: 11, name: '筑基初期', expReq: 10000, atkBonus: 150, hpBonus: 2000, defBonus: 30 },
    // ... more to be added later
];

// Helper to get realm by ID
export const getRealm = (id: number): Realm | undefined => REALMS.find(r => r.id === id);
