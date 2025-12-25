import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { InventorySlot } from '../core/models/item';
import { ITEMS, getItem } from '../core/constants/items';
import { usePlayerStore } from './player';
import { useSkillStore } from './skill'; // Import SkillStore

import { SaveService } from '../core/services/SaveService';

export const useInventoryStore = defineStore('inventory', () => {
    const playerStore = usePlayerStore(); // Get player store instance

    // Inventory is now managed by playerStore.player.inventory
    // We can expose it as a computed property
    const inventory = computed(() => playerStore.player.inventory);

    // Helper to get all items in the bag (if needed, otherwise remove)
    function getBagItems(): InventorySlot[] {
        return playerStore.player.inventory;
    }

    function hasItem(itemId: string, count: number = 1): boolean {
        const slot = playerStore.player.inventory.find(s => s.itemId === itemId);
        return slot ? slot.count >= count : false;
    }

    function getItemCount(itemId: string): number {
        const slot = playerStore.player.inventory.find(s => s.itemId === itemId);
        return slot ? slot.count : 0;
    }

    function addItem(itemId: string, count: number = 1): boolean {
        const item = getItem(itemId);
        if (!item) return false;

        // 1. Stackable Check
        if (item.stackable) {
            const existing = playerStore.player.inventory.find(s => s.itemId === itemId);
            if (existing) {
                existing.count += count;
                playerStore.save(); // Save after modification
                return true;
            }
        }

        // 2. New Slot Check (assuming MAX_SLOTS is still relevant or handled by playerStore)
        // If playerStore.player.inventory has a max size, check it here.
        // For now, let's assume it can grow.
        // const MAX_SLOTS = 20; // If you want to re-introduce a max slot limit
        // if (playerStore.player.inventory.length >= MAX_SLOTS) {
        //     return false; // Bag full
        // }

        // 3. Add Item
        playerStore.player.inventory.push({ itemId, count });
        playerStore.save(); // Save after modification
        return true;
    }

    function removeItem(itemId: string, count: number = 1): boolean {
        const idx = playerStore.player.inventory.findIndex(s => s.itemId === itemId);
        if (idx === -1) return false;

        const slot = playerStore.player.inventory[idx];
        if (slot.count < count) return false;

        slot.count -= count;
        if (slot.count <= 0) {
            playerStore.player.inventory.splice(idx, 1);
        }
        playerStore.save(); // Save after modification
        return true;
    }

    function equipItem(itemId: string): boolean {
        const item = getItem(itemId);
        if (!item || !['weapon', 'armor', 'accessory'].includes(item.type)) return false;

        // Unequip current slot if needed
        const slot = item.type as 'weapon' | 'armor' | 'accessory';
        const currentEquipId = playerStore.player.equipment[slot];

        if (currentEquipId) {
            // Return to inventory
            addItem(currentEquipId, 1);
        }

        playerStore.player.equipment[slot] = itemId;
        removeItem(itemId, 1); // Remove from inventory after equipping

        playerStore.recalcStats();
        playerStore.save();
        return true;
    }

    function useItem(itemId: string): { success: boolean, msg: string } {
        const item = getItem(itemId);
        if (!item || item.type !== 'consumable' || !item.useEffect) {
            return { success: false, msg: '该物品无法使用' };
        }

        // Check ownership
        if (!hasItem(itemId, 1)) return { success: false, msg: '物品不足' };

        // Handle Effects
        const effect = item.useEffect;

        if (effect.type === 'learn_skill') {
            const skillStore = useSkillStore();
            if (skillStore.learnSkill(effect.value)) {
                removeItem(itemId, 1);
                return { success: true, msg: `习得技能: ${effect.value}` }; // ideally show skill name
            } else {
                return { success: false, msg: '无法学习 (已学会或境界不足)' };
            }
        } else if (effect.type === 'restore_hp') { // Example for existing HP restore logic
            const amount = effect.value || 0;
            playerStore.player.stats.hp = Math.min(
                playerStore.player.stats.maxHp,
                playerStore.player.stats.hp + amount
            );
            removeItem(itemId, 1);
            playerStore.save();
            return { success: true, msg: `恢复 ${amount} HP` };
        }

        return { success: false, msg: '未知效果' };
    }

    // Save/Load helpers (if needed, but player store handles persistence of inventory data)
    function save() {
        playerStore.save();
    }

    return {
        inventory, // Expose as computed property
        getBagItems,
        addItem,
        removeItem,
        hasItem,
        getItemCount,
        equipItem, // Export equipItem
        useItem,   // Export useItem
        save
    };
});
