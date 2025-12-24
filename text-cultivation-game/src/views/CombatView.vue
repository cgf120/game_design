<template>
  <div class="h-full flex-1 flex flex-col gap-4">
    <!-- Map Selection (Visible when not fighting) -->
    <div v-if="!currentMap" class="flex flex-1 relative min-h-0 bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-800">
      
      <!-- Left Sidebar: Categories -->
      <div class="h-full w-1/4 min-w-[100px] max-w-[140px] bg-neutral-950/50 border-r border-neutral-800 flex flex-col overflow-y-auto scrollbar-hide">
        <button 
          v-for="category in activeCategories" 
          :key="category"
          @click="selectedCategory = category"
          class="px-3 py-4 text-xs font-bold text-left border-l-2 transition-all relative group"
          :class="selectedCategory === category 
            ? 'bg-neutral-800 text-amber-500 border-amber-500' 
            : 'border-transparent text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'"
        >
          {{ category }}
          <!-- Active Indicator (Right Arrow) -->
          <span v-if="selectedCategory === category" class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-50">></span>
        </button>
      </div>

      <!-- Right Content: Map Grid -->
      <div class="flex-1 h-full overflow-y-auto p-4 bg-neutral-900/20 relative">
        <!-- Category Header -->
        <h3 class="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-amber-600 rounded-full inline-block"></span>
            {{ selectedCategory }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
                v-for="map in currentCategoryMaps" 
                :key="map.id"
                class="bg-neutral-800 p-3 rounded border border-neutral-700 hover:border-amber-500/50 cursor-pointer transition-all hover:translate-x-1 group relative overflow-hidden flex flex-col justify-between min-h-[70px]"
                @click="combat.enterMap(map.id)"
            >
                <div class="flex justify-between items-start mb-1 relative z-10">
                    <span class="text-amber-500 font-bold text-sm group-hover:text-amber-400">{{ map.name }}</span>
                    <!-- Requirement Badge -->
                    <span 
                        class="text-[10px] px-1.5 py-0.5 rounded border scale-90 origin-right transition-colors"
                        :class="isRealmSufficient(map.reqRealmId) 
                            ? 'bg-green-950/30 text-green-600 border-green-900/30' 
                            : 'bg-red-950/30 text-red-600 border-red-900/30'"
                    >
                        {{ getRealmName(map.reqRealmId) }}
                    </span>
                </div>
                
                <div class="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed group-hover:text-neutral-400 relative z-10">
                    {{ map.desc }}
                </div>
            </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="currentCategoryMaps.length === 0" class="flex flex-col items-center justify-center py-20 text-neutral-600 text-sm">
            <span class="mb-2 text-2xl opacity-20">🗺️</span>
            <span>此处暂无历练之地</span>
        </div>
      </div>
    </div>

    <!-- Combat Interface (Visible when in map) -->
    <div v-else class="flex flex-col h-full">
      <!-- Top Bar: Map Info & Escape -->
      <div class="flex justify-between items-center mb-4 bg-neutral-800 p-3 rounded border border-neutral-700">
        <div>
          <span class="text-amber-500 font-bold">{{ currentMap.name }}</span>
          <span v-if="currentEnemy" class="ml-2 text-red-400 text-sm">VS {{ currentEnemy.name }}</span>
          <span v-else class="ml-2 text-neutral-500 text-sm animate-pulse">搜寻对手...</span>
        </div>
        <button 
          @click="combat.leaveMap()"
          class="px-4 py-1 text-xs bg-red-900/20 hover:bg-red-900/40 border border-red-800/50 hover:border-red-500 rounded text-red-300 transition-colors"
        >
          撤退
        </button>
      </div>

      <!-- Enemy Status -->
      <div v-if="currentEnemy" class="mb-4 bg-neutral-800/50 p-3 rounded border border-neutral-700/50">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-red-400 font-bold">{{ currentEnemy.name }} <span class="text-neutral-500 ml-1">Lv.{{ currentEnemy.level }}</span></span>
          <span class="text-neutral-300">{{ Math.floor(currentEnemy.stats.hp) }} / {{ currentEnemy.stats.maxHp }}</span>
        </div>
        <div class="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
          <div 
            class="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-300 ease-out" 
            :style="{ width: `${(currentEnemy.stats.hp / currentEnemy.stats.maxHp) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Combat Logs -->
      <div class="flex-1 bg-black/20 rounded-lg p-3 overflow-y-auto font-mono text-xs space-y-1 border border-neutral-800/50 shadow-inner">
        <div v-for="(log, i) in battleLogs" :key="i" :class="getLogClass(log)">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCombat } from '../composables/useCombat';
import { useSectStore } from '../stores/sect';
import { usePlayerStore } from '../stores/player';
import { MAPS } from '../core/constants/maps';
import { getRealm } from '../core/constants/realms';
import type { GameMap } from '../core/models/combat';

const combat = useCombat();
const sectStore = useSectStore();
const playerStore = usePlayerStore();
const route = useRoute();
const availableMaps = MAPS;

// State for selected tab
const selectedCategory = ref('新手区域');

const groupedMaps = computed(() => {
    const groups: Record<string, GameMap[]> = {};
    const order = ['宗门任务', '新手区域', '神州大地', '幽冥鬼界', '海外仙岛', '天界'];
    
    // Initialize ordered keys
    order.forEach(k => groups[k] = []);
    
    // Active Task Map ID
    const activeTaskMapId = sectStore.playerSectInfo?.activeTask ? 
                            sectStore.currentSect?.tasks.find(t => t.id === sectStore.playerSectInfo?.activeTask?.taskId)?.relatedMapId 
                            : null;

    availableMaps.forEach(map => {
        // Visibility Check 1: Hidden Flag (Task specific)
        if (map.isHidden) {
            // Show only if it matches active task's related map
            if (map.id !== activeTaskMapId) {
                return;
            }
        }

        // Visibility Check 2: Realm Requirement
        // User Request: Don't show if realm not reached.
        const playerRealm = playerStore.player.cultivation.realmId || 0;
        if (playerRealm < map.reqRealmId) {
            return;
        }

        const cat = map.category || '其他';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(map);
    });
    
    // Filter empty
    return Object.fromEntries(Object.entries(groups).filter(([_, v]) => v.length > 0));
});

// Categories for Tabs
const activeCategories = computed(() => Object.keys(groupedMaps.value));

// Current displayed maps
const currentCategoryMaps = computed(() => {
    return groupedMaps.value[selectedCategory.value] || [];
});

// Watch Categories to ensure selection is valid
watch(activeCategories, (newCats) => {
    if (newCats.length > 0 && !newCats.includes(selectedCategory.value)) {
        selectedCategory.value = newCats[0];
    }
}, { immediate: true });

const currentMap = combat.currentMap;
const currentEnemy = combat.currentEnemy;
const battleLogs = combat.battleLogs;

onUnmounted(() => {
  combat.stopAutoFight();
});

onMounted(() => {
    // Auto enter map if query param exists
    const mapId = route.query.map as string;
    if (mapId && !currentMap.value) {
        // Small delay to ensure logic is ready
        setTimeout(() => {
            combat.enterMap(mapId);
        }, 100);
    }
});

function getRealmName(id: number) {
  return getRealm(id)?.name || '未知';
}

function isRealmSufficient(req: number) {
    return (playerStore.player.cultivation.realmId || 0) >= req;
}

function getLogClass(log: string) {
  if (log.includes('[胜利]')) return 'text-yellow-400';
  if (log.includes('[失败]')) return 'text-red-500 font-bold';
  if (log.includes('[遭遇]')) return 'text-blue-300';
  if (log.includes('攻击了你')) return 'text-red-300';
  return 'text-neutral-400';
}
</script>
