<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-200 font-mono flex flex-col">
    <!-- Top Status Bar -->
    <header class="bg-neutral-800 border-b border-neutral-700 p-2 text-xs flex justify-between items-center sticky top-0 z-10">
      <div class="flex gap-4">
        <span class="text-amber-500 font-bold">境界: {{ currentRealmName }}</span>
        <span class="text-emerald-400">灵石: {{ spiritStones }}</span>
      </div>
      <div>
        <span class="text-neutral-500">Day {{ gameDay }}</span>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto p-4 pb-20">
      <slot></slot>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bg-neutral-800 border-t border-neutral-700 fixed bottom-0 w-full flex justify-around p-2 z-10">
      <router-link to="/" class="nav-item">
        <span>修炼</span>
      </router-link>
      <router-link to="/combat" class="nav-item">
        <span>历练</span>
      </router-link>
      <router-link to="/inventory" class="nav-item">
        <span>行囊</span>
      </router-link>
      <router-link to="/sect" class="nav-item">
        <span>宗门</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePlayerStore } from '../../stores/player';

const playerStore = usePlayerStore();

const currentRealmName = computed(() => playerStore.currentRealm?.name || '凡人');
const spiritStones = computed(() => playerStore.player.spiritStones);
const gameDay = computed(() => Math.floor((Date.now() - playerStore.player.createTime) / (1000 * 60 * 60 * 24)) + 1);

</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center justify-center p-2 rounded hover:bg-neutral-700 transition-colors text-sm;
}
.router-link-active {
  @apply text-amber-500 bg-neutral-700;
}
</style>
