export interface Realm {
    id: number;
    name: string;
    expReq: number;
    atkBonus: number;
    hpBonus: number;
    defBonus: number;
    mpBonus: number;
    critRateBonus: number;
    dodgeRateBonus: number;
    breakthroughReq?: {
        probability: number;
        itemId?: string;
        failPenaltyExp?: number;
    };
}

// Commercial v6.1 Ultra Granular Realms
// Structure:
// Qi: 1-10
// Others: Early(1), Mid(2), Late(3), Peak(4), Half-Step(5)

const BASE_QI_HP = 2000;
const BASE_QI_ATK = 100;

// Major Realm Base Stats (Start of 'Early')
// Multiplier approx 3.5x per major jump
const MAJOR_REALMS = [
    { id: 1, name: '练气', tiers: 10, baseAtk: 100, baseHp: 2000, nextPill: 'pill_foundation' },
    { id: 2, name: '筑基', tiers: 5, baseAtk: 3500, baseHp: 80000, nextPill: 'pill_gold_core' },
    { id: 3, name: '金丹', tiers: 5, baseAtk: 25000, baseHp: 600000, nextPill: 'pill_nascent' },
    { id: 4, name: '元婴', tiers: 5, baseAtk: 150000, baseHp: 4000000, nextPill: 'pill_spirit' },
    { id: 5, name: '化神', tiers: 5, baseAtk: 800000, baseHp: 25000000, nextPill: 'pill_void' }, // Need new pills conceptually
    { id: 6, name: '炼虚', tiers: 5, baseAtk: 5000000, baseHp: 2e8 },
    { id: 7, name: '出窍', tiers: 5, baseAtk: 20000000, baseHp: 1e9 },
    { id: 8, name: '分神', tiers: 5, baseAtk: 80000000, baseHp: 5e9 },
    { id: 9, name: '合体', tiers: 5, baseAtk: 300000000, baseHp: 2.5e10 },
    { id: 10, name: '大乘', tiers: 5, baseAtk: 1200000000, baseHp: 1.5e11 },
    { id: 11, name: '渡劫', tiers: 5, baseAtk: 5000000000, baseHp: 8e11 },
    // Immortal
    { id: 12, name: '散仙', tiers: 5, baseAtk: 3.0e10, baseHp: 5e12 },
    { id: 13, name: '真仙', tiers: 5, baseAtk: 1.5e11, baseHp: 2e13 },
    { id: 14, name: '玄仙', tiers: 5, baseAtk: 6.0e11, baseHp: 1e14 },
    { id: 15, name: '金仙', tiers: 5, baseAtk: 3.0e12, baseHp: 5e14 },
    { id: 16, name: '准圣', tiers: 5, baseAtk: 1.5e13, baseHp: 3e15 },
    { id: 17, name: '圣人', tiers: 5, baseAtk: 1.0e15, baseHp: 1e17 },
];

const SUBS_5 = [
    { suffix: '初期', mult: 1.0, prob: 1.0 },
    { suffix: '中期', mult: 1.3, prob: 0.9 },
    { suffix: '后期', mult: 1.6, prob: 0.8 },
    { suffix: '圆满', mult: 2.0, prob: 0.7 },
    { suffix: '半步', mult: 2.5, prob: 0.5, isHalfStep: true } // Transitions to Next
];

const generateRealms = (): Realm[] => {
    const list: Realm[] = [];

    MAJOR_REALMS.forEach((major, index) => {
        const nextMajor = MAJOR_REALMS[index + 1];

        if (major.name === '练气') {
            // Manual Qi 1-10
            for (let i = 1; i <= 10; i++) {
                const progress = i / 10; // 0.1 to 1.0
                const isPeak = i === 10;
                list.push({
                    id: i,
                    name: `练气${i === 10 ? '圆满' : i + '层'}`,
                    expReq: Math.floor(100 * Math.pow(1.5, i)),
                    atkBonus: Math.floor(major.baseAtk * (1 + progress * 14)), // 100 -> 1500
                    defBonus: Math.floor(major.baseAtk * (1 + progress * 14)),
                    hpBonus: Math.floor(major.baseHp * (1 + progress * 14)), // 2000 -> 30000
                    mpBonus: Math.floor(500 * (1 + progress * 14)),
                    critRateBonus: 0.01 + (i * 0.004),
                    dodgeRateBonus: 0.01 + (i * 0.004),
                    breakthroughReq: {
                        probability: 1.0 - (i * 0.04), // 1.0 -> 0.6
                        itemId: isPeak ? major.nextPill : undefined,
                        failPenaltyExp: isPeak ? 5000 : 0
                    }
                });
            }
        } else {
            // Standard 5-Tier
            // ID Scheme: MajorID * 10 + SubID (1-5)
            // e.g. Foundation(2) -> 21, 22, 23, 24, 25
            SUBS_5.forEach((sub, subIdx) => {
                const subId = subIdx + 1; // 1-5
                const realId = major.id * 10 + subId;

                let name = major.name + sub.suffix;
                if (sub.isHalfStep && nextMajor) {
                    name = `半步${nextMajor.name}`;
                }

                // Growth Curve interaction
                const growth = sub.mult;
                const isHalfStep = sub.isHalfStep;

                // Exponential Exp
                const baseExp = 50000 * Math.pow(3.5, major.id - 2);
                const tierExp = baseExp * (1 + subIdx * 0.5);

                const statsMult = growth;

                list.push({
                    id: realId,
                    name: name,
                    expReq: Math.floor(tierExp),
                    atkBonus: Math.floor(major.baseAtk * statsMult),
                    defBonus: Math.floor(major.baseAtk * statsMult),
                    hpBonus: Math.floor(major.baseHp * statsMult),
                    mpBonus: Math.floor((major.baseHp * statsMult) * 0.2),
                    critRateBonus: Math.min(0.30, 0.05 + (major.id * 0.015)),
                    dodgeRateBonus: Math.min(0.10, 0.05 + (major.id * 0.005)),
                    breakthroughReq: {
                        probability: isHalfStep ? 0.2 : sub.prob, // Half-step -> Next is hard
                        itemId: isHalfStep ? major.nextPill : undefined,
                        failPenaltyExp: Math.floor(tierExp * 0.5)
                    }
                });
            });
        }
    });

    return list;
};

export const REALMS: Realm[] = generateRealms();

export const getRealm = (id: number): Realm | undefined => REALMS.find(r => r.id === id);
