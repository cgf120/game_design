<template>
  <div 
    class="relative aspect-square cursor-pointer group select-none bg-black overflow-hidden"
    @click="$emit('click')"
  >
    <!-- 1. Background Image (Custom UI) -->
    <img 
        :src="getBgPath()"
        class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        alt="bg"
    />
    
    <!-- Quality Color Overlay (Subtle tint based on quality) -->
    <div 
        class="absolute inset-0 mix-blend-overlay opacity-50"
        :class="qualityInfo?.bg || 'bg-neutral-900'"
    ></div>

    <!-- 2. Frame Overlay (Background/Border) -->
    <img 
        v-if="qualityInfo?.frame"
        :src="getFramePath(qualityInfo.frame)"
        class="absolute inset-0 w-full h-full z-10 pointer-events-none"
        :style="qualityInfo?.frameStyle"
        alt="frame"
    />
    <div v-else class="absolute inset-0 border border-neutral-800 z-10 pointer-events-none"></div>

    <!-- 3. Inner Content (Icon) -->
    <div class="absolute inset-0 flex flex-col items-center justify-center p-1 z-20">
        <XianxiaIcon 
            v-if="item"
            :src="getIcon(item)" 
            fallback="📦" 
            size="md" 
            class="filter drop-shadow-md group-hover:scale-110 transition-transform duration-200"
        />
        
        <!-- Empty Slot Placeholder -->
        <span v-else class="text-neutral-800 text-2xl font-thin">+</span>
    </div>

    <!-- 4. Count -->
    <div v-if="count > 1" class="absolute top-1 right-1 z-30 text-[10px] text-neutral-300 font-mono bg-black/60 px-1 rounded-sm backdrop-blur-sm border border-white/10">
        {{ count }}
    </div>

    <!-- 5. Name Label -->
    <div v-if="item" class="absolute bottom-1 left-1 right-1 py-0.5 text-center z-30 pointer-events-none">
        <div class="bg-black/30 backdrop-blur-sm rounded-sm border border-white/5">
             <span 
                class="text-[9px] transform scale-90 inline-block font-sans whitespace-nowrap overflow-hidden text-ellipsis px-1 max-w-full"
                :class="qualityInfo?.color || 'text-neutral-300'"
            >
                {{ item.name }}
            </span>
        </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InventorySlot } from '../../core/models/item';
import { getItem } from '../../core/constants/items';
import XianxiaIcon from '../shared/XianxiaIcon.vue';

import { getItemQuality } from '../../core/utils/item';

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

const qualityInfo = computed(() => {
    if (!props.slotData) return null;
    return getItemQuality(props.slotData);
});



function getIcon(itemDef: any) {
    if (!itemDef) return 'icon_bag';
    if (itemDef.icon) return itemDef.icon;

    // Handle Equipment
    if (itemDef.type === 'equipment' && itemDef.slot) {
        if (['helm', 'boots'].includes(itemDef.slot)) return 'icon_type_armor';
        if (['necklace', 'belt'].includes(itemDef.slot)) return 'icon_type_accessory';
        return `icon_type_${itemDef.slot}`;
    }

    // Handle Others
    if (['consumable', 'material'].includes(itemDef.type)) {
        return `icon_type_${itemDef.type}`;
    }

    return 'icon_bag';
}


function getFramePath(frameName: string) {
    if (!frameName) return '';
    return new URL(`../../assets/ui/${frameName}.png`, import.meta.url).href;
}

const bgPath = new URL('../../assets/ui/ui_slot_bg.png', import.meta.url).href;
function getBgPath() {
    return bgPath;
}
</script>
