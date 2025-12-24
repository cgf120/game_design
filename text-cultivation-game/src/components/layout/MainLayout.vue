<template>
  <div class="h-screen overflow-hidden bg-ink text-primary font-serif flex flex-col">
    <!-- Top Status Bar -->
    <header class="border-b border-ink p-2 text-xs flex justify-between items-center sticky top-0 z-10 bg-ink-base backdrop-blur-sm">
      <div class="flex gap-4">
        <span class="text-gold font-bold">境界: {{ currentRealmName }}</span>
        <span class="text-jade">灵石: {{ spiritStones }}</span>
      </div>
      <div>
        <span class="text-secondary">道历 {{ gameDay }} 年</span>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 relative min-h-0 overflow-hidden flex flex-col">
      <slot></slot>
    </main>

    <!-- Bottom Navigation (Static flow) -->
    <nav class="border-t border-ink w-full flex justify-around p-2 z-10 shrink-0 bg-ink-base">
      <router-link to="/" class="nav-item">
        <span class="text-lg">🧘</span>
        <span class="text-xs mt-1">修炼</span>
      </router-link>
      <router-link to="/combat" class="nav-item">
        <span class="text-lg">⚔️</span>
        <span class="text-xs mt-1">历练</span>
      </router-link>
      <router-link to="/inventory" class="nav-item">
        <span class="text-lg">🎒</span>
        <span class="text-xs mt-1">行囊</span>
      </router-link>
      <router-link to="/abode" class="nav-item">
        <span class="text-lg">🏯</span>
        <span class="text-xs mt-1">洞府</span>
      </router-link>
      <router-link to="/sect" class="nav-item">
        <span class="text-lg">⛩️</span>
        <span class="text-xs mt-1">宗门</span>
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
  @apply flex flex-col items-center justify-center p-2 rounded transition-colors text-secondary;
}

.nav-item:hover {
    background-color: rgba(255,255,255,0.05);
}

.router-link-active {
  @apply text-gold;
  background-color: rgba(212, 175, 55, 0.1); /* Subtle Gold BG */
}

/* Use vars for standard colors in Tailwind context via style attribute or utility class expansion in global css if needed. 
   For now relying on global classes defined in style.css or basic tailwind colors overridden. 
   Actually, 'bg-ink' etc are custom classes I defined in style.css.
*/
.bg-ink { background-color: var(--c-void); } /* Main bg */
.bg-ink-base { background-color: var(--c-ink-base); } /* Headers/Nav */
.border-ink { border-color: var(--b-color); }
.text-primary { color: var(--c-text-primary); }
.text-secondary { color: var(--c-text-secondary); }
.text-gold { color: var(--c-gold); }
.text-jade { color: var(--c-jade); }
</style>
