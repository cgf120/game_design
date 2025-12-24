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
          <span>{{ stats.hp }} / {{ stats.maxHp }}</span>
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
import { getItem } from '../core/constants/items';

const playerStore = usePlayerStore();
const recentLogs = ref<string[]>(['[系统] 欢迎来到修真世界...']);

const currentRealmName = computed(() => playerStore.currentRealm?.name);
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
  recentLogs.value.unshift(`[修炼] 你静心打坐，获得了 10 点修为。`);
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
