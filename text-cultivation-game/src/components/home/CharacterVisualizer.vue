<template>
  <div class="relative flex-1 min-h-[300px] flex flex-col items-center justify-center overflow-hidden py-4">
    <!-- Background Atmosphere -->
    <div class="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-neutral-900/10 to-neutral-900/50 pointer-events-none"></div>
    
    <!-- Rotating Mandala Behind -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none">
       <XianxiaIcon src="ui_bg_mandala" fallback="" size="full" class="animate-spin-slow w-full h-full" />
    </div>

    <!-- Main Character Figure (Clickable for Manual Cultivate) -->
    <div 
        class="relative z-10 w-64 h-64 flex items-center justify-center cursor-pointer group active:scale-95 transition-transform duration-100"
        @click="$emit('cultivate')"
    >
        <!-- Aura Glow -->
        <div class="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <!-- Character Image (Using Orb as proxy until Character art available) -->
         <XianxiaIcon 
            src="ui_orb_meditate" 
            fallback="🧘" 
            size="2xl" 
            :glow="true"
            class="filter drop-shadow-[0_0_15px_rgba(217,119,6,0.3)] w-full h-full object-contain" 
        />
        
        <!-- Floating Particles (CSS) -->
        <div class="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden pointer-events-none">
             <!-- Simplified particles could go here -->
        </div>
    </div>

    <!-- Progress & Efficiency -->
    <div class="relative z-20 mt-4 w-3/4 max-w-[240px] flex flex-col gap-1">
        <!-- Progress Bar -->
        <div class="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden border border-white/5">
            <div 
                class="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300 transition-all duration-300"
                :style="{ width: `${Math.min(progress, 100)}%` }"
            ></div>
        </div>
        
        <!-- Text Info -->
        <div class="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
             <span>{{ efficiencyText }}</span>
             <span>{{ progress.toFixed(2) }}%</span>
             <!-- Info Icon for precise stats -->
             <span class="cursor-help opacity-50 hover:opacity-100">ℹ️</span>
        </div>
    </div>

    <!-- Action Buttons (Breakthrough overlay or bottom actions) -->
    <!-- Action Buttons (Breakthrough overlay or bottom actions) -->
    <div v-if="canBreakthrough" class="mt-6 z-30 animate-pulse">
        <button 
            @click="$emit('breakthrough')"
            class="relative px-4 py-1.5 bg-gradient-to-r from-amber-800 to-red-800 text-amber-100 font-bold text-xs tracking-widest border border-amber-500/30 rounded shadow-[0_0_10px_rgba(255,69,0,0.3)] active:scale-95 transition-all hover:brightness-110"
        >
            [ 境界突破 ]
        </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import XianxiaIcon from '../shared/XianxiaIcon.vue';

defineProps<{
    progress: number;
    efficiencyText: string;
    canBreakthrough: boolean;
}>();

defineEmits(['cultivate', 'breakthrough']);
</script>

<style scoped>
.animate-spin-slow {
    animation: spin 60s linear infinite;
}
.animate-bounce-slow {
    animation: bounce 3s infinite;
}
@keyframes spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}
/* Re-define bounce to be subtle */
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}
</style>
