import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Player } from '../core/models/player';
import { getRealm } from '../core/constants/realms';
import { getItem } from '../core/constants/items';
import { SaveService } from '../core/services/SaveService';

import { SessionManager } from '../core/services/SessionManager';
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
            atk: 50,
            def: 10,
            hp: 500,
            maxHp: 500,
            mp: 70,
            maxMp: 70,
            critRate: 0,
            dodgeRate: 0.05,
        },
        cultivation: {
            realmId: 1, // 练气一层
            currentExp: 0,
            bodyRealmId: 0,
        },
        spiritRoot: {
            fire: 10, water: 10, wood: 10, metal: 10, earth: 10
        },
        inventory: [], // Initialize empty inventory
        equipment: {
            weapon: undefined,
            armor: undefined,
            accessory: undefined
        },
        skills: {
            learned: [],
            equipped: []
        },
        sect: undefined,
        spiritStones: 0,
        immortalStones: 0,

        // Abode Defaults
        resources: {
            food: 100,
            wood: 0,
            iron: 0,
            herb: 0,
            maxFood: 1000,
            maxWood: 500,
            maxIron: 200,
            maxHerb: 100
        },
        abode: {
            level: 1,
            servants: {
                total: 10,
                food: 0,
                wood: 0,
                iron: 0,
                herb: 0,
                max: 10
            },
            gatheringArrayLevel: 1,
            spiritGardenLevel: 0 // Locked (0)
        },

        createTime: Date.now(),
        lastLoginTime: Date.now(),
    };

    // Merge saved data
    const player = ref<Player>(savedPlayer ? {
        ...defaultState,
        ...savedPlayer,
        equipment: savedPlayer.equipment || defaultState.equipment,
        spiritRoot: savedPlayer.spiritRoot || defaultState.spiritRoot,
        sect: savedPlayer.sect,
        resources: savedPlayer.resources || defaultState.resources,
        abode: savedPlayer.abode || defaultState.abode
    } : defaultState);

    // --- Getters ---
    const currentRealm = computed(() => getRealm(player.value.cultivation.realmId));

    // Helper to calculate raw base stats (moved from effectiveStats to be reusable if needed, but effectiveStats is fine)
    // We just need to ensure that on load, if our maxHp is mismatching the expected maxHp, we update it.

    // ... [Getters continue] ...
    const nextRealm = computed(() => getRealm(player.value.cultivation.realmId + 1));
    const maxExp = computed(() => currentRealm.value?.expReq || 999999999);
    const progressPercentage = computed(() => {
        if (!currentRealm.value) return 0;
        const pct = (player.value.cultivation.currentExp / maxExp.value) * 100;
        return Math.min(pct, 100);
    });

    // Dynamic Stats (Realm Base + Equipment + Buffs)
    const effectiveStats = computed(() => {
        // 1. Base Stats from Realm
        const realm = currentRealm.value;
        let atk = realm ? realm.atkBonus : 10;
        let def = realm ? realm.defBonus : 5;
        let maxHp = realm ? realm.hpBonus : 100;
        let maxMp = realm ? realm.mpBonus : 50; // Use defined MP bonus

        // 2. Add Equipment Bonuses
        const equip = player.value.equipment;
        const addEquipStats = (itemId?: string) => {
            if (!itemId) return;
            const item = getItem(itemId);
            if (item?.stats) {
                atk += item.stats.atk || 0;
                def += item.stats.def || 0;
                maxHp += item.stats.hp || 0;
                maxMp += item.stats.mp || 0;
            }
        };

        addEquipStats(equip.weapon);
        addEquipStats(equip.armor);
        addEquipStats(equip.accessory);

        // 3. Return Combined Stats (Current HP/MP comes from state, Max comes from calc)
        return {
            atk,
            def,
            maxHp,
            maxMp,
            hp: player.value.stats.hp,
            mp: player.value.stats.mp,
            critRate: player.value.stats.critRate, // These could also be dynamic later
            dodgeRate: player.value.stats.dodgeRate
        };
    });

    // Cultivation Rate (Base + Bonuses)
    const cultivationRate = computed(() => {
        let rate = 5; // Base Rate

        // 1. Gathering Array Bonus (Flat +1 per level)
        if (player.value.abode) {
            const level = player.value.abode.gatheringArrayLevel || 1;
            rate += level * 1;
        }

        return Math.floor(rate);
    });

    // Watch for effective stats changes (e.g. Realm upgrade, Equipment change)
    // AND Sync on init.
    // This ensures that the 'maxHp' stored in the player object (which acts as a cache/display value in some places)
    // is always up to date with the calculated effective stats.


    watch(effectiveStats, (newStats) => {
        if (!player.value.stats) return;

        // Sync Max Values
        if (player.value.stats.maxHp !== newStats.maxHp) {
            player.value.stats.maxHp = newStats.maxHp;
            // If HP was capped by old low max, release it? 
            // Actually, if HP > New Max, clamp it.
            if (player.value.stats.hp > newStats.maxHp) {
                player.value.stats.hp = newStats.maxHp;
            }
        }
        if (player.value.stats.maxMp !== newStats.maxMp) {
            player.value.stats.maxMp = newStats.maxMp;
            if (player.value.stats.mp > newStats.maxMp) {
                player.value.stats.mp = newStats.maxMp;
            }
        }

        // Also sync Base Stats for consistency (though Combat uses effectiveStats now)
        if (player.value.stats.atk !== newStats.atk) player.value.stats.atk = newStats.atk;
        if (player.value.stats.def !== newStats.def) player.value.stats.def = newStats.def;

    }, { immediate: true });

    // --- Actions ---
    function addExp(amount: number) {
        player.value.cultivation.currentExp += amount;
        // Check auto-cap or bottleneck logic can go here or in a service
    }

    function attemptBreakthrough(): boolean {
        if (!currentRealm.value || !nextRealm.value) return false;

        if (player.value.cultivation.currentExp >= currentRealm.value.expReq) {
            // Success!
            player.value.cultivation.currentExp -= currentRealm.value.expReq;
            player.value.cultivation.realmId += 1;

            // Full Heal on Breakthrough
            // Computed effectiveStats should be reactive, but let's ensure we get the latest
            const stats = effectiveStats.value;

            // Note: We might need nextTick if we were waiting for DOM, but for data it should be fine.
            // If previous implementation relied on setTimeout, maybe there was a subtle reactivity issue?
            // Let's assume accessing .value triggers re-calc.
            if (player.value.stats) {
                player.value.stats.hp = stats.maxHp;
                player.value.stats.mp = stats.maxMp;
            }
            save();

            return true;
        }

        return false;
    }



    function save() {
        // Prevent saving if we lost the session lock
        if (!SessionManager.canWrite()) {
            console.warn('[PlayerStore] Save blocked: Session invalid.');
            return;
        }

        const inventoryStore = useInventoryStore();
        // Pinia unwraps computed refs, so we access it directly
        SaveService.save(player.value, inventoryStore.inventory);
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

    // Regen Bonus (0.5% per Gathering Array Level)
    const regenBonus = computed(() => {
        if (!player.value.abode) return 0;
        return (player.value.abode.gatheringArrayLevel || 0) * 0.005;
    });

    function regenStats() {
        if (!player.value) return;
        const stats = player.value.stats;

        // Base 1% + Bonus
        const hpRate = 0.01 + regenBonus.value;
        const mpRate = 0.01 + regenBonus.value;

        if (stats.hp < stats.maxHp) {
            stats.hp = Math.min(stats.maxHp, stats.hp + Math.max(1, Math.floor(stats.maxHp * hpRate)));
        }
        if (stats.mp < stats.maxMp) {
            stats.mp = Math.min(stats.maxMp, stats.mp + Math.max(1, Math.floor(stats.maxMp * mpRate)));
        }
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
    watch(player, () => {
        scheduleSave();
    }, { deep: true });

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
        unequipItem,
        regenStats,
        cultivationRate,
        regenBonus
    };
});
