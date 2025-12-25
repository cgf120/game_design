<template>
  <div class="flex overflow-x-auto scrollbar-hide border-b border-neutral-800 bg-neutral-900/50">
    <button 
        v-for="cat in categories" 
        :key="cat.key"
        @click="$emit('select', cat.key)"
        class="flex-1 min-w-[60px] py-3 text-xs text-center relative transition-colors"
        :class="activeCategory === cat.key ? 'text-amber-500 font-bold' : 'text-neutral-500 hover:text-neutral-300'"
    >
        {{ cat.label }}
        
        <!-- Active Indicator -->
        <div 
            v-if="activeCategory === cat.key" 
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"
        ></div>
    </button>
  </div>
</template>

<script setup lang="ts">
const categories = [
    { key: 'all', label: '全部' },
    { key: 'equipment', label: '装备' },
    { key: 'consumable', label: '丹药' },
    { key: 'material', label: '材料' },
    // { key: 'quest', label: '任务' },
];

defineProps<{
    activeCategory: string;
}>();

defineEmits(['select']);
</script>
