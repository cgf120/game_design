import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { InventorySlot } from '../core/models/item';
import { ITEMS, getItem } from '../core/constants/items';
import { usePlayerStore } from './player';

import { SaveService } from '../core/services/SaveService';

export const useInventoryStore = defineStore('inventory', () => {
    const savedData = SaveService.load();
    const slots = ref<InventorySlot[]>(savedData?.inventory || []);
    const MAX_SLOTS = 20;

    function addItem(itemId: string, count: number = 1): boolean {
        const item = getItem(itemId);
        if (!item) return false;

        // 1. Stackable Check
        if (item.stackable) {
            const existing = slots.value.find(s => s.itemId === itemId);
            if (existing) {
                existing.count += count;
                return true;
            }
        }

        // 2. New Slot Check
        if (slots.value.length >= MAX_SLOTS) {
            return false; // Bag full
        }

        // 3. Add Item
        slots.value.push({ itemId, count });
        return true;
    }

    function removeItem(itemId: string, count: number = 1): boolean {
        const idx = slots.value.findIndex(s => s.itemId === itemId);
        if (idx === -1) return false;

        const slot = slots.value[idx];
        if (slot.count < count) return false;

        slot.count -= count;
        if (slot.count <= 0) {
            slots.value.splice(idx, 1);
        }
        return true;
    }

    function useItem(itemId: string): boolean {
        const item = getItem(itemId);
        if (!item || item.type !== 'consumable') return false;

        const playerStore = usePlayerStore();

        // Apply Effect
        if (item.id === 'pill_hp_small') {
            playerStore.player.stats.hp = Math.min(
                playerStore.player.stats.maxHp,
                playerStore.player.stats.hp + (item.effectValue || 0)
            );
        }

        // Consume
        removeItem(itemId, 1);
        return true;
    }

    function equip(itemId: string): boolean {
        const item = getItem(itemId);
        if (!item || item.type !== 'equipment' || !item.slot) return false;

        const playerStore = usePlayerStore();
        const currentEquipId = playerStore.player.equipment[item.slot];

        // 1. If something is equipped, unequip it first (return to bag)
        if (currentEquipId) {
            // Just add back to slots
            addItem(currentEquipId, 1);
        }

        // 2. Remove from bag
        if (!removeItem(itemId, 1)) return false;

        // 3. Equip new item
        playerStore.equipItem(item.slot, itemId);
        return true;
    }

    // Reactive Save
    useInventoryStore().$subscribe(() => {
        // Trigger player store save which handles both (since SaveService writes both)
        // Or we can just call playerStore.save() directly
        // Better: let PlayerStore own the save coordination, or expose a global save action
        usePlayerStore().save();
    });

    return {
        slots,
        addItem,
        removeItem,
        useItem,
        equip
    };
});
