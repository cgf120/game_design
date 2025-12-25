<template>
  <div class="h-full flex flex-col p-2 gap-2 overflow-hidden bg-black text-xs font-serif leading-relaxed select-none">
    <!-- Header: Resources Summary (Compact & Glowing) -->
    <div class="flex-none bg-neutral-900/80 p-2 border-y border-neutral-800 grid grid-cols-4 gap-2 text-center relative">
        <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
        
        <div class="flex flex-col items-center">
            <span class="text-amber-600 text-[10px] transform scale-90">食物</span>
            <span class="font-mono text-amber-500">{{ Math.floor(resources.food) }}</span>
            <span class="text-[8px] font-mono" :class="netFoodProduction >= 0 ? 'text-green-600' : 'text-red-500'">{{ (netFoodProduction >=0?'+':'') + netFoodProduction }}/s</span>
        </div>
        <div class="flex flex-col items-center">
            <span class="text-green-700 text-[10px] transform scale-90">木材</span>
            <span class="font-mono text-green-600">{{ Math.floor(resources.wood) }}</span>
            <span class="text-[8px] text-green-700 font-mono">+{{ productionRates.wood }}/s</span>
        </div>
        <div class="flex flex-col items-center">
            <span class="text-neutral-500 text-[10px] transform scale-90">陨铁</span>
            <span class="font-mono text-neutral-400">{{ Math.floor(resources.iron) }}</span>
            <span class="text-[8px] text-green-700 font-mono">+{{ productionRates.iron }}/s</span>
        </div>
        <div class="flex flex-col items-center">
            <span class="text-emerald-600 text-[10px] transform scale-90">灵草</span>
            <span class="font-mono text-emerald-500">{{ Math.floor(resources.herb || 0) }}</span>
             <span class="text-[8px] text-green-700 font-mono">+{{ productionRates.herb }}/s</span>
        </div>
    </div>

    <!-- Tabs -->
    <div class="flex-1 flex flex-col min-h-0 border border-neutral-800 bg-neutral-900/30 relative">
        <div class="flex justify-center gap-8 py-2 text-sm border-b border-neutral-800/50 bg-black">
            <button 
                v-for="tab in ['经营', '建设', '炼器']" 
                :key="tab"
                @click="activeTab = tab"
                class="relative px-2 transition-colors"
                :class="activeTab === tab ? 'text-amber-500 text-glow-gold font-bold' : 'text-neutral-600 hover:text-neutral-400'"
            >
                {{ tab }}
                <span v-if="activeTab === tab" class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-amber-900">▣</span>
            </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-2 scrollbar-hide">
            
            <!-- Management Tab -->
            <div v-if="activeTab === '经营'" class="space-y-4">
                <!-- Servants Info -->
                <div class="flex justify-between items-center px-1 text-neutral-500">
                    <span>◆ 仙仆调配</span>
                    <span class="font-mono text-[10px]">闲置 <span class="text-white">{{ idleServants }}</span> / {{ abode.servants.total }}</span>
                </div>

                <!-- Assignment Grid -->
                <div class="space-y-1">
                    <div class="flex items-center justify-between bg-black p-2 border border-neutral-900 hover:border-neutral-700 transition-colors group">
                        <div class="flex items-center gap-3">
                            <div class="text-amber-600 font-bold w-4 text-center">粮</div>
                            <div>
                                <div class="text-neutral-400 group-hover:text-amber-500 transition-colors">灵田夫</div>
                                <div class="text-[10px] text-neutral-600">当前: {{ abode.servants.food }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 font-mono">
                            <button @click="handleAssign('food', -1)" class="w-6 h-6 flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 text-neutral-500">-</button>
                            <button @click="handleAssign('food', 1)" class="w-6 h-6 flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 text-neutral-500">+</button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between bg-black p-2 border border-neutral-900 hover:border-neutral-700 transition-colors group">
                        <div class="flex items-center gap-3">
                            <div class="text-green-600 font-bold w-4 text-center">木</div>
                            <div>
                                <div class="text-neutral-400 group-hover:text-green-500 transition-colors">伐木工</div>
                                <div class="text-[10px] text-neutral-600">当前: {{ abode.servants.wood }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 font-mono">
                            <button @click="handleAssign('wood', -1)" class="w-6 h-6 flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 text-neutral-500">-</button>
                            <button @click="handleAssign('wood', 1)" class="w-6 h-6 flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 text-neutral-500">+</button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between bg-black p-2 border border-neutral-900 hover:border-neutral-700 transition-colors group">
                        <div class="flex items-center gap-3">
                            <div class="text-neutral-400 font-bold w-4 text-center">矿</div>
                            <div>
                                <div class="text-neutral-400 group-hover:text-neutral-300 transition-colors">矿工</div>
                                <div class="text-[10px] text-neutral-600">当前: {{ abode.servants.iron }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 font-mono">
                            <button @click="handleAssign('iron', -1)" class="w-6 h-6 flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 text-neutral-500">-</button>
                            <button @click="handleAssign('iron', 1)" class="w-6 h-6 flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 text-neutral-500">+</button>
                        </div>
                    </div>

                    <div v-if="abode.spiritGardenLevel > 0" class="flex items-center justify-between bg-black p-2 border border-neutral-900 hover:border-neutral-700 transition-colors group">
                        <div class="flex items-center gap-3">
                            <div class="text-emerald-500 font-bold w-4 text-center">药</div>
                            <div>
                                <div class="text-neutral-400 group-hover:text-emerald-400 transition-colors">药童</div>
                                <div class="text-[10px] text-neutral-600">当前: {{ abode.servants.herb || 0 }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 font-mono">
                            <button @click="handleAssign('herb', -1)" class="w-6 h-6 flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 text-neutral-500">-</button>
                            <button @click="handleAssign('herb', 1)" class="w-6 h-6 flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 text-neutral-500">+</button>
                        </div>
                    </div>
                </div>

                <div class="pt-2 mt-4 text-center">
                     <button @click="openRecruitModal" class="w-full py-2 border border-dashed border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-500 text-xs">
                        + 招募流民 (10灵石) +
                     </button>
                </div>
            </div>

            <!-- Build Tab -->
            <div v-if="activeTab === '建设'" class="space-y-3">
                <!-- Abode Level -->
                 <div class="bg-black p-3 border border-neutral-800 relative group">
                    <div class="absolute -left-[1px] -right-[1px] top-0 h-[1px] bg-neutral-800"></div>
                    <div class="flex justify-between items-start mb-1">
                        <div>
                            <div class="text-sm font-bold text-blue-500 group-hover:text-glow-blue transition-all">洞府扩建</div>
                            <div class="text-[10px] text-neutral-600 font-mono mt-1">Lv.{{ abode.level || 1 }}</div>
                        </div>
                        <button @click="handleUpgradeAbode" class="px-2 py-0.5 border border-blue-900 text-blue-500 hover:bg-blue-900/20 text-xs">扩建</button>
                    </div>
                     <div class="text-[10px] text-neutral-500 font-mono mt-2 pt-2 border-t border-dashed border-neutral-900">
                        消耗: 木{{ abodeUpgradeCost.wood }} / 铁{{ abodeUpgradeCost.iron }}
                     </div>
                </div>

                <!-- Gathering Array -->
                 <div class="bg-black p-3 border border-neutral-800 relative group">
                    <div class="flex justify-between items-start mb-1">
                        <div>
                            <div class="text-sm font-bold text-amber-600 group-hover:text-glow-gold transition-all">聚灵阵</div>
                            <div class="text-[10px] text-neutral-600 font-mono mt-1">Lv.{{ abode.gatheringArrayLevel }}</div>
                        </div>
                        <button @click="handleUpgradeArray" class="px-2 py-0.5 border border-amber-900 text-amber-600 hover:bg-amber-900/20 text-xs">升级</button>
                    </div>
                     <div class="text-[10px] text-neutral-500 mt-2 mb-1">
                        修炼+{{ abode.gatheringArrayLevel }}/s, 回复+{{(abode.gatheringArrayLevel*0.5).toFixed(1)}}%/s
                     </div>
                      <div class="text-[10px] text-neutral-600 font-mono pt-1 border-t border-dashed border-neutral-900">
                        消耗: 木{{ upgradeCost.wood }} / 铁{{ upgradeCost.iron }}
                     </div>
                </div>

                 <!-- Spirit Garden -->
                 <div class="bg-black p-3 border border-neutral-800 relative group">
                    <div class="flex justify-between items-start mb-1">
                        <div>
                            <div class="text-sm font-bold text-emerald-600 group-hover:text-glow-jade transition-all">灵田</div>
                            <div class="text-[10px] text-neutral-600 font-mono mt-1">
                                {{ (!abode.spiritGardenLevel || abode.spiritGardenLevel === 0) ? '未开辟' : `Lv. ${abode.spiritGardenLevel}` }}
                            </div>
                        </div>
                         <button @click="handleUpgradeSpiritGarden" class="px-2 py-0.5 border border-emerald-900 text-emerald-600 hover:bg-emerald-900/20 text-xs">
                            {{ (!abode.spiritGardenLevel || abode.spiritGardenLevel === 0) ? '开辟' : '升级' }}
                        </button>
                    </div>
                    <div v-if="!abode.spiritGardenLevel || abode.spiritGardenLevel === 0" class="text-[10px] text-neutral-500 mb-1">
                        需洞府Lv.2, 允许种植灵草
                    </div>
                     <div class="text-[10px] text-neutral-600 font-mono pt-1 border-t border-dashed border-neutral-900">
                        消耗: 木{{ spiritGardenCost.wood }} / 铁{{ spiritGardenCost.iron }}
                     </div>
                </div>
            </div>

            <!-- Crafting Tab -->
            <div v-if="activeTab === '炼器'" class="space-y-3">
                 <div v-if="availableRecipes.length === 0" class="text-center text-neutral-500 py-4">
                    <div class="text-xs">暂无配方</div>
                    <div class="text-[10px] opacity-60 mt-1">升级洞府可解锁更多</div>
                 </div>

                 <div v-for="recipe in availableRecipes" :key="recipe.id" class="bg-black p-2 border border-neutral-800 relative group">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex-1 mr-2">
                             <div class="flex items-center gap-2">
                                <div class="text-sm font-bold text-neutral-300 group-hover:text-glow-silver transition-all">{{ recipe.name }}</div>
                                <!-- Badge for type -->
                                <span v-if="getRecipeItem(recipe.outputId)?.type === 'equipment'" class="px-1 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[8px] text-neutral-500">
                                    装备
                                </span>
                             </div>
                             <div class="text-[10px] text-neutral-500 mt-0.5 mb-1">{{ recipe.description }}</div>
                             
                             <!-- Stats Preview -->
                             <div v-if="getRecipeItem(recipe.outputId)?.statsRange" class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-neutral-400 font-mono bg-neutral-900/50 p-1.5 rounded border border-neutral-800/50">
                                <div v-for="(range, stat) in getRecipeItem(recipe.outputId)?.statsRange" :key="stat">
                                    <span class="text-neutral-500">{{ STAT_NAMES[stat as keyof typeof STAT_NAMES] || stat }}: </span>
                                    <span class="text-amber-700/80">{{ range && range[0] }}-{{ range && range[1] }}</span>
                                </div>
                             </div>
                        </div>
                        <button 
                            @click="handleCraft(recipe.id)"
                            class="px-3 py-1 border text-xs transition-colors shrink-0"
                            :class="craftingStore.canCraft(recipe) 
                                ? 'border-amber-700 text-amber-500 hover:bg-amber-900/30 cursor-pointer' 
                                : 'border-neutral-800 text-neutral-600 cursor-not-allowed'"
                            :disabled="!craftingStore.canCraft(recipe)"
                        >
                            打造
                        </button>
                    </div>

                    <!-- Cost Display -->
                    <div class="grid grid-cols-4 gap-2 text-[10px] font-mono border-t border-dashed border-neutral-900 pt-2">
                         <div v-if="recipe.cost.spiritStones">
                            <span :class="playerStore.player.spiritStones >= recipe.cost.spiritStones ? 'text-neutral-400' : 'text-red-500'">
                                灵石 {{ recipe.cost.spiritStones }}
                            </span>
                        </div>
                        <div v-if="recipe.cost.wood">
                            <span :class="resources.wood >= recipe.cost.wood ? 'text-green-600' : 'text-red-500'">
                                木 {{ recipe.cost.wood }}
                            </span>
                        </div>
                        <div v-if="recipe.cost.iron">
                            <span :class="resources.iron >= recipe.cost.iron ? 'text-neutral-400' : 'text-red-500'">
                                铁 {{ recipe.cost.iron }}
                            </span>
                        </div>
                         <div v-if="recipe.cost.herb">
                            <span :class="(resources.herb||0) >= recipe.cost.herb ? 'text-emerald-500' : 'text-red-500'">
                                草 {{ recipe.cost.herb }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getItem } from '../core/constants/items';
import { useAbodeStore } from '../stores/abode';
import { useCraftingStore } from '../stores/crafting';
import { usePlayerStore } from '../stores/player';
import { useModal } from '../composables/useModal';

const abodeStore = useAbodeStore();
const craftingStore = useCraftingStore();
const playerStore = usePlayerStore();
const { showModal } = useModal();
const activeTab = ref('经营'); // Default tab

// Reactivity
const resources = computed(() => abodeStore.resources);
// ... existing computed ...

// Helper to get item details for recipe
function getRecipeItem(outputId: string) {
    return getItem(outputId);
}

const STAT_NAMES = {
    atk: '攻击',
    def: '防御',
    hp: '气血',
    mp: '灵力',
    critRate: '暴击',
    dodgeRate: '闪避'
};

const abode = computed(() => abodeStore.abode);
const idleServants = computed(() => abodeStore.idleServants);
const productionRates = computed(() => abodeStore.productionRates);
const netFoodProduction = computed(() => abodeStore.netFoodProduction);
const upgradeCost = computed(() => abodeStore.upgradeCost);
const abodeUpgradeCost = computed(() => abodeStore.abodeUpgradeCost);
const spiritGardenCost = computed(() => abodeStore.spiritGardenCost || { wood: 0, iron: 0 });
const availableRecipes = computed(() => craftingStore.availableRecipes);

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

function handleCraft(recipeId: string) {
    const res = craftingStore.craftItem(recipeId);
    showModal({ title: res.success ? '消息' : '失败', content: res.msg });
}
</script>
```
