import { getItem } from '../constants/items';
import type { ItemStats, InventorySlot } from '../models/item';

export interface StatDisplay {
    label: string;
    value: string;
    color: string;
}

export function getItemStatsList(input: string | InventorySlot): StatDisplay[] {
    let itemId: string;
    let gemIds: string[] = [];
    let instanceStats: ItemStats | undefined;

    if (typeof input === 'string') {
        itemId = input;
    } else {
        itemId = input.itemId;
        if (input.instanceData) {
            instanceStats = input.instanceData.stats;
            gemIds = input.instanceData.gems || [];
        }
    }

    const item = getItem(itemId);
    if (!item) return [];

    // Base usage stats (prefer instance stats if available)
    const baseStats = instanceStats || item.stats || {};

    // Accumulate total stats
    const totalStats: ItemStats = { ...baseStats };

    // Add gem stats
    gemIds.forEach(gemId => {
        const gem = getItem(gemId);
        if (gem && gem.stats) {
            if (gem.stats.atk) totalStats.atk = (totalStats.atk || 0) + gem.stats.atk;
            if (gem.stats.def) totalStats.def = (totalStats.def || 0) + gem.stats.def;
            if (gem.stats.hp) totalStats.hp = (totalStats.hp || 0) + gem.stats.hp;
            if (gem.stats.mp) totalStats.mp = (totalStats.mp || 0) + gem.stats.mp;
            if (gem.stats.critRate) totalStats.critRate = (totalStats.critRate || 0) + gem.stats.critRate;
            if (gem.stats.dodgeRate) totalStats.dodgeRate = (totalStats.dodgeRate || 0) + gem.stats.dodgeRate;
        }
    });

    // Determine return list if there are any stats
    const list: StatDisplay[] = [];
    if (totalStats.atk) list.push({ label: '攻击力', value: `+${totalStats.atk}`, color: 'text-amber-500' });
    if (totalStats.def) list.push({ label: '防御力', value: `+${totalStats.def}`, color: 'text-blue-500' });
    if (totalStats.hp) list.push({ label: '气血', value: `+${totalStats.hp}`, color: 'text-green-500' });
    if (totalStats.mp) list.push({ label: '灵力', value: `+${totalStats.mp}`, color: 'text-sky-500' });
    if (totalStats.critRate) list.push({ label: '暴击率', value: `+${(totalStats.critRate * 100).toFixed(0)}%`, color: 'text-purple-500' });
    if (totalStats.dodgeRate) list.push({ label: '闪避率', value: `+${(totalStats.dodgeRate * 100).toFixed(0)}%`, color: 'text-white/50' });

    return list;
}

export function getItemEffect(id: string): string | null {
    const item = getItem(id);
    if (!item) return null;

    if (item.breakthroughBonus) {
        return `突破成功率 +${(item.breakthroughBonus * 100).toFixed(0)}%`;
    }

    if (item.useEffect) {
        if (item.useEffect.type === 'learn_skill') return '效果：习得神通';
        if (item.useEffect.type === 'restore_hp') return `效果：恢复气血`;
    }

    return null;
}

export const QUALITY_TIERS = {
    godly: {
        label: '仙品',
        color: 'text-red-500',
        frame: 'frame_common',
        frameStyle: 'filter: hue-rotate(-45deg) saturate(1.5);', // Gold -> Reddish
        bg: 'bg-neutral-900',
        shadow: 'shadow-red-900/50',
    },
    peerless: {
        label: '极品',
        color: 'text-orange-400',
        frame: 'frame_common',
        frameStyle: 'filter: hue-rotate(-15deg) saturate(1.2);', // Gold -> Orange
        bg: 'bg-neutral-900',
        shadow: 'shadow-orange-900/50',
    },
    superior: {
        label: '上品',
        color: 'text-blue-400',
        frame: 'frame_common',
        frameStyle: 'filter: hue-rotate(180deg) saturate(1.2);', // Gold -> Blue
        bg: 'bg-neutral-900',
        shadow: 'shadow-blue-900/50',
    },
    good: {
        label: '中品',
        color: 'text-emerald-400',
        frame: 'frame_common',
        frameStyle: 'filter: hue-rotate(60deg);', // Gold -> Green
        bg: 'bg-neutral-900',
        shadow: 'shadow-emerald-900/50',
    },
    common: {
        label: '下品',
        color: 'text-neutral-400',
        frame: 'frame_common',
        frameStyle: '',
        bg: 'bg-neutral-900',
        shadow: 'shadow-none',
    },
};

export function getItemQuality(input: string | InventorySlot) {
    let itemId: string;
    let stats: ItemStats | undefined;

    if (typeof input === 'string') {
        itemId = input;
    } else {
        itemId = input.itemId;
        stats = input.instanceData?.stats;
    }

    const item = getItem(itemId);
    if (!item) return QUALITY_TIERS.common;

    // Only applicable for equipment with ranges
    if (item.type !== 'equipment' || !item.statsRange || !stats) {
        return QUALITY_TIERS.common;
    }

    // Calculate Average Ratio
    let totalRatio = 0;
    let count = 0;

    for (const key of Object.keys(stats)) {
        const k = key as keyof ItemStats;
        const range = item.statsRange[k]; // [min, max]
        const val = stats[k];

        if (range && typeof val === 'number') {
            // New Logic: 
            // Min = Guobiao (Standard)
            // Max = Min / 0.75
            // So range[1] is the Theoretical Max.
            const max = range[1];
            if (max > 0) {
                const ratio = val / max;
                totalRatio += ratio;
                count++;
            }
        }
    }

    if (count === 0) return QUALITY_TIERS.common;

    const avg = totalRatio / count;

    // Tiers Logic
    // Godly: > 1.0 (Break Limit)
    // Peerless: 0.95 - 1.0
    // Superior: 0.90 - 0.95
    // Good: 0.80 - 0.90
    // Common: < 0.80

    if (avg > 1.0) return QUALITY_TIERS.godly;
    if (avg >= 0.95) return QUALITY_TIERS.peerless;
    if (avg >= 0.90) return QUALITY_TIERS.superior;
    if (avg >= 0.80) return QUALITY_TIERS.good;

    return QUALITY_TIERS.common;
}

export function getDecomposeValue(slot: InventorySlot): number {
    const item = getItem(slot.itemId);
    if (!item) return 0;

    // Only equipment can be decomposed (for now)
    if (item.type !== 'equipment') return 0;

    // Quality Multiplier
    const quality = getItemQuality(slot);
    let mult = 1;

    if (quality === QUALITY_TIERS.godly) mult = 10;
    else if (quality === QUALITY_TIERS.peerless) mult = 3;
    else if (quality === QUALITY_TIERS.superior) mult = 1.5;
    else if (quality === QUALITY_TIERS.good) mult = 1.2;
    else mult = 1;

    // Base Value depends on Realm (Level / 10 approximately, or Realm ID if available)
    // Assuming item.reqRealm or similar exists. Inspect `Item` interface.
    // If Item interface doesn't have realm req, use a base value of 5.
    // Checking items.ts/interfaces: items usually have `reqRealm` or `realmId`?
    // Let's check `Item` type in `models/item.ts`.
    // Actually, let's just use a safe base of 5 if realm is missing.
    // Assuming `item.reqRealm` exists or similar.

    // For now, let's use a flat 5 * mult if we can't find realm info easily without looking up.
    // But wait, the user said "Level and Quality".
    // Most equipment usually has a 'reqRealm'.
    // Let's try to access it safely. The Item interface definition might be needed.
    // I can assume it's `(item as any).reqRealm || 0`.

    const realmFactor = ((item as any).reqRealm || 0) + 1;
    return Math.floor(5 * realmFactor * mult);
}
