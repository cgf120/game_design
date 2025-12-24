import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Player } from '../core/models/player';
import { getRealm } from '../core/constants/realms';
import { getItem } from '../core/constants/items';
import { SaveService } from '../core/services/SaveService';

import { useInventoryStore } from './inventory';

export const usePlayerStore = defineStore('player', () => {
    // --- State ---
    const savedData = SaveService.load();
    const savedPlayer = savedData?.player;

    // Default State
    const defaultState: Player = {
        // ... (Keep existing default values - omitted for brevity in diff but logic remains)
        id: 'p1',
        name: '初入道途',
        stats: {
            atk: 10,
            def: 0,
            hp: 100,
            maxHp: 100,
            critRate: 0.05,
            dodgeRate: 0.05,
        },
        cultivation: {
            realmId: 1, // 练气一层
            currentExp: 0,
            bodyRealmId: 0,
        },
        spiritRoot: {
            metal: 10,
            wood: 10,
            water: 10,
            fire: 10,
            earth: 10
        },
        equipment: {
            weapon: undefined,
            armor: undefined,
            accessory: undefined
        },
        sect: undefined,
        spiritStones: 0,
        immortalStones: 0,
        createTime: Date.now(),
        lastLoginTime: Date.now(),
    };

    // Merge saved data
    const player = ref<Player>(savedPlayer ? { ...defaultState, ...savedPlayer, equipment: savedPlayer.equipment || defaultState.equipment, spiritRoot: savedPlayer.spiritRoot || defaultState.spiritRoot, sect: savedPlayer.sect } : defaultState);

    // ... (Getters remain the same) ...
    const currentRealm = computed(() => getRealm(player.value.cultivation.realmId));
    const nextRealm = computed(() => getRealm(player.value.cultivation.realmId + 1));
    const maxExp = computed(() => currentRealm.value?.expReq || 999999999);
    const progressPercentage = computed(() => {
        if (!currentRealm.value) return 0;
        const pct = (player.value.cultivation.currentExp / maxExp.value) * 100;
        return Math.min(pct, 100);
    });

    // Dynamic Stats (Base + Equipment + Buffs)
    const effectiveStats = computed(() => {
        const base = player.value.stats;
        let atk = base.atk;
        let def = base.def;
        let maxHp = base.maxHp;

        // Add Equipment Bonuses
        const equip = player.value.equipment;
        if (equip.weapon) {
            const item = getItem(equip.weapon);
            if (item?.stats) {
                atk += item.stats.atk || 0;
                def += item.stats.def || 0;
                maxHp += item.stats.hp || 0;
            }
        }
        if (equip.armor) {
            const item = getItem(equip.armor);
            if (item?.stats) {
                atk += item.stats.atk || 0;
                def += item.stats.def || 0;
                maxHp += item.stats.hp || 0;
            }
        }
        if (equip.accessory) {
            const item = getItem(equip.accessory);
            if (item?.stats) {
                atk += item.stats.atk || 0;
                def += item.stats.def || 0;
                maxHp += item.stats.hp || 0;
            }
        }

        return { ...base, atk, def, maxHp };
    });

    // --- Actions ---
    function addExp(amount: number) {
        player.value.cultivation.currentExp += amount;
        // Check auto-cap or bottleneck logic can go here or in a service
    }

    function attemptBreakthrough(): boolean {
        if (!currentRealm.value || !nextRealm.value) return false;

        if (player.value.cultivation.currentExp >= currentRealm.value.expReq) {
            // Success! (Simple version for now, no probability)
            player.value.cultivation.currentExp -= currentRealm.value.expReq;
            player.value.cultivation.realmId += 1;

            // Update basic stats based on new realm bonuses
            // Note: In a full implementation, stats would be recalculated dynamically based on all modifiers.
            // For MVP, we just set base stats.
            const newRealm = getRealm(player.value.cultivation.realmId);
            if (newRealm) {
                player.value.stats.atk = 10 + newRealm.atkBonus;
                player.value.stats.maxHp = 100 + newRealm.hpBonus;
                player.value.stats.hp = player.value.stats.maxHp; // Heal on level up
                player.value.stats.def = newRealm.defBonus;
            }

            save();
            return true;
        }

        return false;
    }

    function save() {
        const inventoryStore = useInventoryStore();
        SaveService.save(player.value, inventoryStore.slots);
    }

    function reset() {
        SaveService.clear();
        location.reload();
    }

    function equipItem(slot: 'weapon' | 'armor' | 'accessory', itemId: string) {
        player.value.equipment[slot] = itemId;
        save();
    }

    function unequipItem(slot: 'weapon' | 'armor' | 'accessory') {
        player.value.equipment[slot] = undefined;
        save();
    }

    // --- Auto Save (Reactive) ---
    // Save whenever state changes, throttled to once per second
    let saveTimeout: number | null = null;
    function scheduleSave() {
        if (saveTimeout) return;
        saveTimeout = window.setTimeout(() => {
            save();
            saveTimeout = null;
        }, 1000); // 1s throttle
    }

    // Subscribe to mutations
    usePlayerStore().$subscribe((mutation, state) => {
        // Skip saving if it's just the 'saved' data being loaded?
        // Actually, Pinia subscription triggers on all changes.
        // We just throttle it.
        scheduleSave();
    });

    return {
        player,
        currentRealm,
        nextRealm,
        maxExp,
        progressPercentage,
        effectiveStats,
        addExp,
        attemptBreakthrough,
        save,
        reset,
        equipItem,
        unequipItem
    };
});
