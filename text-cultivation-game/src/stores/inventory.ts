import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { InventorySlot } from '../core/models/item';
import { ITEMS, getItem } from '../core/constants/items';
import { getSkill } from '../core/constants/skills'; // Static import
import { usePlayerStore } from './player';
import { useSkillStore } from './skill';

export const useInventoryStore = defineStore('inventory', () => {
    const playerStore = usePlayerStore();

    const inventory = computed(() => playerStore.player.inventory);

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

        if (item.stackable) {
            const existing = playerStore.player.inventory.find(s => s.itemId === itemId);
            if (existing) {
                existing.count += count;
                playerStore.save();
                return true;
            }
        }

        playerStore.player.inventory.push({ itemId, count });
        playerStore.save();
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
        playerStore.save();
        return true;
    }

    function equipItem(itemId: string): boolean {
        const itemDef = getItem(itemId);
        // Fix: Allow 'equipment' type
        if (!itemDef || (itemDef.type !== 'equipment' && !['weapon', 'armor', 'accessory'].includes(itemDef.type))) return false;

        const slotName = itemDef.slot as 'weapon' | 'armor' | 'accessory';
        if (!slotName) return false;

        // Find the specific slot in inventory
        const invIndex = playerStore.player.inventory.findIndex(s => s.itemId === itemId);
        if (invIndex === -1) return false;
        const slotToEquip = playerStore.player.inventory[invIndex];

        // Handle existing equipped item
        const currentEquipSlot = playerStore.player.equipment[slotName];
        if (currentEquipSlot) {
            // Move currently equipped item back to inventory
            // Directly push the object to preserve instanceData
            playerStore.player.inventory.push(currentEquipSlot);
        }

        // Equip the new item (Assign the object)
        playerStore.player.equipment[slotName] = slotToEquip;

        // Remove from inventory
        playerStore.player.inventory.splice(invIndex, 1);

        playerStore.save();
        return true;
    }

    function useItem(itemId: string): { success: boolean, msg: string } {
        const item = getItem(itemId);
        if (!item || item.type !== 'consumable' || !item.useEffect) {
            return { success: false, msg: '该物品无法使用' };
        }

        if (!hasItem(itemId, 1)) return { success: false, msg: '物品不足' };

        const effect = item.useEffect;

        if (effect.type === 'learn_skill') {
            const skillStore = useSkillStore();
            if (skillStore.learnSkill(effect.value)) {
                removeItem(itemId, 1);

                const skill = getSkill(effect.value);
                const skillName = skill ? skill.name : effect.value;
                return { success: true, msg: `习得技能: ${skillName}` };
            } else {
                return { success: false, msg: '无法学习 (已学会或境界不足)' };
            }
        } else if (effect.type === 'restore_hp') {
            // Note: effect.value is string in type definition, cast to number if needed
            // But usually defined as number in constants? Let's check logic.
            // Actually useEffect value is string in model, so might need parsing or distinct field.
            // Using effectValue for numeric effects usually.
            // Checking items.ts: manual uses useEffect {type, value}, pills don't have useEffect yet?
            // Actually pills in items.ts don't have useEffect defined yet, needed for restore.
            // Assuming restore logic implies numeric value.

            const amount = parseInt(effect.value) || 0;
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

    function save() {
        playerStore.save();
    }

    // Socket a gem into an EQUIPPED item
    function socketGemToEquipped(slotName: 'weapon' | 'armor' | 'accessory', gemId: string): { success: boolean, msg: string } {
        const equipSlot = playerStore.player.equipment[slotName];
        if (!equipSlot) return { success: false, msg: '该部位未装备物品' };

        const equipItem = getItem(equipSlot.itemId);
        if (!equipItem) return { success: false, msg: '装备数据错误' };

        // Check Gem
        if (!hasItem(gemId, 1)) return { success: false, msg: '缺少宝石' };
        const gemItem = getItem(gemId);
        if (!gemItem || !gemItem.type) return { success: false, msg: '宝石无效' };

        // Check Max Slots
        const maxSlots = equipItem.gemSlots || 0;
        if (maxSlots <= 0) return { success: false, msg: '此装备无法镶嵌宝石' };

        // Init instance data if needed
        if (!equipSlot.instanceData) {
            equipSlot.instanceData = { gems: [], level: 0 };
        }
        if (!equipSlot.instanceData.gems) {
            equipSlot.instanceData.gems = [];
        }

        const currentGems = equipSlot.instanceData.gems;
        if (currentGems.length >= maxSlots) {
            return { success: false, msg: '宝石孔已满' };
        }

        // Socket it
        // Reassign array to ensure reactivity triggers
        const newInstanceData = {
            ...equipSlot.instanceData,
            gems: [...currentGems, gemId]
        };

        // Force update the slot on the player object
        playerStore.player.equipment[slotName] = {
            ...equipSlot,
            instanceData: newInstanceData
        };
        // CRITICAL: Force top-level equipment object update to trigger deep watchers
        playerStore.player.equipment = { ...playerStore.player.equipment };

        // Remove gem from inventory
        removeItem(gemId, 1);
        // CRITICAL: Force top-level inventory array update
        playerStore.player.inventory = [...playerStore.player.inventory];

        playerStore.save();
        return { success: true, msg: `镶嵌成功！` };
    }

    // Unsocket a gem from an EQUIPPED item
    function unsocketGemFromEquipped(slotName: 'weapon' | 'armor' | 'accessory', gemIndex: number): { success: boolean, msg: string } {
        const equipSlot = playerStore.player.equipment[slotName];
        if (!equipSlot) return { success: false, msg: '该部位未装备物品' };

        if (!equipSlot.instanceData || !equipSlot.instanceData.gems || !equipSlot.instanceData.gems[gemIndex]) {
            return { success: false, msg: '该孔位没有宝石' };
        }

        const gemId = equipSlot.instanceData.gems[gemIndex];

        // Create new gem list
        const newGems = equipSlot.instanceData.gems.filter((_, index) => index !== gemIndex);

        // Force update by replacing the equipment slot object
        playerStore.player.equipment[slotName] = {
            ...equipSlot,
            instanceData: {
                ...equipSlot.instanceData,
                gems: newGems
            }
        };
        // CRITICAL: Force top-level equipment update
        playerStore.player.equipment = { ...playerStore.player.equipment };

        // Return to inventory
        addItem(gemId, 1);
        // CRITICAL: Force top-level inventory update
        playerStore.player.inventory = [...playerStore.player.inventory];

        playerStore.save();
        return { success: true, msg: '已卸下宝石' };
    }

    return {
        inventory,
        getBagItems,
        addItem,
        removeItem,
        hasItem,
        getItemCount,
        equipItem,
        useItem,
        save,
        socketGemToEquipped,
        unsocketGemFromEquipped
    };
});
