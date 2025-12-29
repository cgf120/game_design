<template>
  <div class="h-screen overflow-hidden bg-ink text-primary font-serif flex flex-col">
    <!-- Top Status Bar (Hidden on Home) -->
    <!-- Top Status Bar (Hidden on Home) -->
    <header v-if="route.path !== '/'" class="border-b border-ink p-2 text-xs flex justify-between items-center sticky top-0 z-10 bg-ink-base backdrop-blur-sm">
      <div class="flex gap-4">
        <div class="flex items-center gap-1 text-gold font-bold">
            <XianxiaIcon src="ui_stat_realm" fallback="道" size="xs" :glow="true" />
            <span>{{ currentRealmName }}</span>
        </div>
        <div class="flex items-center gap-1 text-jade">
            <XianxiaIcon src="ui_stat_spiritstone" fallback="💎" size="xs" />
            <span>{{ spiritStones }}</span>
        </div>
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
    <nav class="border-t border-ink w-full flex justify-around p-2 z-10 shrink-0 bg-ink-base pb-safe">
      <router-link to="/" class="nav-item group">
        <XianxiaIcon src="ui_nav_cultivate" fallback="🧘" size="md" :glow="route.path === '/'" />
        <span class="text-[10px] mt-1 group-hover:text-gold transition-colors">修炼</span>
      </router-link>
      <router-link to="/combat" class="nav-item group">
        <XianxiaIcon src="ui_nav_combat" fallback="⚔️" size="md" :glow="route.path === '/combat'" />
        <span class="text-[10px] mt-1 group-hover:text-gold transition-colors">历练</span>
      </router-link>
      <router-link to="/inventory" class="nav-item group">
        <XianxiaIcon src="ui_nav_inventory" fallback="🎒" size="md" :glow="route.path === '/inventory'" />
        <span class="text-[10px] mt-1 group-hover:text-gold transition-colors">行囊</span>
      </router-link>
      <router-link to="/abode" class="nav-item group">
        <XianxiaIcon src="ui_nav_abode" fallback="🏯" size="md" :glow="route.path === '/abode'" />
        <span class="text-[10px] mt-1 group-hover:text-gold transition-colors">洞府</span>
      </router-link>
      <router-link to="/sect" class="nav-item group">
        <XianxiaIcon src="ui_nav_sect" fallback="⛩️" size="md" :glow="route.path === '/sect'" />
        <span class="text-[10px] mt-1 group-hover:text-gold transition-colors">宗门</span>
      </router-link>
      <router-link to="/settings" class="nav-item group">
        <XianxiaIcon src="ui_nav_abode" fallback="⚙️" size="md" :glow="route.path === '/settings'" />
        <span class="text-[10px] mt-1 group-hover:text-gold transition-colors">设置</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePlayerStore } from '../../stores/player';
import XianxiaIcon from '../shared/XianxiaIcon.vue';

const route = useRoute();
const playerStore = usePlayerStore();

const currentRealmName = computed(() => playerStore.currentRealm?.name || '凡人');
const spiritStones = computed(() => playerStore.player.spiritStones);
const gameDay = computed(() => Math.floor((Date.now() - playerStore.player.createTime) / (1000 * 60 * 60 * 24)) + 1);

</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center justify-center p-1 rounded transition-colors text-secondary flex-1;
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
