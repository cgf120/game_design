export interface Realm {
    id: number;
    name: string;
    expReq: number; // Experience required to reach the NEXT level (or break through)
    atkBonus: number;
    hpBonus: number;
    defBonus: number;
    mpBonus: number;
    // Breakthrough Config
    breakthroughReq?: {
        probability: number; // 0-1
        itemId?: string; // Required item to attempt (or significantly boost chance?)
        failPenaltyExp?: number; // Exp lost on faillure
    };
}

export const REALMS: Realm[] = [
    // 1. 练气期 (Qi Condensation) - 10 Layers
    // Base: 50/10/500/70 as requested
    { id: 1, name: '练气一层', expReq: 100, atkBonus: 50, hpBonus: 500, defBonus: 10, mpBonus: 70, breakthroughReq: { probability: 1.0 } },
    { id: 2, name: '练气二层', expReq: 200, atkBonus: 60, hpBonus: 600, defBonus: 12, mpBonus: 90, breakthroughReq: { probability: 1.0 } },
    { id: 3, name: '练气三层', expReq: 350, atkBonus: 70, hpBonus: 700, defBonus: 14, mpBonus: 110, breakthroughReq: { probability: 0.9 } },
    { id: 4, name: '练气四层', expReq: 500, atkBonus: 85, hpBonus: 850, defBonus: 16, mpBonus: 130, breakthroughReq: { probability: 0.9 } },
    { id: 5, name: '练气五层', expReq: 700, atkBonus: 100, hpBonus: 1000, defBonus: 20, mpBonus: 150, breakthroughReq: { probability: 0.8 } },
    { id: 6, name: '练气六层', expReq: 1000, atkBonus: 120, hpBonus: 1200, defBonus: 25, mpBonus: 180, breakthroughReq: { probability: 0.8 } },
    { id: 7, name: '练气七层', expReq: 1500, atkBonus: 140, hpBonus: 1400, defBonus: 30, mpBonus: 210, breakthroughReq: { probability: 0.7 } },
    { id: 8, name: '练气八层', expReq: 2200, atkBonus: 170, hpBonus: 1700, defBonus: 35, mpBonus: 250, breakthroughReq: { probability: 0.7 } },
    { id: 9, name: '练气九层', expReq: 3000, atkBonus: 200, hpBonus: 2000, defBonus: 40, mpBonus: 300, breakthroughReq: { probability: 0.6 } },
    { id: 10, name: '练气圆满', expReq: 5000, atkBonus: 250, hpBonus: 2500, defBonus: 50, mpBonus: 400, breakthroughReq: { probability: 0.5, itemId: 'pill_foundation' } },

    // 2. 筑基期 (Foundation Establishment)
    { id: 11, name: '筑基初期', expReq: 10000, atkBonus: 400, hpBonus: 4000, defBonus: 100, mpBonus: 1000, breakthroughReq: { probability: 0.9 } },
    { id: 12, name: '筑基中期', expReq: 20000, atkBonus: 600, hpBonus: 6000, defBonus: 150, mpBonus: 1500, breakthroughReq: { probability: 0.8 } },
    { id: 13, name: '筑基后期', expReq: 40000, atkBonus: 900, hpBonus: 9000, defBonus: 220, mpBonus: 2200, breakthroughReq: { probability: 0.7 } },
    { id: 14, name: '筑基圆满', expReq: 80000, atkBonus: 1300, hpBonus: 13000, defBonus: 300, mpBonus: 3000, breakthroughReq: { probability: 0.5, itemId: 'pill_gold_core' } },

    // 3. 金丹期 (Golden Core)
    { id: 21, name: '金丹初期', expReq: 150000, atkBonus: 2000, hpBonus: 25000, defBonus: 500, mpBonus: 5000, breakthroughReq: { probability: 0.8 } },
    { id: 22, name: '金丹中期', expReq: 300000, atkBonus: 2800, hpBonus: 35000, defBonus: 700, mpBonus: 7000, breakthroughReq: { probability: 0.7 } },
    { id: 23, name: '金丹后期', expReq: 600000, atkBonus: 3800, hpBonus: 48000, defBonus: 1000, mpBonus: 9500, breakthroughReq: { probability: 0.6 } },
    { id: 24, name: '金丹圆满', expReq: 1000000, atkBonus: 5000, hpBonus: 65000, defBonus: 1400, mpBonus: 13000, breakthroughReq: { probability: 0.4, itemId: 'pill_nascent' } },

    // 4. 元婴期 (Nascent Soul)
    { id: 31, name: '元婴初期', expReq: 2000000, atkBonus: 8000, hpBonus: 100000, defBonus: 2000, mpBonus: 20000, breakthroughReq: { probability: 0.7 } },
    { id: 32, name: '元婴中期', expReq: 4000000, atkBonus: 11000, hpBonus: 150000, defBonus: 2800, mpBonus: 30000, breakthroughReq: { probability: 0.6 } },
    { id: 33, name: '元婴后期', expReq: 8000000, atkBonus: 15000, hpBonus: 220000, defBonus: 3800, mpBonus: 45000, breakthroughReq: { probability: 0.5 } },
    { id: 34, name: '元婴圆满', expReq: 15000000, atkBonus: 20000, hpBonus: 320000, defBonus: 5000, mpBonus: 65000, breakthroughReq: { probability: 0.3, itemId: 'pill_spirit' } },

    // 5. 化神期 (Spirit Severing)
    { id: 41, name: '化神初期', expReq: 30000000, atkBonus: 30000, hpBonus: 500000, defBonus: 8000, mpBonus: 100000, breakthroughReq: { probability: 0.6 } },
    { id: 42, name: '化神中期', expReq: 60000000, atkBonus: 45000, hpBonus: 800000, defBonus: 12000, mpBonus: 160000, breakthroughReq: { probability: 0.5 } },
    { id: 43, name: '化神后期', expReq: 120000000, atkBonus: 65000, hpBonus: 1200000, defBonus: 18000, mpBonus: 250000, breakthroughReq: { probability: 0.4 } },
    { id: 44, name: '化神圆满', expReq: 250000000, atkBonus: 90000, hpBonus: 1800000, defBonus: 25000, mpBonus: 400000, breakthroughReq: { probability: 0.2 } },
];

// Helper to get realm by ID
export const getRealm = (id: number): Realm | undefined => REALMS.find(r => r.id === id);
