<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Map Selection (Visible when not fighting) -->
    <div v-if="!currentMap" class="grid grid-cols-1 gap-4">
      <div 
        v-for="map in availableMaps" 
        :key="map.id"
        class="bg-neutral-800 p-4 rounded border border-neutral-700 hover:border-amber-600 cursor-pointer transition-colors"
        @click="combat.enterMap(map.id)"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="text-amber-500 font-bold">{{ map.name }}</span>
          <span class="text-xs text-neutral-500">建议: {{ getRealmName(map.reqRealmId) }}</span>
        </div>
        <div class="text-xs text-neutral-400">{{ map.desc }}</div>
      </div>
    </div>

    <!-- Combat Interface (Visible when in map) -->
    <div v-else class="flex flex-col h-full">
      <!-- Top Bar: Map Info & Escape -->
      <div class="flex justify-between items-center mb-4 bg-neutral-800 p-3 rounded">
        <div>
          <span class="text-amber-500 font-bold">{{ currentMap.name }}</span>
          <span v-if="currentEnemy" class="ml-2 text-red-400 text-sm">VS {{ currentEnemy.name }}</span>
          <span v-else class="ml-2 text-neutral-500 text-sm">搜寻对手...</span>
        </div>
        <button 
          @click="combat.leaveMap()"
          class="px-3 py-1 text-xs bg-red-900/50 hover:bg-red-900 border border-red-800 rounded text-red-200"
        >
          撤退
        </button>
      </div>

      <!-- Enemy Status -->
      <div v-if="currentEnemy" class="mb-4">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-red-400 font-bold">{{ currentEnemy.name }} (Lv.{{ currentEnemy.level }})</span>
          <span>{{ currentEnemy.stats.hp }} / {{ currentEnemy.stats.maxHp }}</span>
        </div>
        <div class="w-full bg-neutral-900 h-2 rounded overflow-hidden">
          <div 
            class="bg-red-600 h-full transition-all duration-300" 
            :style="{ width: `${(currentEnemy.stats.hp / currentEnemy.stats.maxHp) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Combat Logs -->
      <div class="flex-1 bg-black/20 rounded p-4 overflow-y-auto font-mono text-xs space-y-1">
        <div v-for="(log, i) in combatLogs" :key="i" :class="getLogClass(log)">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useCombat } from '../composables/useCombat';
import { MAPS } from '../core/constants/maps';
import { getRealm } from '../core/constants/realms';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const combat = useCombat();
const route = useRoute();
const availableMaps = MAPS;
const currentMap = combat.currentMap;
const currentEnemy = combat.currentEnemy;
const combatLogs = combat.combatLogs;

onUnmounted(() => {
  combat.stopAutoFight();
});

onMounted(() => {
    // Auto enter map if query param exists
    const mapId = route.query.map as string;
    if (mapId && !currentMap.value) {
        // Small delay to ensure logic is ready?
        setTimeout(() => {
            combat.enterMap(mapId);
        }, 100);
    }
});

function getRealmName(id: number) {
  return getRealm(id)?.name || '未知';
}

function getLogClass(log: string) {
  if (log.includes('[胜利]')) return 'text-yellow-400';
  if (log.includes('[失败]')) return 'text-red-500 font-bold';
  if (log.includes('[遭遇]')) return 'text-blue-300';
  if (log.includes('攻击了你')) return 'text-red-300';
  return 'text-neutral-400';
}
</script>
