import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { usePlayerStore } from './player';

export const useAbodeStore = defineStore('abode', () => {
    const playerStore = usePlayerStore();

    // --- State Accessors (Computed for reactivity) ---
    const resources = computed(() => playerStore.player.resources);
    const abode = computed(() => playerStore.player.abode);

    // --- Derived Getters ---
    const maxServants = computed(() => abode.value.servants.max);
    const idleServants = computed(() => {
        const { total, food, wood, iron } = abode.value.servants;
        return total - (food + wood + iron);
    });

    const productionRates = computed(() => {
        // Integer Math for simplicity
        // Food: 2 per worker (Consumes 1, Net +1) -> 1 Farmer supports 1 Miner
        return {
            food: 2 * abode.value.servants.food,
            wood: 1 * abode.value.servants.wood,
            iron: 1 * abode.value.servants.iron
        };
    });

    const consumptionRates = computed(() => {
        const { food, wood, iron } = abode.value.servants;
        const assignedServants = food + wood + iron;
        // Consumption: 1.0 Food per assigned worker
        return {
            food: assignedServants * 1.0
        };
    });

    const netFoodProduction = computed(() => productionRates.value.food - consumptionRates.value.food);

    const upgradeCost = computed(() => {
        // Gathering Array Upgrade Cost
        const level = abode.value.gatheringArrayLevel;
        return {
            wood: Math.floor(100 * Math.pow(1.5, level - 1)),
            iron: Math.floor(50 * Math.pow(1.5, level - 1))
        };
    });

    // --- Actions ---

    // Assign Servants
    function assignServant(job: 'food' | 'wood' | 'iron', count: number): boolean {
        // Determine direction
        if (count > 0) {
            // Assigning: Check idle
            if (idleServants.value < count) return false;
            abode.value.servants[job] += count;
        } else {
            // Unassigning: Check assigned
            const removeCount = Math.abs(count);
            if (abode.value.servants[job] < removeCount) return false;
            abode.value.servants[job] -= removeCount;
        }
        playerStore.save();
        return true;
    }

    function recruitServant(count: number = 1): { success: boolean, msg: string } {
        if (abode.value.servants.total + count > maxServants.value) {
            return { success: false, msg: '洞府空间不足' };
        }

        const cost = 10 * count; // 10 Spirit Stones per servant?
        if (playerStore.player.spiritStones < cost) {
            return { success: false, msg: `灵石不足 (需 ${cost})` };
        }

        playerStore.player.spiritStones -= cost;
        abode.value.servants.total += count;
        playerStore.save();
        return { success: true, msg: `招募了 ${count} 名仙仆` };
    }

    function upgradeGatheringArray(): { success: boolean, msg: string } {
        const cost = upgradeCost.value;
        const res = resources.value;

        if (res.wood < cost.wood || res.iron < cost.iron) {
            return { success: false, msg: '资源不足' };
        }

        res.wood -= cost.wood;
        res.iron -= cost.iron;
        abode.value.gatheringArrayLevel += 1;
        playerStore.save();

        return { success: true, msg: `聚灵阵升级至 Lv.${abode.value.gatheringArrayLevel}` };
    }

    const abodeUpgradeCost = computed(() => {
        const level = abode.value.level || 1;
        return {
            wood: Math.floor(200 * Math.pow(1.6, level - 1)),
            iron: Math.floor(50 * Math.pow(1.6, level - 1))
        };
    });

    // Check for deadlock
    function checkAndFixStorageDeadlock() {
        const cost = abodeUpgradeCost.value;
        const res = resources.value;
        let changed = false;

        if (res.maxWood < cost.wood) {
            res.maxWood = Math.floor(cost.wood * 1.5); // Give 50% buffer
            changed = true;
        }
        if (res.maxIron < cost.iron) {
            res.maxIron = Math.floor(cost.iron * 1.5);
            changed = true;
        }

        if (changed) {
            playerStore.save();
            // console.log('[Abode] Deadlock fix: Caps increased.');
        }
    }

    // Watch for level changes (and runs immediately) to fix deadlocks
    watch(abodeUpgradeCost, () => {
        checkAndFixStorageDeadlock();
    }, { immediate: true });

    function upgradeAbode(): { success: boolean, msg: string } {
        const cost = abodeUpgradeCost.value;
        const res = resources.value;

        if (res.wood < cost.wood || res.iron < cost.iron) {
            return { success: false, msg: '资源不足' };
        }

        res.wood -= cost.wood;
        res.iron -= cost.iron;

        // Dynamic Storage Caps (Exponential Growth)
        // Ensure storage is always generous enough for next upgrades and idle time.
        // Base: 10k. Growth: 1.6x per level (matching cost curve).
        const nextLevel = (abode.value.level || 1) + 1;
        abode.value.level = nextLevel;
        abode.value.servants.max += 5; // +5 capacity per level

        res.maxFood = Math.floor(10000 * Math.pow(1.6, nextLevel - 1));
        res.maxWood = Math.floor(10000 * Math.pow(1.6, nextLevel - 1));
        res.maxIron = Math.floor(5000 * Math.pow(1.6, nextLevel - 1));

        playerStore.save();
        return { success: true, msg: `洞府升级至 Lv.${nextLevel}，空间+5，仓储大幅提升` };
    }

    // Tick Logic (Called by GameLoop)
    function tickResources() {
        const res = resources.value;
        const prod = productionRates.value;
        const cons = consumptionRates.value;
        const netFood = prod.food - cons.food;

        // Debug Log (Temporary):
        // console.log(`[AbodeTick] FoodWork:${abode.value.servants.food} Total:${abode.value.servants.total} Prod:${prod.food} Cons:${cons.food} Net:${netFood}`);

        // Logic Change: Calculate survival based on Start + Production >= Consumption
        // This allows consuming 'fresh' food before checking storage, avoiding the "Cap -> Consume -> Drop" loop.

        const availableFood = res.food + prod.food;

        if (availableFood >= cons.food) {
            // Can afford to eat

            // Apply Net Change directly serves to avoid the cap clipping issue
            // If Net is positive: Add to storage, clamp to max.
            // If Net is negative: Subtract from storage. 

            // However, we must be careful:
            // If we use `res.food += netFood`, and net is positive, we simply clamp.
            // If net is negative, we also simply add (subtract).
            // But we already verified we don't go below zero (logic-wise availableFood >= cons means res.food + net >= 0)

            res.food = Math.min(res.maxFood, res.food + netFood);

            // Produce other resources
            res.wood = Math.min(res.maxWood, res.wood + prod.wood);
            res.iron = Math.min(res.maxIron, res.iron + prod.iron);

        } else {
            // Starvation!
            res.food = 0;
            // No production of other resources
        }
    }

    return {
        resources,
        abode,
        maxServants,
        idleServants,
        productionRates,
        consumptionRates,
        netFoodProduction,
        upgradeCost,
        assignServant,
        recruitServant,
        upgradeGatheringArray,
        tickResources,
        abodeUpgradeCost,
        upgradeAbode
    };
});
