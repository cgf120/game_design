import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { InventorySlot, EquipmentSlot } from '../core/models/item';
import { ITEMS, getItem } from '../core/constants/items';
import { getItemQuality, getDecomposeValue } from '../core/utils/item';

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

        // Check if unique item (Equipment with ranges)
        if (item.type === 'equipment' && item.statsRange && !item.stackable) {
            const stats: any = {};
            // Helper to roll random stat with weights
            const rollStat = (min: number, max: number, isRate: boolean) => {
                // 1. Godly Roll Check (2% Chance) - Breaks the limit
                const isGodly = Math.random() < 0.02;

                let finalVal: number;

                if (isGodly) {
                    // Godly: Exceed max by 1% to 15%
                    const bonusPct = Math.random() * 0.14 + 0.01;
                    finalVal = max * (1 + bonusPct);
                } else {
                    // Normal: Range [min, max]
                    // Weighted: Closer to max is rarer (Exponential decay probability).
                    // rolling 0-1, squaring it biases result towards 0.
                    // result = min + (range) * (roll^2)

                    const roll = Math.pow(Math.random(), 2);
                    finalVal = min + (max - min) * roll;
                }

                return isRate ? parseFloat(finalVal.toFixed(4)) : Math.floor(finalVal);
            };

            if (item.statsRange.atk) stats.atk = rollStat(item.statsRange.atk[0], item.statsRange.atk[1], false);
            if (item.statsRange.def) stats.def = rollStat(item.statsRange.def[0], item.statsRange.def[1], false);
            if (item.statsRange.hp) stats.hp = rollStat(item.statsRange.hp[0], item.statsRange.hp[1], false);
            if (item.statsRange.mp) stats.mp = rollStat(item.statsRange.mp[0], item.statsRange.mp[1], false);
            if (item.statsRange.critRate) stats.critRate = rollStat(item.statsRange.critRate[0], item.statsRange.critRate[1], true);
            if (item.statsRange.dodgeRate) stats.dodgeRate = rollStat(item.statsRange.dodgeRate[0], item.statsRange.dodgeRate[1], true);

            playerStore.player.inventory.push({
                itemId,
                count: 1,
                instanceData: {
                    stats: stats
                }
            });
            playerStore.save();
            return true;
        }

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
        if (!slot) return false;
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
        // Fix: Allow 'equipment' type and any valid slot
        if (!itemDef || (itemDef.type !== 'equipment')) return false;

        const slotName = itemDef.slot as EquipmentSlot;
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
    function socketGemToEquipped(slotName: EquipmentSlot, gemId: string): { success: boolean, msg: string } {
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
    function unsocketGemFromEquipped(slotName: EquipmentSlot, gemIndex: number): { success: boolean, msg: string } {
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

    // Batch Decompose
    function batchDecompose(qualities: string[]): { count: number, totalValue: number } {
        // qualities is array of labels e.g. ['下品', '中品']
        let removedCount = 0;
        let totalValue = 0;

        // Iterate backwards to safely remove
        for (let i = playerStore.player.inventory.length - 1; i >= 0; i--) {
            const slot = playerStore.player.inventory[i];
            if (!slot) continue;
            const item = getItem(slot.itemId);

            // 1. Must be equipment
            if (!item || item.type !== 'equipment') continue;

            // 2. Must match quality
            const q = getItemQuality(slot);
            if (qualities.includes(q.label)) {
                // Calculate Value
                const val = getDecomposeValue(slot);
                totalValue += val;

                // Remove
                playerStore.player.inventory.splice(i, 1);
                removedCount++;
            }
        }

        if (removedCount > 0) {
            playerStore.player.spiritStones += totalValue;
            playerStore.save();
        }

        return { count: removedCount, totalValue };
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
        unsocketGemFromEquipped,
        batchDecompose
    };
});
