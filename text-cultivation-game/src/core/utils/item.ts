import { getItem, type Item } from '../constants/items';

export interface StatDisplay {
    label: string;
    value: string;
    color: string;
}

export function getItemStatsList(id: string): StatDisplay[] {
    const item = getItem(id);
    if (!item || !item.stats) return [];

    const list: StatDisplay[] = [];
    if (item.stats.atk) list.push({ label: '攻击力', value: `+${item.stats.atk}`, color: 'text-amber-500' });
    if (item.stats.def) list.push({ label: '防御力', value: `+${item.stats.def}`, color: 'text-blue-500' });
    if (item.stats.hp) list.push({ label: '气血', value: `+${item.stats.hp}`, color: 'text-green-500' });
    if (item.stats.mp) list.push({ label: '灵力', value: `+${item.stats.mp}`, color: 'text-sky-500' });
    if (item.stats.critRate) list.push({ label: '暴击率', value: `+${(item.stats.critRate * 100).toFixed(0)}%`, color: 'text-purple-500' });

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
