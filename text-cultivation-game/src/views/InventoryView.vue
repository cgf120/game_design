<template>
  <div class="h-full flex flex-col bg-black">
    <!-- 1. Header with Capacity -->
    <div class="px-4 py-3 bg-neutral-900 border-b border-amber-900/30 flex justify-between items-center z-10">
        <h2 class="text-amber-500 font-bold tracking-widest text-lg">储物袋</h2>
        <!-- Capacity Bar -->
        <div class="flex flex-col items-end w-32">
            <div class="text-[10px] text-neutral-500 font-mono mb-1">
                容量 {{ slots.length }} / {{ maxSlots }}
            </div>
            <div class="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                    class="h-full bg-amber-600 transition-all duration-300"
                    :style="{ width: `${(slots.length / maxSlots) * 100}%` }"
                ></div>
            </div>
        </div>
    </div>

    <!-- 2. Filter Bar -->
    <InventoryFilterBar 
        :active-category="activeCategory"
        @select="activeCategory = $event"
    />

    <!-- 3. Scrollable Grid -->
    <div class="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div class="grid grid-cols-5 gap-2 content-start min-h-0">
            <!-- Items -->
            <InventoryItemSlot 
                v-for="(slot, index) in filteredSlots" 
                :key="`slot-${slot.itemId}-${index}`"
                :slot-data="slot"
                :selected="selectedSlot === slot"
                @click="selectedSlot = slot"
            />
            
            <!-- Empty Fillers (Optional visual) -->
            <InventoryItemSlot 
                v-for="n in Math.max(0, 25 - filteredSlots.length)" 
                :key="`empty-${n}`"
                :slot-data="null"
            />
        </div>
        
        <!-- Empty State Message -->
        <div v-if="filteredSlots.length === 0" class="py-12 text-center text-neutral-600 text-xs italic">
            此分类暂无物品
        </div>
    </div>

    <!-- 4. Detail Modal (Bottom Sheet) -->
    <transition name="fade">
        <HomePanelModal 
            v-if="selectedSlot" 
            :title="getItemName(selectedSlot.itemId)" 
            @close="selectedSlot = null"
        >
            <div class="space-y-4">
                <!-- Icon & Desc -->
                <div class="flex gap-4">
                    <div class="w-16 h-16 bg-black border border-neutral-700 rounded flex items-center justify-center relative flex-none">
                         <XianxiaIcon 
                            :src="getItemIcon(selectedSlot.itemId)" 
                            fallback="📦" 
                            size="lg" 
                        />
                         <span class="absolute bottom-0 right-0 bg-neutral-800 text-[10px] px-1 text-white/70">
                            x{{ selectedSlot.count }}
                        </span>
                    </div>
                    <div class="flex-1 text-sm text-neutral-300 leading-relaxed font-serif">
                        {{ getItemDesc(selectedSlot.itemId) }}
                        
                        <!-- Extra Stats Display -->
                        <div class="mt-3 space-y-1 text-xs font-mono">
                            <!-- Helper function result wrapper -->
                            <div v-for="stat in getItemStatsList(selectedSlot.itemId)" :key="stat.label" class="flex justify-between border-b border-white/5 pb-0.5">
                                <span class="text-neutral-500">{{ stat.label }}</span>
                                <span :class="stat.color">{{ stat.value }}</span>
                            </div>
                            
                            <!-- Effect Display -->
                            <div v-if="getItemEffect(selectedSlot.itemId)" class="text-emerald-500 pt-1">
                                {{ getItemEffect(selectedSlot.itemId) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats / Actions -->
                <div class="pt-4 border-t border-white/5 flex flex-col gap-2">
                    
                    <button 
                        v-if="canUse(selectedSlot.itemId)"
                        @click="useItem(selectedSlot.itemId)"
                        class="w-full py-3 bg-gradient-to-r from-emerald-900 to-emerald-800 border border-emerald-700/50 text-emerald-100 rounded shadow hover:brightness-110 active:scale-98 transition-all"
                    >
                        使用
                    </button>
                    
                    <button 
                        v-if="canEquip(selectedSlot.itemId)"
                        @click="handleEquip(selectedSlot.itemId)"
                        class="w-full py-3 bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700/50 text-blue-100 rounded shadow hover:brightness-110 active:scale-98 transition-all"
                    >
                        装备
                    </button>
                    
                     <button 
                        @click="handleDiscard(selectedSlot.itemId)"
                         class="w-full py-2 text-red-400/80 hover:text-red-400 text-xs border border-transparent hover:bg-white/5 rounded transition-all"
                    >
                        丢弃物品
                    </button>
                </div>
            </div>
        </HomePanelModal>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useInventoryStore } from '../stores/inventory';
import { getItem } from '../core/constants/items';
import type { InventorySlot } from '../core/models/item';
import { useModal } from '../composables/useModal';

// Components
import InventoryItemSlot from '../components/inventory/InventorySlot.vue';
import InventoryFilterBar from '../components/inventory/InventoryFilterBar.vue';
import HomePanelModal from '../components/home/HomePanelModal.vue';
import XianxiaIcon from '../components/shared/XianxiaIcon.vue';

const inventoryStore = useInventoryStore();
const { showModal } = useModal();

// State
const activeCategory = ref('all');
const selectedSlot = ref<InventorySlot | null>(null);
const maxSlots = 20; // Hardcoded or from store

// Computed
const slots = computed(() => inventoryStore.inventory);
const filteredSlots = computed(() => {
    if (activeCategory.value === 'all') return slots.value;
    
    return slots.value.filter(slot => {
        const item = getItem(slot.itemId);
        // Map item.type to category keys
        // Assuming item.type values: 'weapon', 'armor', 'accessory', 'consumable', 'material'
        if (activeCategory.value === 'equipment') {
            return ['weapon', 'armor', 'accessory'].includes(item?.type || '');
        }
        return item?.type === activeCategory.value;
    });
});

// Helpers
function getItemName(id: string) { return getItem(id)?.name || '未知物件'; }
function getItemDesc(id: string) { return getItem(id)?.desc || '并无特别之处。'; }
function getItemIcon(id: string) { 
    const i = getItem(id);
    if (!i) return 'icon_bag';
    if (i.icon) return i.icon;
    
    // Handle Equipment
    if (i.type === 'equipment' && i.slot) {
        return `icon_type_${i.slot}`; // icon_type_weapon, icon_type_armor, etc.
    }

    // Handle Others
    if (['consumable', 'material'].includes(i.type)) {
        return `icon_type_${i.type}`;
    }

    return 'icon_bag'; 
}

import { getItemStatsList, getItemEffect } from '../core/utils/item';

function canUse(id: string) { return getItem(id)?.type === 'consumable'; }
function canEquip(id: string) { 
    const item = getItem(id);
    return item?.type === 'equipment' || ['weapon','armor','accessory'].includes(item?.type || '');
}

// Actions
function useItem(id: string) {
  const res = inventoryStore.useItem(id);
  if (res.success) {
      showModal({ title: '使用成功', content: res.msg, showCancel: false });
      selectedSlot.value = null; 
  } else {
      showModal({ title: '无法使用', content: res.msg, showCancel: false });
  }
}

function handleEquip(id: string) {
    // InventoryStore might not have straight equip return boolean, checking previous code
    // "inventoryStore.equipItem(id)" returns boolean in previous file.
  if (inventoryStore.equipItem(id)) {
    selectedSlot.value = null;
    showModal({ title: '装备成功', content: '物品已装备。', showCancel: false });
  }
}

function handleDiscard(id: string) {
  const item = getItem(id);
  showModal({
    title: '丢弃物品',
    content: `确定要丢弃 ${item?.name || '该物品'} 吗？此操作无法撤销。`,
    confirmText: '确认丢弃',
    cancelText: '我再想想',
    onConfirm: () => {
      inventoryStore.removeItem(id, 1);
      selectedSlot.value = null;
    }
  });
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
