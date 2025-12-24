<template>
  <div class="h-full flex flex-col p-4 gap-4 overflow-hidden">
    <!-- Top Section: Meditation & Cultivation (Always Visible) -->
    <div class="flex-none flex flex-row items-center justify-between ink-card rounded-lg p-3">
        <!-- Visual Circle (Small) -->
        <div class="relative w-24 h-24 shrink-0 mr-4">
             <div class="w-full h-full rounded-full border-4 border-neutral-700 flex items-center justify-center relative overflow-hidden bg-neutral-800">
                <div 
                  class="absolute bottom-0 w-full bg-amber-900/50 transition-all duration-300 ease-linear"
                  :style="{ height: `${progressPercentage}%` }"
                ></div>
                <div class="z-10 text-center">
                  <div class="text-sm font-bold text-gold font-serif">{{ currentRealmName }}</div>
                  <div class="text-[10px] text-neutral-400 mt-1 font-mono">{{ (progressPercentage).toFixed(1) }}%</div>
                </div>
             </div>
        </div>

        <!-- Actions & Quick Info -->
        <div class="flex-1 flex flex-col gap-2">
             <div class="text-xs text-secondary flex justify-between">
                <span>修为</span>
                <span class="font-mono text-primary">{{ Math.floor(currentExp) }}/{{ maxExp }}</span>
             </div>
             
             <div class="flex gap-2 mt-1">
                <button 
                  @click="manualCultivate"
                  class="flex-1 py-2 bg-ink border border-neutral-700 hover:border-neutral-500 rounded active:scale-95 transition-all text-xs text-primary"
                >
                  打坐
                </button>
                <button 
                  v-if="canBreakthrough"
                  @click="handleBreakthrough"
                  class="flex-1 py-2 bg-gradient-to-r from-amber-900 to-amber-800 hover:from-amber-800 hover:to-amber-700 border border-gold rounded text-xs text-gold animate-pulse font-bold"
                >
                  突破
                </button>
             </div>
        </div>
    </div>

    <!-- Bottom Section: Tabbed Panel -->
    <div class="flex-1 flex flex-col min-h-0 ink-card rounded-lg overflow-hidden">
        <!-- Tabs Header -->
        <div class="flex border-b border-ink shrink-0 bg-ink-base">
            <button 
                v-for="tab in ['属性', '神通', '日志']" 
                :key="tab"
                @click="activeTab = tab"
                class="flex-1 py-3 text-sm font-bold transition-colors relative font-serif tracking-widest"
                :class="activeTab === tab ? 'text-gold bg-neutral-800/50' : 'text-neutral-500 hover:bg-neutral-800/30'"
            >
                {{ tab }}
                <div v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </button>
        </div>

        <!-- Tab Content Area -->
        <div class="flex-1 overflow-y-auto p-4 scrollbar-hide relative bg-ink-base">
            
            <!-- Tab: Stats -->
            <div v-if="activeTab === '属性'" class="space-y-4">
                <!-- Main Stats -->
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="flex justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <span class="text-secondary">攻击</span>
                        <span class="text-gold font-mono">{{ stats.atk }}</span>
                    </div>
                    <div class="flex justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <span class="text-secondary">防御</span>
                        <span class="text-blue-400 font-mono">{{ stats.def }}</span>
                    </div>
                    <div class="flex justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <span class="text-secondary">气血</span>
                        <span class="font-mono text-primary">{{ Math.floor(stats.hp) }}/{{ stats.maxHp }}</span>
                    </div>
                    <div class="flex justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <span class="text-secondary">灵力</span>
                        <span class="text-sky-400 font-mono">{{ Math.floor(stats.mp) }}/{{ stats.maxMp }}</span>
                    </div>
                    <div class="flex justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <span class="text-secondary">暴击</span>
                        <span class="font-mono text-primary">{{ (stats.critRate * 100).toFixed(1) }}%</span>
                    </div>
                </div>

                <!-- Equipment -->
                <div class="space-y-2">
                    <h3 class="text-xs text-neutral-500 uppercase tracking-widest text-center border-b border-neutral-800 pb-1 mb-2">当前装备</h3>
                    <div class="grid grid-cols-3 gap-2 text-xs">
                        <div class="bg-black/20 p-2 rounded text-center border border-neutral-800 hover:border-gold/30 transition-colors">
                            <div class="text-neutral-500 mb-1">武器</div>
                            <div class="text-gold truncate font-serif">{{ getEquipName(playerStore.player.equipment?.weapon) }}</div>
                        </div>
                        <div class="bg-black/20 p-2 rounded text-center border border-neutral-800 hover:border-blue-500/30 transition-colors">
                            <div class="text-neutral-500 mb-1">护甲</div>
                            <div class="text-blue-400 truncate font-serif">{{ getEquipName(playerStore.player.equipment?.armor) }}</div>
                        </div>
                        <div class="bg-black/20 p-2 rounded text-center border border-neutral-800 hover:border-purple-500/30 transition-colors">
                            <div class="text-neutral-500 mb-1">法宝</div>
                            <div class="text-purple-400 truncate font-serif">{{ getEquipName(playerStore.player.equipment?.accessory) }}</div>
                        </div>
                    </div>
                </div>

                <!-- Spirit Root -->
                <div class="space-y-2">
                    <h3 class="text-xs text-neutral-500 uppercase tracking-widest text-center border-b border-neutral-800 pb-1 mb-2">五行灵根</h3>
                    <div class="flex justify-between text-xs text-center bg-neutral-900/30 p-3 rounded border border-neutral-800">
                        <div class="flex flex-col"><span class="text-yellow-600 mb-1 font-bold font-serif">金</span><span class="font-mono text-neutral-400">{{ playerStore.player.spiritRoot.metal }}</span></div>
                        <div class="flex flex-col"><span class="text-green-600 mb-1 font-bold font-serif">木</span><span class="font-mono text-neutral-400">{{ playerStore.player.spiritRoot.wood }}</span></div>
                        <div class="flex flex-col"><span class="text-blue-500 mb-1 font-bold font-serif">水</span><span class="font-mono text-neutral-400">{{ playerStore.player.spiritRoot.water }}</span></div>
                        <div class="flex flex-col"><span class="text-red-600 mb-1 font-bold font-serif">火</span><span class="font-mono text-neutral-400">{{ playerStore.player.spiritRoot.fire }}</span></div>
                        <div class="flex flex-col"><span class="text-amber-700 mb-1 font-bold font-serif">土</span><span class="font-mono text-neutral-400">{{ playerStore.player.spiritRoot.earth }}</span></div>
                    </div>
                </div>
            </div>

            <!-- Tab: Skills -->
            <div v-if="activeTab === '神通'" class="flex flex-col h-full">
                 <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-neutral-400">配置 ({{ equippedSkills.length }}/3)</span>
                 </div>
                 
                 <!-- Equipped Slots -->
                 <div class="grid grid-cols-3 gap-3 mb-6 shrink-0">
                    <div 
                        v-for="skill in equippedSkills" 
                        :key="skill.id"
                        @click="skillStore.unequipSkill(skill.id)"
                        class="aspect-square bg-gradient-to-b from-neutral-800 to-neutral-900 border border-gold/30 rounded flex flex-col items-center justify-center cursor-pointer relative group hover:border-gold transition-colors"
                    >
                        <div class="text-xs text-gold font-bold mb-1 text-center truncate px-1 w-full font-serif">{{ skill.name }}</div>
                        <div class="text-[10px] text-neutral-500 font-mono">CD {{ skill.cooldown }}s</div>
                        <div class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-jade shadow-[0_0_5px_rgba(76,174,76,0.8)]"></div>
                    </div>
                    <div 
                        v-for="n in (3 - equippedSkills.length)" 
                        :key="`empty-skill-${n}`"
                        class="aspect-square bg-neutral-900/30 border border-neutral-800 border-dashed rounded flex items-center justify-center text-xs text-neutral-600"
                    >
                        <span class="opacity-50">空</span>
                    </div>
                 </div>

                 <!-- Learned List -->
                 <div class="flex-1 min-h-0 flex flex-col">
                    <h3 class="text-xs text-neutral-500 mb-2 uppercase tracking-widest shrink-0 border-b border-neutral-800 pb-1">已修习神通</h3>
                    <div class="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                         <div v-if="learnedSkills.length === 0" class="text-xs text-neutral-600 text-center py-4">
                            暂无神通，请前往宗门藏经阁研习。
                        </div>
                        <div 
                            v-for="skill in learnedSkills" 
                            :key="skill.id"
                            class="bg-neutral-900/40 border border-neutral-800 p-3 rounded flex justify-between items-center hover:bg-neutral-900/60 transition-colors"
                        >
                            <div class="flex-1 mr-2">
                                <div class="text-sm text-neutral-300 font-bold font-serif">{{ skill.name }}</div>
                                <div class="text-[10px] text-neutral-500 leading-tight mt-1">{{ skill.desc }}</div>
                                <div class="text-[10px] text-sky-500 mt-1 font-mono">
                                    灵力 {{ skill.cost }} / CD {{ skill.cooldown }}s
                                </div>
                            </div>
                            <button 
                                v-if="!isEquipped(skill.id)"
                                @click="skillStore.equipSkill(skill.id)"
                                :disabled="equippedSkills.length >= 3"
                                class="px-3 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs rounded hover:bg-neutral-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                装备
                            </button>
                            <span v-else class="text-xs text-gold px-2 border border-gold/20 rounded py-0.5 bg-gold/5">已装备</span>
                        </div>
                    </div>
                 </div>
            </div>

            <!-- Tab: Logs -->
            <div v-if="activeTab === '日志'" class="h-full flex flex-col">
                <div class="flex-1 overflow-y-auto font-mono text-xs text-neutral-400 space-y-2 p-3 bg-neutral-950/30 rounded inner-shadow border border-neutral-800/50 scrollbar-hide">
                    <div v-if="recentLogs.length === 0" class="text-center py-4 opacity-50">暂无日志</div>
                    <div v-for="(log, i) in recentLogs" :key="i" class="border-b border-neutral-800/30 pb-2 last:border-0 leading-relaxed">
                        {{ log }}
                    </div>
                </div>
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

const playerStore = usePlayerStore();
const skillStore = useSkillStore();
const recentLogs = ref<string[]>(['[系统] 欢迎来到修真世界...']);
const activeTab = ref('属性');

const currentRealmName = computed(() => playerStore.currentRealm?.name);
// ... existing computed ...

const equippedSkills = computed(() => skillStore.equippedSkills);
const learnedSkills = computed(() => skillStore.learnedSkills);

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

function handleBreakthrough() {
  const result = playerStore.attemptBreakthrough();
  if (result.success) {
    recentLogs.value.unshift(`[突破] ${result.message}`);
  } else {
    recentLogs.value.unshift(`[突破] ${result.message}`);
  }
}
</script>
