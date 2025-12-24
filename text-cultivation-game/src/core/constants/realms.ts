export interface Realm {
    id: number;
    name: string;
    expReq: number; // Experience required to reach the NEXT level (or break through)
    atkBonus: number;
    hpBonus: number;
    defBonus: number;
    mpBonus: number; // Added MP bonus
}

export const REALMS: Realm[] = [
    // 1. 练气期 (Qi Condensation) - 10 Layers
    // Base: 50/10/500/70 as requested
    { id: 1, name: '练气一层', expReq: 100, atkBonus: 50, hpBonus: 500, defBonus: 10, mpBonus: 70 },
    { id: 2, name: '练气二层', expReq: 200, atkBonus: 60, hpBonus: 600, defBonus: 12, mpBonus: 90 },
    { id: 3, name: '练气三层', expReq: 350, atkBonus: 70, hpBonus: 700, defBonus: 14, mpBonus: 110 },
    { id: 4, name: '练气四层', expReq: 500, atkBonus: 85, hpBonus: 850, defBonus: 16, mpBonus: 130 },
    { id: 5, name: '练气五层', expReq: 700, atkBonus: 100, hpBonus: 1000, defBonus: 20, mpBonus: 150 },
    { id: 6, name: '练气六层', expReq: 1000, atkBonus: 120, hpBonus: 1200, defBonus: 25, mpBonus: 180 },
    { id: 7, name: '练气七层', expReq: 1500, atkBonus: 140, hpBonus: 1400, defBonus: 30, mpBonus: 210 },
    { id: 8, name: '练气八层', expReq: 2200, atkBonus: 170, hpBonus: 1700, defBonus: 35, mpBonus: 250 },
    { id: 9, name: '练气九层', expReq: 3000, atkBonus: 200, hpBonus: 2000, defBonus: 40, mpBonus: 300 },
    { id: 10, name: '练气圆满', expReq: 5000, atkBonus: 250, hpBonus: 2500, defBonus: 50, mpBonus: 400 },

    // 2. 筑基期 (Foundation Establishment) - Initial
    { id: 11, name: '筑基初期', expReq: 10000, atkBonus: 400, hpBonus: 4000, defBonus: 100, mpBonus: 1000 },
    // ... more to be added later
];

// Helper to get realm by ID
export const getRealm = (id: number): Realm | undefined => REALMS.find(r => r.id === id);
