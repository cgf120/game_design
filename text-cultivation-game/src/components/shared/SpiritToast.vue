<template>
  <div 
    class="relative min-w-[300px] max-w-md pointer-events-auto select-none overflow-hidden"
    :class="{ 'animate-toast-in': isEnter }"
  >
    <!-- Background Layer -->
    <div class="absolute inset-0 z-0">
      <!-- Main Ink Background -->
      <img :src="bgUrl" class="w-full h-full object-cover opacity-95" alt="bg" />
      
      <!-- Gradient Overlay for Readability -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      
      <!-- Border Overlay -->
      <div class="absolute inset-0 border border-white/10 mx-1 my-1"></div>
      <div class="absolute inset-0 border-t border-b border-amber-500/20 my-0.5"></div>
    </div>

    <!-- Content Layer -->
    <div class="relative z-10 flex items-center gap-4 px-6 py-4">
      <!-- Icon/Status Indicator -->
      <div class="flex-shrink-0 relative">
         <div 
          class="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-black/50"
          :class="statusBorderClass"
         >
           <span class="text-xl filter drop-shadow">{{ icon }}</span>
         </div>
         <!-- Glow Effect -->
         <div class="absolute inset-0 rounded-full opacity-50 blur-md" :class="statusGlowClass"></div>
      </div>

      <!-- Text Content -->
      <div class="flex-1 flex flex-col justify-center">
        <div class="text-xs font-serif tracking-widest opacity-80" :class="statusTitleClass">
          {{ type === 'success' ? '天道垂青' : (type === 'error' ? '道途受阻' : '修真日志') }}
        </div>
        <div class="text-neutral-200 font-medium tracking-wide text-shadow leading-tight">
          {{ message }}
        </div>
      </div>

      <!-- Decorative Right Element (CSS Cloud) -->
      <div class="text-2xl opacity-20 text-amber-500 font-serif rotate-12">
        ☁️
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { ToastType } from '../../composables/useToast';
import bgUrl from '@/assets/ui/ui_toast_bg.png';

const props = defineProps<{
  message: string;
  type: ToastType;
}>();

const isEnter = ref(false);

onMounted(() => {
  setTimeout(() => isEnter.value = true, 50);
});

const statusBorderClass = computed(() => {
  switch (props.type) {
    case 'success': return 'border-green-500/80 text-green-400';
    case 'error': return 'border-red-500/80 text-red-500';
    case 'warning': return 'border-amber-500/80 text-amber-500';
    default: return 'border-sky-500/80 text-sky-400';
  }
});

const statusGlowClass = computed(() => {
   switch (props.type) {
    case 'success': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    case 'warning': return 'bg-amber-500';
    default: return 'bg-sky-500';
  }
});

const statusTitleClass = computed(() => {
   switch (props.type) {
    case 'success': return 'text-green-400';
    case 'error': return 'text-red-400';
    case 'warning': return 'text-amber-400';
    default: return 'text-sky-400';
  }
});

const icon = computed(() => {
   switch (props.type) {
    case 'success': return '⭕'; // Or '突破' logic if specific context
    case 'error': return '❌';
    case 'warning': return '⚠️';
    default: return '📜';
  }
});
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}
</style>
