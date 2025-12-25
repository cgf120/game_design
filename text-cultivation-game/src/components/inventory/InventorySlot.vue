<template>
  <div 
    class="relative aspect-square cursor-pointer group select-none"
    @click="$emit('click')"
  >
    <!-- Rarity Border/Background -->
    <!-- Using a dynamic class or style based on rarity. 
         For now, default ink/border style, but preparing for rarity. 
    -->
    <div 
        class="absolute inset-0 bg-neutral-900 border transition-all duration-200"
        :class="[
            selected ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'border-neutral-800 hover:border-neutral-600',
            rarityClass
        ]"
    ></div>

    <!-- Inner content -->
    <div class="absolute inset-1 bg-black/50 flex flex-col items-center justify-center p-1">
        <XianxiaIcon 
            v-if="item"
            :src="getIcon(item)" 
            fallback="📦" 
            size="md" 
            class="filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200"
        />
        
        <!-- Empty Slot Placeholder -->
        <span v-else class="text-neutral-800 text-2xl font-thin">+</span>
    </div>

    <!-- Count -->
    <div v-if="count > 1" class="absolute bottom-1 right-1 z-10 text-[10px] text-neutral-400 font-mono bg-black/70 px-1 rounded-sm">
        {{ count }}
    </div>

    <!-- Name Label -->
    <div v-if="item" class="absolute bottom-0 left-0 right-0 py-0.5 bg-neutral-950/80 text-center">
        <span class="text-[9px] text-neutral-300 transform scale-90 inline-block font-sans whitespace-nowrap overflow-hidden text-ellipsis px-1 max-w-full">
            {{ item.name }}
        </span>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InventorySlot } from '../../core/models/item';
import { getItem } from '../../core/constants/items';
import XianxiaIcon from '../shared/XianxiaIcon.vue';

const props = defineProps<{
    slotData?: InventorySlot | null; // Can be null for empty visual slot
    selected?: boolean;
}>();

defineEmits(['click']);

const item = computed(() => {
    if (!props.slotData) return null;
    return getItem(props.slotData.itemId);
});

const count = computed(() => props.slotData?.count || 0);

const rarityClass = computed(() => {
    if (!item.value) return '';
    // Mock rarity mapping
    // switch(item.value.rarity) ...
    // For now return neutral or empty
    return ''; 
});

function getIcon(itemDef: any) {
    if (!itemDef) return 'icon_bag';
    if (itemDef.icon) return itemDef.icon;

    // Handle Equipment
    if (itemDef.type === 'equipment' && itemDef.slot) {
        return `icon_type_${itemDef.slot}`;
    }

    // Handle Others
    if (['consumable', 'material'].includes(itemDef.type)) {
        return `icon_type_${itemDef.type}`;
    }

    return 'icon_bag';
}
</script>
