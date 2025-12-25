<template>
  <div class="flex-none px-1 pb-4 pt-2 bg-gradient-to-t from-black to-transparent relative z-10">
    <!-- Grid Layout -->
    <!-- Extremely compact grid for mobile -->
    <div class="grid grid-cols-4 gap-1 px-1">
        <div 
            v-for="item in items" 
            :key="item.id"
            @click="$emit('select', item.id)"
            class="aspect-square flex flex-col items-center justify-center gap-0.5 cursor-pointer group"
        >
            <!-- Icon Container -->
            <!-- Reduced size to 10 (40px) -->
            <div class="relative w-10 h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                 <!-- Diamond Background -->
                 <div class="absolute inset-1.5 bg-neutral-900 border border-neutral-700 rotate-45 group-hover:border-amber-700/50 group-hover:bg-neutral-800 transition-colors shadow-lg"></div>
                 
                 <!-- Icon -->
                 <XianxiaIcon 
                    :src="item.icon" 
                    :fallback="item.fallback" 
                    size="sm" 
                    class="relative z-10 filter drop-shadow-md"
                    :class="{'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100': !item.active}"
                />
            </div>
            
            <!-- Label -->
            <span 
                class="text-[9px] font-bold tracking-wider text-neutral-500 group-hover:text-amber-500 transition-colors"
            >
                {{ item.label }}
            </span>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import XianxiaIcon from '../shared/XianxiaIcon.vue';

export interface GridItem {
    id: string;
    label: string;
    icon: string;
    fallback: string;
    active?: boolean; // Highlight or notification dot
}

defineProps<{
    items: GridItem[];
}>();

defineEmits(['select']);
</script>

<style scoped>
.text-shadow-sm {
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}
</style>
