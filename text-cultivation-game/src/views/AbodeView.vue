<template>
  <div class="h-full flex flex-col p-4 gap-4 overflow-hidden">
    <!-- Header: Resources Summary (Always Visible - Consolidated) -->
    <div class="flex-none bg-neutral-800 p-3 rounded-lg border border-neutral-700 flex justify-between items-center text-xs">
        <div class="flex flex-col items-center">
            <span class="text-amber-500">食物</span>
            <span class="font-mono">{{ Math.floor(resources.food) }}</span>
            <span class="text-[10px]" :class="netFoodProduction >= 0 ? 'text-green-500' : 'text-red-500'">{{ netFoodProduction >=0?'+':''}}{{netFoodProduction}}/s</span>
        </div>
        <div class="flex flex-col items-center">
            <span class="text-green-500">木材</span>
            <span class="font-mono">{{ Math.floor(resources.wood) }}</span>
            <span class="text-[10px] text-green-500">+{{ productionRates.wood }}/s</span>
        </div>
        <div class="flex flex-col items-center">
            <span class="text-gray-400">陨铁</span>
            <span class="font-mono">{{ Math.floor(resources.iron) }}</span>
            <span class="text-[10px] text-green-500">+{{ productionRates.iron }}/s</span>
        </div>
        <div v-if="abode.spiritGardenLevel > 0" class="flex flex-col items-center">
            <span class="text-emerald-400">灵草</span>
            <span class="font-mono">{{ Math.floor(resources.herb || 0) }}</span>
             <span class="text-[10px] text-green-500">+{{ productionRates.herb }}/s</span>
        </div>
    </div>

    <!-- Tabs -->
    <div class="flex-1 flex flex-col min-h-0 bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
        <div class="flex border-b border-neutral-700 shrink-0">
            <button 
                v-for="tab in ['经营', '建设']" 
                :key="tab"
                @click="activeTab = tab"
                class="flex-1 py-3 text-sm font-bold transition-colors relative"
                :class="activeTab === tab ? 'text-amber-500 bg-neutral-700/50' : 'text-neutral-500 hover:bg-neutral-700/30'"
            >
                {{ tab }}
                <div v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></div>
            </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4 scrollbar-hide">
            
            <!-- Management Tab -->
            <div v-if="activeTab === '经营'" class="space-y-4">
                <!-- Servants Info -->
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-bold text-neutral-300">仙仆调配</span>
                    <div class="text-xs">
                        <span class="text-neutral-500">闲置/总数:</span>
                        <span class="text-white ml-1">{{ idleServants }} / {{ abode.servants.total }}</span>
                    </div>
                </div>

                <!-- Assignment Grid -->
                <div class="grid grid-cols-1 gap-2">
                    <div class="flex items-center justify-between bg-neutral-900/50 p-3 rounded border border-neutral-800">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded bg-amber-900/30 flex items-center justify-center text-amber-500 font-bold text-xs">粮</div>
                            <div>
                                <div class="text-xs text-neutral-300">灵田夫 (食物)</div>
                                <div class="text-[10px] text-neutral-500">当前: {{ abode.servants.food }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <button @click="handleAssign('food', -1)" class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded hover:bg-neutral-600">-</button>
                            <button @click="handleAssign('food', 1)" class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded hover:bg-neutral-600">+</button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between bg-neutral-900/50 p-3 rounded border border-neutral-800">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded bg-green-900/30 flex items-center justify-center text-green-500 font-bold text-xs">木</div>
                            <div>
                                <div class="text-xs text-neutral-300">伐木工 (木材)</div>
                                <div class="text-[10px] text-neutral-500">当前: {{ abode.servants.wood }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <button @click="handleAssign('wood', -1)" class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded hover:bg-neutral-600">-</button>
                            <button @click="handleAssign('wood', 1)" class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded hover:bg-neutral-600">+</button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between bg-neutral-900/50 p-3 rounded border border-neutral-800">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">矿</div>
                            <div>
                                <div class="text-xs text-neutral-300">矿工 (陨铁)</div>
                                <div class="text-[10px] text-neutral-500">当前: {{ abode.servants.iron }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <button @click="handleAssign('iron', -1)" class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded hover:bg-neutral-600">-</button>
                            <button @click="handleAssign('iron', 1)" class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded hover:bg-neutral-600">+</button>
                        </div>
                    </div>

                    <div v-if="abode.spiritGardenLevel > 0" class="flex items-center justify-between bg-neutral-900/50 p-3 rounded border border-neutral-800">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded bg-emerald-900/30 flex items-center justify-center text-emerald-400 font-bold text-xs">药</div>
                            <div>
                                <div class="text-xs text-neutral-300">药童 (灵草)</div>
                                <div class="text-[10px] text-neutral-500">当前: {{ abode.servants.herb || 0 }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <button @click="handleAssign('herb', -1)" class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded hover:bg-neutral-600">-</button>
                            <button @click="handleAssign('herb', 1)" class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded hover:bg-neutral-600">+</button>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-neutral-700 mt-4">
                     <button @click="openRecruitModal" class="w-full py-3 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-sm font-bold rounded border border-neutral-600">
                        招募流民 (10灵石)
                     </button>
                </div>
            </div>

            <!-- Build Tab -->
            <div v-if="activeTab === '建设'" class="space-y-4">
                <!-- Abode Level -->
                 <div class="bg-neutral-900/50 p-3 rounded border border-neutral-800">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <div class="text-sm font-bold text-blue-500">洞府扩建</div>
                            <div class="text-xs text-neutral-500">当前规模: Lv.{{ abode.level || 1 }}</div>
                        </div>
                        <button @click="handleUpgradeAbode" class="px-3 py-1 bg-blue-900/50 text-blue-300 border border-blue-800 rounded text-xs hover:bg-blue-900">扩建</button>
                    </div>
                     <div class="text-[10px] text-neutral-400">消耗: 木{{ abodeUpgradeCost.wood }} / 铁{{ abodeUpgradeCost.iron }}</div>
                </div>

                <!-- Gathering Array -->
                 <div class="bg-neutral-900/50 p-3 rounded border border-neutral-800">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <div class="text-sm font-bold text-amber-500">聚灵阵</div>
                            <div class="text-xs text-neutral-500">等级: {{ abode.gatheringArrayLevel }}</div>
                        </div>
                        <button @click="handleUpgradeArray" class="px-3 py-1 bg-amber-900/50 text-amber-300 border border-amber-800 rounded text-xs hover:bg-amber-900">升级</button>
                    </div>
                     <div class="text-[10px] text-neutral-400 mb-1">
                        效果: 修炼+{{ abode.gatheringArrayLevel }}/s, 回复+{{(abode.gatheringArrayLevel*0.5).toFixed(1)}}%/s
                     </div>
                     <div class="text-[10px] text-neutral-400">消耗: 木{{ upgradeCost.wood }} / 铁{{ upgradeCost.iron }}</div>
                </div>

                 <!-- Spirit Garden -->
                 <div class="bg-neutral-900/50 p-3 rounded border border-neutral-800">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <div class="text-sm font-bold text-emerald-500">灵田</div>
                            <div class="text-xs text-neutral-500">
                                {{ (!abode.spiritGardenLevel || abode.spiritGardenLevel === 0) ? '未开辟' : `等级: ${abode.spiritGardenLevel}` }}
                            </div>
                        </div>
                         <button @click="handleUpgradeSpiritGarden" class="px-3 py-1 bg-emerald-900/50 text-emerald-300 border border-emerald-800 rounded text-xs hover:bg-emerald-900">
                            {{ (!abode.spiritGardenLevel || abode.spiritGardenLevel === 0) ? '开辟' : '升级' }}
                        </button>
                    </div>
                    <div v-if="!abode.spiritGardenLevel || abode.spiritGardenLevel === 0" class="text-[10px] text-neutral-400 mb-1">
                        需洞府Lv.2, 允许种植灵草
                    </div>
                     <div class="text-[10px] text-neutral-400">消耗: 木{{ spiritGardenCost.wood }} / 铁{{ spiritGardenCost.iron }}</div>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAbodeStore } from '../stores/abode';
import { useModal } from '../composables/useModal';

const abodeStore = useAbodeStore();
const { showModal } = useModal();
const activeTab = ref('经营'); // Default tab

// Reactivity
const resources = computed(() => abodeStore.resources);
const abode = computed(() => abodeStore.abode);
const idleServants = computed(() => abodeStore.idleServants);
const productionRates = computed(() => abodeStore.productionRates);
const netFoodProduction = computed(() => abodeStore.netFoodProduction);
const upgradeCost = computed(() => abodeStore.upgradeCost);
const abodeUpgradeCost = computed(() => abodeStore.abodeUpgradeCost);
const spiritGardenCost = computed(() => abodeStore.spiritGardenCost || { wood: 0, iron: 0 });

// Actions
function handleAssign(job: 'food' | 'wood' | 'iron' | 'herb', amount: number) {
    if (!abodeStore.assignServant(job, amount)) {
        // Fail silently or shake UI?
    }
}

function openRecruitModal() {
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

function handleUpgradeArray() {
    const res = abodeStore.upgradeGatheringArray();
    showModal({ title: res.success ? '升级成功' : '升级失败', content: res.msg });
}

function handleUpgradeAbode() {
    const res = abodeStore.upgradeAbode();
    showModal({ title: res.success ? '扩建成功' : '扩建失败', content: res.msg });
}

function handleUpgradeSpiritGarden() {
    const res = abodeStore.upgradeSpiritGarden();
    showModal({ title: res.success ? '操作成功' : '操作失败', content: res.msg });
}
</script>
```
