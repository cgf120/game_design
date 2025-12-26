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
