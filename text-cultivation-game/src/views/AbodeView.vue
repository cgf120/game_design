<template>
  <div class="h-full overflow-y-auto p-4 pb-20 space-y-4">
    <!-- Resource Monitor -->
    <div class="bg-neutral-800 p-4 rounded border border-neutral-700">
        <h3 class="text-lg font-bold text-amber-500 mb-3">洞府资源</h3>
        <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-neutral-900 rounded">
                <div class="text-xs text-neutral-500">食物</div>
                <div class="font-mono text-emerald-400">{{ Math.floor(resources.food) }}</div>
                <div class="text-[10px]" :class="netFoodProduction >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ netFoodProduction >= 0 ? '+' : ''}}{{ netFoodProduction }}/s
                </div>
            </div>
            <div class="p-2 bg-neutral-900 rounded">
                <div class="text-xs text-neutral-500">木材</div>
                <div class="font-mono text-amber-700">{{ Math.floor(resources.wood) }}</div>
                <div class="text-[10px] text-green-600">+{{ productionRates.wood }}/s</div>
            </div>
            <div class="p-2 bg-neutral-900 rounded">
                <div class="text-xs text-neutral-500">陨铁</div>
                <div class="font-mono text-slate-400">{{ Math.floor(resources.iron) }}</div>
                <div class="text-[10px] text-green-600">+{{ productionRates.iron }}/s</div>
            </div>
        </div>
        <div class="mt-2 text-xs text-neutral-600 text-center">
            仓储上限: {{ resources.maxFood }} / {{ resources.maxWood }} / {{ resources.maxIron }}
        </div>
    </div>

    <!-- Servant Management -->
    <div class="bg-neutral-800 p-4 rounded border border-neutral-700">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-amber-500">仙仆管理</h3>
            <div class="text-xs text-neutral-400">
                闲置: <span class="text-white">{{ idleServants }}</span> / 总数: {{ abode.servants.total }}
            </div>
        </div>

        <div class="space-y-3">
             <!-- Food Job -->
             <div class="flex items-center justify-between bg-neutral-900 p-2 rounded">
                <div class="text-sm">
                    <span class="block text-emerald-400">农夫 (食物)</span>
                    <span class="text-[10px] text-neutral-500">消耗0/产出1</span>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="assign('food', -1)" class="w-6 h-6 bg-neutral-700 rounded text-neutral-300 hover:bg-neutral-600">-</button>
                    <span class="w-8 text-center font-mono">{{ abode.servants.food }}</span>
                    <button @click="assign('food', 1)" class="w-6 h-6 bg-neutral-700 rounded text-neutral-300 hover:bg-neutral-600" :disabled="idleServants <= 0">+</button>
                </div>
             </div>

             <!-- Wood Job -->
             <div class="flex items-center justify-between bg-neutral-900 p-2 rounded">
                <div class="text-sm">
                    <span class="block text-amber-700">伐木工 (木材)</span>
                    <span class="text-[10px] text-neutral-500">消耗0.5食/产出1</span>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="assign('wood', -1)" class="w-6 h-6 bg-neutral-700 rounded text-neutral-300 hover:bg-neutral-600">-</button>
                    <span class="w-8 text-center font-mono">{{ abode.servants.wood }}</span>
                    <button @click="assign('wood', 1)" class="w-6 h-6 bg-neutral-700 rounded text-neutral-300 hover:bg-neutral-600" :disabled="idleServants <= 0">+</button>
                </div>
             </div>

             <!-- Iron Job -->
             <div class="flex items-center justify-between bg-neutral-900 p-2 rounded">
                <div class="text-sm">
                    <span class="block text-slate-400">矿工 (陨铁)</span>
                    <span class="text-[10px] text-neutral-500">消耗0.5食/产出0.5</span>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="assign('iron', -1)" class="w-6 h-6 bg-neutral-700 rounded text-neutral-300 hover:bg-neutral-600">-</button>
                    <span class="w-8 text-center font-mono">{{ abode.servants.iron }}</span>
                    <button @click="assign('iron', 1)" class="w-6 h-6 bg-neutral-700 rounded text-neutral-300 hover:bg-neutral-600" :disabled="idleServants <= 0">+</button>
                </div>
             </div>
        </div>

        <button 
            @click="handleRecruit"
            class="w-full mt-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm rounded border border-neutral-600"
        >
            招募仙仆 (10灵石)
        </button>
    </div>

    <!-- Facilities -->
    <div class="bg-neutral-800 p-4 rounded border border-neutral-700 space-y-6">
        <!-- Abode Expansion -->
        <div>
            <h3 class="text-lg font-bold text-amber-500 mb-2">洞府规模</h3>
            <p class="text-xs text-neutral-400 mb-2">
                等级: <span class="text-white">{{ abode.level || 1 }}</span><br>
                仙仆上限: <span class="text-white">{{ abode.servants.max }}</span>
            </p>
            <div class="flex justify-between items-center text-xs text-neutral-500 mb-2">
                <span>扩建消耗:</span>
                <span>木材 {{ abodeUpgradeCost.wood }} / 陨铁 {{ abodeUpgradeCost.iron }}</span>
            </div>
            <button 
                @click="handleUpgradeAbode"
                class="w-full py-2 bg-neutral-700 text-neutral-300 border border-neutral-600 hover:bg-neutral-600 rounded transition-colors"
            >
                扩建洞府 (+5空间)
            </button>
        </div>

        <div class="border-t border-neutral-700 pt-4">
            <h3 class="text-lg font-bold text-amber-500 mb-3">聚灵阵</h3>
            <p class="text-xs text-neutral-400 mb-4">
                等級: <span class="text-white">{{ abode.gatheringArrayLevel }}</span><br>
                当前效果: <br>
                - 修炼速度 <span class="text-emerald-400">+{{ abode.gatheringArrayLevel }}点/秒</span><br>
                - 吐纳回复 <span class="text-blue-400">+{{ (abode.gatheringArrayLevel * 0.5).toFixed(1) }}%/秒</span>
            </p>
            
            <div class="flex justify-between items-center text-xs text-neutral-500 mb-2">
                <span>升级消耗:</span>
                <span>木材 {{ upgradeCost.wood }} / 陨铁 {{ upgradeCost.iron }}</span>
            </div>

            <button 
                @click="handleUpgrade"
                class="w-full py-2 bg-amber-900/40 text-amber-500 border border-amber-800/50 hover:bg-amber-900/60 rounded transition-colors"
            >
                升级聚灵阵
            </button>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAbodeStore } from '../stores/abode';
import { useModal } from '../composables/useModal';

const abodeStore = useAbodeStore();
const { showModal } = useModal();

// Reactivity
const resources = computed(() => abodeStore.resources);
const abode = computed(() => abodeStore.abode);
const idleServants = computed(() => abodeStore.idleServants);
const productionRates = computed(() => abodeStore.productionRates);
const netFoodProduction = computed(() => abodeStore.netFoodProduction);
const upgradeCost = computed(() => abodeStore.upgradeCost);
const abodeUpgradeCost = computed(() => abodeStore.abodeUpgradeCost);

// Actions
function assign(job: 'food' | 'wood' | 'iron', amount: number) {
    if (!abodeStore.assignServant(job, amount)) {
        // Fail silently or shake UI?
    }
}

function handleRecruit() {
    // Check limit
    if (abode.value.servants.total >= abode.value.servants.max) {
        showModal({ title: '上限已达', content: '洞府空间不足，无法招募更多仙仆，请先扩建洞府。' }); // Clearer message
        return;
    }

    showModal({
        title: '招募仙仆',
        content: '花费 10 灵石招募一名仙仆？',
        showCancel: true,
        onConfirm: () => {
            const res = abodeStore.recruitServant(1);
            showModal({ title: res.success ? '成功' : '失败', content: res.msg });
        }
    });
}

function handleUpgrade() {
    const res = abodeStore.upgradeGatheringArray();
    showModal({ title: res.success ? '升级成功' : '升级失败', content: res.msg });
}

function handleUpgradeAbode() {
    const res = abodeStore.upgradeAbode();
    showModal({ title: res.success ? '扩建成功' : '扩建失败', content: res.msg });
}

</script>
