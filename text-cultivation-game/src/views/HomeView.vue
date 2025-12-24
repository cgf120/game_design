<template>
  <div class="space-y-6">
    <!-- Meditation Circle -->
    <div class="flex flex-col items-center justify-center py-8">
      <div class="w-48 h-48 rounded-full border-4 border-neutral-700 flex items-center justify-center relative overflow-hidden bg-neutral-800">
        <div 
          class="absolute bottom-0 w-full bg-amber-900/30 transition-all duration-300 ease-linear"
          :style="{ height: `${progressPercentage}%` }"
        ></div>
        <div class="z-10 text-center">
          <div class="text-2xl font-bold text-amber-500">{{ currentRealmName }}</div>
          <div class="text-xs text-neutral-400 mt-1">修为: {{ Math.floor(currentExp) }} / {{ maxExp }}</div>
        </div>
      </div>
      
      <div class="mt-8 flex gap-4">
        <button 
          @click="manualCultivate"
          class="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 rounded border border-neutral-600 active:transform active:scale-95 transition-all"
        >
          打坐修炼
        </button>
        
        <button 
          v-if="canBreakthrough"
          @click="handleBreakthrough"
          class="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded border border-amber-600 text-white animate-pulse"
        >
          突破境界
        </button>
      </div>
    </div>

    <!-- Stats Panel -->
    <div class="bg-neutral-800 rounded p-4 border border-neutral-700">
      <h3 class="text-neutral-400 text-xs mb-3 uppercase tracking-wider">当前属性</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="flex justify-between">
          <span class="text-neutral-500">攻击</span>
          <span class="text-amber-500">{{ stats.atk }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-500">防御</span>
          <span class="text-blue-400">{{ stats.def }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-500">气血</span>
          <span>{{ Math.floor(stats.hp) }} / {{ stats.maxHp }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-500">灵力</span>
          <span class="text-sky-400">{{ Math.floor(stats.mp) }} / {{ stats.maxMp }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-500">暴击</span>
          <span>{{ (stats.critRate * 100).toFixed(1) }}%</span>
        </div>
      </div>
      
      <!-- Equipment Summary -->
      <div class="mt-4 pt-4 border-t border-neutral-700/50 grid grid-cols-3 gap-2 text-xs text-center">
         <div class="bg-black/20 p-1 rounded">
            <div class="text-neutral-500">武器</div>
            <div class="text-amber-500 truncate">{{ getEquipName(playerStore.player.equipment?.weapon) }}</div>
         </div>
         <div class="bg-black/20 p-1 rounded">
            <div class="text-neutral-500">护甲</div>
            <div class="text-blue-400 truncate">{{ getEquipName(playerStore.player.equipment?.armor) }}</div>
         </div>
         <div class="bg-black/20 p-1 rounded">
            <div class="text-neutral-500">法宝</div>
            <div class="text-purple-400 truncate">{{ getEquipName(playerStore.player.equipment?.accessory) }}</div>
         </div>
      </div>
    </div>

    <!-- Skills Panel -->
    <div class="bg-neutral-800 rounded p-4 border border-neutral-700">
        <h3 class="text-neutral-400 text-xs mb-3 uppercase tracking-wider flex justify-between">
            <span>神通配置</span>
            <span>{{ equippedSkills.length }} / 3</span>
        </h3>
        
        <!-- Equipped -->
        <div class="flex gap-2 mb-4">
            <div 
                v-for="skill in equippedSkills" 
                :key="skill.id"
                @click="skillStore.unequipSkill(skill.id)"
                class="flex-1 bg-neutral-900 border border-amber-500/50 p-2 rounded cursor-pointer relative group"
            >
                <div class="text-xs text-amber-500 font-bold truncate">{{ skill.name }}</div>
                <div class="text-[10px] text-neutral-500 mt-1">CD: {{ skill.cooldown }}s</div>
                <div class="absolute inset-0 bg-red-900/80 items-center justify-center hidden group-hover:flex text-xs text-white rounded">卸下</div>
            </div>
            <!-- Empty Slots -->
            <div 
                v-for="n in (3 - equippedSkills.length)" 
                :key="`empty-skill-${n}`"
                class="flex-1 bg-neutral-900/50 border border-neutral-800 p-2 rounded flex items-center justify-center text-xs text-neutral-600"
            >
                空槽位
            </div>
        </div>

        <!-- Learned List -->
        <h3 class="text-neutral-400 text-xs mb-2 uppercase tracking-wider">已修习</h3>
        <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-if="learnedSkills.length === 0" class="text-xs text-neutral-600 text-center py-2">
                暂无神通，请前往宗门藏经阁研习。
            </div>
            <div 
                v-for="skill in learnedSkills" 
                :key="skill.id"
                class="bg-neutral-900 border border-neutral-800 p-2 rounded flex justify-between items-center"
            >
                <div>
                     <div class="text-xs text-neutral-300 font-bold">{{ skill.name }}</div>
                     <div class="text-[10px] text-neutral-500">{{ skill.desc }}</div>
                     <div class="text-[10px] text-sky-500 mt-0.5">消耗: {{ skill.cost }} 灵力</div>
                </div>
                <button 
                    v-if="!isEquipped(skill.id)"
                    @click="skillStore.equipSkill(skill.id)"
                    class="px-2 py-1 bg-neutral-700 text-neutral-300 text-[10px] rounded hover:bg-neutral-600"
                >
                    装备
                </button>
                <span v-else class="text-[10px] text-amber-600">已装备</span>
            </div>
        </div>
    </div>

    <!-- Spirit Root Panel -->
    <div class="bg-neutral-800 rounded p-4 border border-neutral-700">
      <h3 class="text-neutral-400 text-xs mb-3 uppercase tracking-wider">五行灵根</h3>
      <div class="flex justify-between text-xs text-center">
        <div class="flex flex-col"><span class="text-yellow-500">金</span><span>{{ playerStore.player.spiritRoot.metal }}</span></div>
        <div class="flex flex-col"><span class="text-green-500">木</span><span>{{ playerStore.player.spiritRoot.wood }}</span></div>
        <div class="flex flex-col"><span class="text-blue-400">水</span><span>{{ playerStore.player.spiritRoot.water }}</span></div>
        <div class="flex flex-col"><span class="text-red-500">火</span><span>{{ playerStore.player.spiritRoot.fire }}</span></div>
        <div class="flex flex-col"><span class="text-amber-700">土</span><span>{{ playerStore.player.spiritRoot.earth }}</span></div>
      </div>
    </div>

    <!-- Log Panel (Placeholder) -->
    <div class="bg-neutral-800 rounded p-4 border border-neutral-700 h-32 overflow-y-auto text-xs text-neutral-400 font-mono">
      <div v-for="(log, i) in recentLogs" :key="i" class="mb-1">
        {{ log }}
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
  const success = playerStore.attemptBreakthrough();
  if (success) {
    recentLogs.value.unshift(`[突破] 恭喜道友！成功突破至 ${playerStore.currentRealm?.name}！`);
  } else {
    recentLogs.value.unshift(`[突破] 积累不足，突破失败！`);
  }
}
</script>
