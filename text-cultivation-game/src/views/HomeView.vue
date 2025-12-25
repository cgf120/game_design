<template>
  <div class="h-full flex flex-col p-2 gap-2 overflow-hidden bg-black text-xs font-serif leading-relaxed select-none">
    
    <!-- TOP STATUS AREA (Denser) -->
    <div class="flex-none p-2 border border-neutral-800 bg-neutral-900/80 relative">
        <div class="absolute top-0 left-0 text-neutral-700 leading-none select-none">╔</div>
        <div class="absolute top-0 right-0 text-neutral-700 leading-none select-none">╗</div>
        <div class="absolute bottom-0 left-0 text-neutral-700 leading-none select-none">╚</div>
        <div class="absolute bottom-0 right-0 text-neutral-700 leading-none select-none">╝</div>

        <div class="flex items-center justify-between z-10 relative">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 border border-amber-900 bg-black flex items-center justify-center text-xl text-amber-600 font-bold shadow-[0_0_10px_rgba(180,83,9,0.3)]">
                    道
                </div>
                <div>
                     <div class="text-glow-gold text-amber-500 font-bold text-sm tracking-widest">{{ currentRealmName }} <span class="text-[10px] text-neutral-500 font-mono">{{ (progressPercentage).toFixed(1) }}%</span></div>
                     <div class="text-neutral-500 scale-90 origin-left">道历 {{ gameDay }} 年 · 寿元 {{ Math.floor(stats.hp) }}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-jade text-glow-jade tracking-wide">灵石 {{ spiritStones }}</div>
                <div class="text-neutral-500 scale-90 origin-right">声望 0</div>
            </div>
        </div>
    </div>

    <!-- MAIN MEDITATION AREA (Visual Center) -->
    <div class="flex-none h-48 relative border-x border-neutral-900 bg-gradient-to-b from-black via-neutral-900/20 to-black flex flex-col items-center justify-center gap-4">
        <!-- Decor -->
        <div class="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center text-[100px] text-neutral-800 font-cursive">修</div>
        
        <!-- Orb -->
        <div 
            @click="manualCultivate"
            class="w-24 h-24 rounded-full border border-neutral-800 relative flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,1)] bg-black overflow-hidden cursor-pointer active:scale-95 transition-transform"
        >
            <div class="absolute inset-0 rounded-full border border-amber-900/30 animate-pulse z-20"></div>
            <div 
                class="absolute bottom-0 w-full bg-amber-600/20 transition-all duration-300 ease-linear z-10" 
                :style="{ height: `${Math.min(progressPercentage, 100)}%` }"
            ></div>
            <div class="z-30 text-3xl animate-pulse text-neutral-700 select-none">🧘</div>
        </div>

        <!-- Actions -->
        <div class="w-full px-8 flex justify-between gap-4 z-10">
            <button 
                @click="manualCultivate"
                class="flex-1 py-1 border border-neutral-800 hover:border-neutral-600 bg-black text-neutral-400 hover:text-white transition-colors text-center group"
            >
                <span class="group-hover:text-glow-gold">[ 吐纳 ]</span>
            </button>
            <button 
                v-if="canBreakthrough"
                @click="openBreakthroughDialog"
                class="flex-1 py-1 border border-amber-900 hover:border-amber-600 bg-amber-900/10 text-amber-500 text-center animate-pulse"
            >
                [ 突破 ]
            </button>
             <button 
                v-else
                class="flex-1 py-1 border border-transparent text-neutral-700 text-center cursor-default"
            >
                <span class="opacity-50">...</span>
            </button>
        </div>
    </div>

    <!-- TABBED INFO PANEL (Dense List) -->
    <div class="flex-1 flex flex-col min-h-0 border-t border-b border-neutral-800 bg-neutral-900/30 relative">
        <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
        
        <!-- Tab Headers (Text Based) -->
        <div class="flex justify-center gap-8 py-2 text-sm border-b border-neutral-800/50">
            <button 
                v-for="tab in ['属性', '神通', '日志', '设置']" 
                :key="tab"
                @click="activeTab = tab"
                class="relative px-2 transition-colors"
                :class="activeTab === tab ? 'text-amber-500 text-glow-gold font-bold' : 'text-neutral-600 hover:text-neutral-400'"
            >
                {{ tab }}
                <span v-if="activeTab === tab" class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-amber-900">▲</span>
            </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-2 scrollbar-hide text-xs font-mono">
            
            <!-- STATS TAB -->
            <div v-if="activeTab === '属性'">
                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div class="flex justify-between border-b border-dashed border-neutral-800 pb-1">
                        <span class="text-neutral-500">攻击</span><span class="text-amber-600">{{ stats.atk }}</span>
                    </div>
                    <div class="flex justify-between border-b border-dashed border-neutral-800 pb-1">
                        <span class="text-neutral-500">防御</span><span class="text-blue-600">{{ stats.def }}</span>
                    </div>
                    <div class="flex justify-between border-b border-dashed border-neutral-800 pb-1">
                        <span class="text-neutral-500">气血</span><span class="text-neutral-300">{{ Math.floor(stats.hp) }}/{{ stats.maxHp }}</span>
                    </div>
                    <div class="flex justify-between border-b border-dashed border-neutral-800 pb-1">
                        <span class="text-neutral-500">灵力</span><span class="text-sky-600">{{ Math.floor(stats.mp) }}/{{ stats.maxMp }}</span>
                    </div>
                    <div class="flex justify-between border-b border-dashed border-neutral-800 pb-1">
                        <span class="text-neutral-500">暴击</span><span class="text-neutral-400">{{ (stats.critRate * 100).toFixed(1) }}%</span>
                    </div>
                </div>

                <div class="mt-4 mb-1 text-center text-neutral-600 text-[10px] tracking-widest">— 装备 —</div>
                <div class="space-y-1">
                     <div class="flex justify-between items-center bg-black p-1 border border-neutral-800">
                        <span class="text-neutral-500">[武]</span>
                        <span class="text-amber-700">{{ getEquipName(playerStore.player.equipment?.weapon) }}</span>
                     </div>
                     <div class="flex justify-between items-center bg-black p-1 border border-neutral-800">
                        <span class="text-neutral-500">[甲]</span>
                        <span class="text-blue-700">{{ getEquipName(playerStore.player.equipment?.armor) }}</span>
                     </div>
                     <div class="flex justify-between items-center bg-black p-1 border border-neutral-800">
                        <span class="text-neutral-500">[宝]</span>
                        <span class="text-purple-700">{{ getEquipName(playerStore.player.equipment?.accessory) }}</span>
                     </div>
                </div>

                <div class="mt-4 mb-1 text-center text-neutral-600 text-[10px] tracking-widest">— 灵根 —</div>
                <div class="flex justify-between px-2 text-center">
                    <div class="flex flex-col"><span class="text-yellow-700">金</span><span class="text-neutral-500">{{ playerStore.player.spiritRoot.metal }}</span></div>
                    <div class="flex flex-col"><span class="text-green-700">木</span><span class="text-neutral-500">{{ playerStore.player.spiritRoot.wood }}</span></div>
                    <div class="flex flex-col"><span class="text-blue-700">水</span><span class="text-neutral-500">{{ playerStore.player.spiritRoot.water }}</span></div>
                    <div class="flex flex-col"><span class="text-red-700">火</span><span class="text-neutral-500">{{ playerStore.player.spiritRoot.fire }}</span></div>
                    <div class="flex flex-col"><span class="text-amber-800">土</span><span class="text-neutral-500">{{ playerStore.player.spiritRoot.earth }}</span></div>
                </div>
            </div>

            <!-- SKILLS TAB -->
             <div v-if="activeTab === '神通'" class="space-y-4">
                 <div class="flex justify-around mb-4 border-b border-neutral-800 pb-2">
                    <div 
                        v-for="(skill, idx) in equippedSkills" 
                        :key="skill.id"
                        @click="skillStore.unequipSkill(skill.id)"
                        class="w-16 h-16 border border-amber-900/50 bg-black flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-colors relative"
                    >
                        <div class="text-[10px] text-amber-500 text-center leading-tight">{{ skill.name }}</div>
                        <div class="text-[8px] text-neutral-600 mt-1">CD{{ skill.cooldown }}</div>
                        <div class="absolute -top-1 -right-1 text-[8px] text-neutral-700">IV</div>
                    </div>
                    <div 
                        v-for="n in (3 - equippedSkills.length)" 
                        :key="`empty-${n}`"
                        class="w-16 h-16 border border-neutral-800 border-dashed bg-transparent flex items-center justify-center"
                    >
                        <span class="text-neutral-800 text-xl font-thin">+</span>
                    </div>
                 </div>
                 
                 <div class="space-y-1">
                    <div v-if="learnedSkills.length === 0" class="text-center text-neutral-700 py-4">无可用神通</div>
                    <div 
                        v-for="skill in learnedSkills" 
                        :key="skill.id"
                        class="flex justify-between items-center p-2 border-b border-neutral-900 hover:bg-neutral-900/50"
                    >
                        <div>
                            <div class="text-neutral-300">{{ skill.name }}</div>
                            <div class="text-[10px] text-neutral-600">{{ skill.desc }}</div>
                        </div>
                        <button 
                            v-if="!isEquipped(skill.id)"
                            @click="skillStore.equipSkill(skill.id)"
                            :disabled="equippedSkills.length >= 3"
                            class="text-[10px] px-2 py-0.5 border border-neutral-700 hover:border-neutral-500 text-neutral-500"
                        >
                            装备
                        </button>
                        <span v-else class="text-[10px] text-amber-900">已装</span>
                    </div>
                 </div>
             </div>

            <!-- LOGS TAB -->
            <div v-if="activeTab === '日志'" class="pl-2 border-l border-neutral-800 space-y-2">
                <div v-if="recentLogs.length === 0" class="text-neutral-700">...</div>
                <div v-for="(log, i) in recentLogs" :key="i" class="text-neutral-500 leading-snug">
                    <span class="text-neutral-700 mr-2">›</span>{{ log }}
                </div>
            </div>

            <!-- SETTINGS TAB -->
             <div v-if="activeTab === '设置'" class="p-4 flex flex-col items-center gap-4">
                <div class="text-neutral-500 text-xs text-center mb-4">
                    <p>道友若觉道途坎坷，可选择兵解重修。</p>
                    <p class="text-red-900/50 mt-1">注意：此举将清除所有存档数据。</p>
                </div>
                <button 
                    @click="confirmReset"
                    class="w-full max-w-[200px] py-2 border border-red-900/50 bg-red-900/10 text-red-600 hover:bg-red-900/20 hover:text-red-500 transition-colors"
                >
                    [ 兵解重修 ]
                </button>
             </div>

        </div>
    </div>
    
    <!-- BREAKTHROUGH MODAL -->
    <div v-if="showBreakthroughModal" class="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
        <div class="w-full max-w-sm border border-amber-900 bg-neutral-900 p-4 space-y-4 shadow-[0_0_20px_rgba(180,83,9,0.2)]">
            <div class="text-center border-b border-amber-900/30 pb-2">
                <div class="text-lg text-amber-500 font-bold">准备突破</div>
                <div class="text-xs text-neutral-500">境界：{{ playerStore.nextRealm?.name || '未知' }}</div>
            </div>

            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-neutral-400">基础成功率</span>
                    <span class="text-neutral-200">{{ Math.floor(breakthroughBaseProb * 100) }}%</span>
                </div>
                
                <div v-if="breakthroughTargetItem" class="space-y-1 pt-2 border-t border-dashed border-neutral-800">
                    <div class="flex justify-between items-center">
                        <span class="text-amber-700">{{ breakthroughTargetItem.name }} (拥有: {{ breakthroughMaxCount }})</span>
                        <span class="text-xs text-green-600">+{{ Math.floor(breakthroughItemBonus * 100) }}%/个</span>
                    </div>
                    
                    <div class="flex items-center gap-2">
                         <input 
                            type="range" 
                            v-model.number="breakthroughItemCount" 
                            :max="breakthroughMaxCount" 
                            min="0"
                            class="flex-1 accent-amber-600 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                        >
                        <span class="w-8 text-right text-amber-500">{{ breakthroughItemCount }}</span>
                    </div>
                    <div class="text-[10px] text-neutral-500">消耗物品提升成功几率</div>
                </div>
                
                <div v-else class="py-2 text-center text-neutral-600 text-xs italic">
                    无可用辅助丹药
                </div>

                <div class="flex justify-between border-t border-amber-900/30 pt-2 font-bold">
                    <span class="text-neutral-300">最终成功率</span>
                    <span :class="breakthroughTotalProb >= 0.8 ? 'text-green-500' : (breakthroughTotalProb >= 0.5 ? 'text-amber-500' : 'text-red-500')">
                        {{ Math.floor(breakthroughTotalProb * 100) }}%
                    </span>
                </div>
            </div>

            <div class="flex gap-2 text-sm pt-2">
                <button @click="showBreakthroughModal = false" class="flex-1 py-1 border border-neutral-700 text-neutral-400 hover:text-neutral-200">
                    取消
                </button>
                <button @click="confirmBreakthrough" class="flex-1 py-1 bg-amber-900/20 border border-amber-600 text-amber-500 hover:bg-amber-900/40">
                    开始突破
                </button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePlayerStore } from '../stores/player';
import { useSkillStore } from '../stores/skill';
import { getItem } from '../core/constants/items';
import { useModal } from '../composables/useModal';

const playerStore = usePlayerStore();
const skillStore = useSkillStore();
const { showModal } = useModal();

const recentLogs = ref<string[]>(['[系统] 欢迎来到修真世界...']);
const activeTab = ref('属性');

// Breakthrough Dialog State
const showBreakthroughModal = ref(false);
const breakthroughItemCount = ref(0);
const breakthroughMaxCount = ref(0);
const breakthroughBaseProb = ref(0);
const breakthroughItemBonus = ref(0);
const breakthroughTargetItem = ref<any>(null);

const currentRealmName = computed(() => playerStore.currentRealm?.name);
// ... existing computed properties ...
const spiritStones = computed(() => playerStore.player.spiritStones);
const gameDay = computed(() => Math.floor((Date.now() - playerStore.player.createTime) / (1000 * 60 * 60 * 24)) + 1);

const equippedSkills = computed(() => skillStore.equippedSkills);
const learnedSkills = computed(() => skillStore.learnedSkills);

// Calculate Probability dynamically for the modal
const breakthroughTotalProb = computed(() => {
    return Math.min(1.0, breakthroughBaseProb.value + (breakthroughItemCount.value * breakthroughItemBonus.value));
});

// ... existing functions ...
function isEquipped(id: string) {
    return skillStore.equippedSkills.some(s => s.id === id);
}
const currentExp = computed(() => playerStore.player.cultivation.currentExp);
const maxExp = computed(() => playerStore.maxExp);
const progressPercentage = computed(() => playerStore.progressPercentage);
// Use effectiveStats instead of raw stats
const stats = computed(() => playerStore.effectiveStats);
const canBreakthrough = computed(() => currentExp.value >= maxExp.value);

function getEquipName(id?: string) {
    if (!id) return '空';
    return getItem(id)?.name || '未知';
}

function manualCultivate() {
  playerStore.addExp(10); // Manual click gives a bit more
  
  // Restore 1% of HP/MP
  const pStats = playerStore.player.stats;
  
  const oldHp = pStats.hp;
  const oldMp = pStats.mp;

  // 1% or at least 1 point
  const hpRestore = Math.max(1, Math.floor(pStats.maxHp * 0.01));
  const mpRestore = Math.max(1, Math.floor(pStats.maxMp * 0.01));

  pStats.hp = Math.min(pStats.maxHp, pStats.hp + hpRestore);
  pStats.mp = Math.min(pStats.maxMp, pStats.mp + mpRestore);

  let msg = `[修炼] 你静心打坐，获得了 10 点修为。`;
  if (pStats.hp > oldHp || pStats.mp > oldMp) {
      msg += ` (气血+${pStats.hp - oldHp}, 灵力+${pStats.mp - oldMp})`;
  }
  
  recentLogs.value.unshift(msg);
  if (recentLogs.value.length > 20) recentLogs.value.pop();
}

import { useInventoryStore } from '../stores/inventory';

function openBreakthroughDialog() {
  if (!playerStore.currentRealm) return;
  const req = playerStore.currentRealm.breakthroughReq;
  
  breakthroughBaseProb.value = req?.probability ?? 1.0;
  
  // Reset
  breakthroughItemCount.value = 0;
  breakthroughMaxCount.value = 0;
  breakthroughItemBonus.value = 0;
  breakthroughTargetItem.value = null;

  if (req?.itemId) {
      const inventoryStore = useInventoryStore();
      const count = inventoryStore.getItemCount(req.itemId);
      const item = getItem(req.itemId);
      
      breakthroughTargetItem.value = item;
      breakthroughMaxCount.value = count;
      breakthroughItemBonus.value = item?.breakthroughBonus || 0;
      
      // Auto-select max beneficial items (up to 100% or max owned)
      // prob + (count * bonus) >= 1.0
      // count * bonus >= 1.0 - prob
      // count >= (1.0 - prob) / bonus
      if (breakthroughItemBonus.value > 0) {
          const needed = Math.ceil((1.0 - breakthroughBaseProb.value) / breakthroughItemBonus.value);
          breakthroughItemCount.value = Math.min(count, needed);
      }
  }

  showBreakthroughModal.value = true;
}

function confirmBreakthrough() {
  showBreakthroughModal.value = false;
  
  const result = playerStore.attemptBreakthrough(breakthroughItemCount.value);
  recentLogs.value.unshift(`[突破] ${result.message}`);
  
  showModal({
      title: result.success ? '突破成功' : '突破失败',
      content: result.message,
      showCancel: false
  });
}
function confirmReset() {
  showModal({
    title: '兵解重修',
    content: '道友确定要放弃当前修为，重新来过吗？此操作无法撤销。',
    showCancel: true,
    onConfirm: () => {
      playerStore.reset();
    }
  });
}
</script>
