<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Header -->
    <h3 class="text-amber-500 font-bold flex items-center gap-2 border-b border-amber-900/30 pb-2">
        <XianxiaIcon src="icon_bag" fallback="🔨" size="sm" />
        <span>打造 / 镶嵌</span>
    </h3>

    <!-- Main Forge Area -->
    <div class="flex-1 flex flex-col items-center justify-start gap-6 py-4" :key="uiKey">
        
        <!-- Slot Selector -->
        <div class="flex gap-4">
            <div 
                v-for="slot in slots" 
                :key="slot.key"
                class="flex flex-col items-center gap-2 cursor-pointer group"
                @click="selectedSlot = slot.key"
            >
                <div 
                    class="w-16 h-16 border bg-black rounded relative flex items-center justify-center transition-all duration-300"
                    :class="selectedSlot === slot.key ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-neutral-800 hover:border-neutral-600'"
                >
                     <XianxiaIcon 
                        v-if="getEquip(slot.key)"
                        :src="getIcon(getEquip(slot.key)!)" 
                        size="custom"
                        customClass="w-full h-full p-2"
                    />
                    <span v-else class="text-neutral-700 text-xs">空</span>
                </div>
                <span class="text-xs" :class="selectedSlot === slot.key ? 'text-amber-500' : 'text-neutral-500'">{{ slot.name }}</span>
            </div>
        </div>

        <!-- Selected Item Details -->
        <div v-if="selectedItem" class="w-full bg-neutral-900/50 rounded border border-neutral-800 p-4 min-h-[160px] flex flex-col gap-3">
             <div class="flex justify-between items-start">
                 <div>
                     <h4 class="text-amber-200 font-bold">{{ selectedItemDef?.name }}</h4>
                     <p class="text-[10px] text-neutral-500">{{ selectedItemDef?.desc }}</p>
                 </div>
                 <div class="text-xs text-amber-600 font-mono">
                     孔位: {{ currentGems.length }} / {{ maxSlots }}
                 </div>
             </div>

             <!-- Gem Slots Visualization -->
             <div class="flex gap-2 mt-2 justify-center">
                 <div 
                    v-for="i in maxSlots" 
                    :key="i"
                    class="w-12 h-12 rounded-full border border-neutral-700 bg-black flex items-center justify-center relative shadow-inner"
                 >
                    <!-- Socketed Gem -->
                    <div 
                        v-if="currentGems[i-1]" 
                        class="w-full h-full p-1 group/gem cursor-help transition-transform active:scale-95"
                        @click.stop="handleUnsocket(i-1)"
                    >
                        <XianxiaIcon 
                            :src="getGemIcon(currentGems[i-1])" 
                            size="custom"
                            customClass="w-full h-full animate-pulse-slow" 
                        />
                        <!-- Tooltip (Simple) -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black border border-neutral-700 p-1 text-[10px] whitespace-nowrap hidden group-hover/gem:block z-10">
                            {{ getItemName(currentGems[i-1]) }}
                        </div>
                    </div>
                    <!-- Empty Slot -->
                    <div v-else class="w-2 h-2 rounded-full bg-neutral-800"></div>
                 </div>
             </div>

             <!-- Stats Preview -->
             <div class="mt-auto border-t border-neutral-800 pt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-400">
                 <div v-if="selectedItemDef?.stats?.atk || totalStats.atk" class="flex justify-between">
                     <span>攻击</span>
                     <span class="text-amber-500 font-mono">{{ totalStats.atk || 0 }} <span v-if="getStatDiff('atk', selectedItemDef?.stats?.atk || 0)" class="text-neutral-500 text-[10px]">{{ getStatDiff('atk', selectedItemDef?.stats?.atk || 0) }}</span></span>
                 </div>
                 <div v-if="selectedItemDef?.stats?.def || totalStats.def" class="flex justify-between">
                     <span>防御</span>
                     <span class="text-blue-500 font-mono">{{ totalStats.def || 0 }} <span v-if="getStatDiff('def', selectedItemDef?.stats?.def || 0)" class="text-neutral-500 text-[10px]">{{ getStatDiff('def', selectedItemDef?.stats?.def || 0) }}</span></span>
                 </div>
                 <div v-if="selectedItemDef?.stats?.hp || totalStats.hp" class="flex justify-between">
                     <span>气血</span>
                     <span class="text-green-500 font-mono">{{ totalStats.hp || 0 }} <span v-if="getStatDiff('hp', selectedItemDef?.stats?.hp || 0)" class="text-neutral-500 text-[10px]">{{ getStatDiff('hp', selectedItemDef?.stats?.hp || 0) }}</span></span>
                 </div>
                 <div v-if="selectedItemDef?.stats?.mp || totalStats.mp" class="flex justify-between">
                     <span>灵力</span>
                     <span class="text-sky-500 font-mono">{{ totalStats.mp || 0 }} <span v-if="getStatDiff('mp', selectedItemDef?.stats?.mp || 0)" class="text-neutral-500 text-[10px]">{{ getStatDiff('mp', selectedItemDef?.stats?.mp || 0) }}</span></span>
                 </div>
                 <div v-if="selectedItemDef?.stats?.critRate || totalStats.critRate" class="flex justify-between">
                     <span>暴击</span>
                     <span class="text-purple-500 font-mono">{{ ((totalStats.critRate || 0) * 100).toFixed(0) }}% <span v-if="getStatDiff('critRate', selectedItemDef?.stats?.critRate || 0)" class="text-neutral-500 text-[10px]">{{ getStatDiff('critRate', selectedItemDef?.stats?.critRate || 0) }}</span></span>
                 </div>
             </div>
        </div>
        <div v-else class="w-full h-[160px] flex items-center justify-center text-neutral-600 text-xs border border-dashed border-neutral-800 rounded">
            请选择一件已装备的物品进行打造
        </div>

        <!-- Action Area: Socket Gem -->
        <div class="w-full flex-1 min-h-0 flex flex-col gap-2">
            <h4 class="text-amber-500 text-xs font-bold px-1">可镶嵌宝石</h4>
            <div class="flex-1 overflow-y-auto bg-black/30 border border-neutral-800 rounded p-2 grid grid-cols-4 gap-3 content-start scrollbar-hide">
                <div 
                    v-for="gem in availableGems" 
                    :key="gem.itemId"
                    class="flex flex-col gap-1 cursor-pointer group"
                    @click="handleSocket(gem.itemId)"
                >
                    <div class="w-full aspect-square bg-neutral-900 border border-neutral-700 group-hover:border-amber-500 rounded flex items-center justify-center relative transition-colors shadow-black shadow-md">
                        <XianxiaIcon :src="getGemIcon(gem.itemId)" size="custom" customClass="w-[80%] h-[80%]" />
                         <span class="absolute top-0 right-0 text-[9px] bg-black/80 px-1 text-white font-mono rounded-bl">{{ gem.count }}</span>
                    </div>
                    <span class="text-[10px] text-center text-neutral-400 group-hover:text-amber-200 truncate px-0.5">{{ getItemName(gem.itemId) }}</span>
                </div>
                <div v-if="availableGems.length === 0" class="col-span-5 text-center text-neutral-600 text-xs py-4">
                    背包中没有宝石
                </div>
            </div>
        </div>

    </div> <!-- Closes the Main Forge Area div -->

    <!-- Simple Toast Notification -->
    <transition name="fade">
        <div 
            v-if="showToast" 
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-amber-100 px-4 py-2 rounded border border-amber-900/50 backdrop-blur pointer-events-none z-50 text-sm shadow-lg whitespace-nowrap"
        >
            {{ toastMessage }}
        </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePlayerStore } from '../../../stores/player';
import { useInventoryStore } from '../../../stores/inventory';
import { getItem } from '../../../core/constants/items';
import type { InventorySlot } from '../../../core/models/item';
import XianxiaIcon from '../../shared/XianxiaIcon.vue';
import SpiritButton from '../../shared/SpiritButton.vue';

const playerStore = usePlayerStore();
const inventoryStore = useInventoryStore();

const slots = [
    { key: 'weapon' as const, name: '武器' },
    { key: 'armor' as const, name: '防具' },
    { key: 'accessory' as const, name: '饰品' },
];

const selectedSlot = ref<'weapon' | 'armor' | 'accessory'>('weapon');

// Get currently equipped item
const selectedItem = computed(() => {
    // Dep: uiKey to force refresh
    uiKey.value; 
    return playerStore.player.equipment[selectedSlot.value];
});
const selectedItemDef = computed(() => selectedItem.value ? getItem(selectedItem.value.itemId) : null);

const maxSlots = computed(() => selectedItemDef.value?.gemSlots || 0);

const currentGems = computed(() => {
    // Dep: uiKey
    uiKey.value;
    if (!selectedItem.value || !selectedItem.value.instanceData) return [];
    return selectedItem.value.instanceData.gems || [];
});

// Available gems in inventory
const availableGems = computed(() => {
    // Dep: uiKey
    uiKey.value;
    return inventoryStore.inventory.filter(slot => {
        const item = getItem(slot.itemId);
        // Simple heuristic: if item ID starts with 'gem_' or type is material (with stats?)
        // Let's use name check or ID prefix for safety as type is generic 'material'
        return slot.itemId.startsWith('gem_'); 
    });
});

function getEquip(slotKey: 'weapon' | 'armor' | 'accessory') {
    return playerStore.player.equipment[slotKey];
}

function getIcon(slot: InventorySlot) {
    const item = getItem(slot.itemId);
    return item?.icon || (item?.type === 'equipment' ? `icon_type_${item?.slot}` : 'icon_bag');
}

// Compute total stats including gems
const totalStats = computed(() => {
    uiKey.value;
    if (!selectedItemDef.value) return {};
    
    // Clone base stats
    const stats: Record<string, number> = { ...selectedItemDef.value.stats };
    
    // Add gem stats
    currentGems.value.forEach(gemId => {
        const gem = getItem(gemId);
        if (gem?.stats) {
            Object.entries(gem.stats).forEach(([key, val]) => {
                const k = key as keyof typeof stats;
                stats[k] = (stats[k] || 0) + val;
            });
        }
    });
    
    return stats;
});

// Helper to format stat display
function getStatDiff(key: string, baseVal: number) {
    const total = totalStats.value[key] || 0;
    const diff = total - baseVal;
    return diff > 0 ? `(+${diff})` : '';
}

function getGemIcon(itemId: string) {
    const item = getItem(itemId);
    if (item?.icon) return item.icon;
    
    // Fallback based on stat type if possible
    if (item?.stats?.atk) return 'ui_stat_atk';
    if (item?.stats?.def) return 'ui_stat_def';
    if (item?.stats?.hp) return 'ui_stat_hp';
    if (item?.stats?.critRate || item?.stats?.dodgeRate) return 'ui_stat_mp'; // Reusing MP/Special icon
    
    return 'ui_icon_gem'; 
}

function getItemName(itemId: string) {
    return getItem(itemId)?.name || '未知物品';
}

// Toast State
const toastMessage = ref('');
const showToast = ref(false);
let toastTimer: number | null = null;

function displayToast(msg: string) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.value = msg;
    showToast.value = true;
    toastTimer = window.setTimeout(() => {
        showToast.value = false;
    }, 2000);
}

const uiKey = ref(0);

// Helper to refresh UI
function refreshUI() {
    uiKey.value++;
}

// Handle unsocket
function handleUnsocket(index: number) {
    if (!selectedItem.value) return;
    
    // Use timeout to let store update first, though synchronous should be fine
    const result = inventoryStore.unsocketGemFromEquipped(selectedSlot.value, index);
    if (result.msg) {
        displayToast(result.msg);
    }
    if (result.success) {
        refreshUI();
    }
}

function handleSocket(gemId: string) {
    if (!selectedItem.value) return;
    
    const result = inventoryStore.socketGemToEquipped(selectedSlot.value, gemId);
    if (result.msg) {
        displayToast(result.msg);
    }
    if (result.success) {
        refreshUI();
    }
}
</script>
