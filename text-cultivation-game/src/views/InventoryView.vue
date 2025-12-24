<template>
  <div class="space-y-4">
    <div class="bg-neutral-800 rounded p-3 text-sm flex justify-between items-center text-neutral-400">
      <span>背包空间</span>
      <span>{{ slots.length }} / 20</span>
    </div>

    <!-- Inventory Grid -->
    <div class="grid grid-cols-4 gap-3">
      <div 
        v-for="(slot, index) in slots" 
        :key="index"
        class="aspect-square bg-neutral-800 border border-neutral-700 rounded flex flex-col items-center justify-center p-2 hover:border-amber-500 cursor-pointer relative"
        @click="handleItemClick(slot)"
      >
        <span class="text-xs text-center break-all">{{ getItemName(slot.itemId) }}</span>
        <span class="absolute bottom-1 right-1 text-xs text-neutral-500">x{{ slot.count }}</span>
      </div>
      
      <!-- Empty Slots Visuals (Filling up to 20 for look) -->
      <div 
        v-for="n in (20 - slots.length)" 
        :key="`empty-${n}`"
        class="aspect-square bg-neutral-800/30 border border-neutral-800 rounded"
      ></div>
    </div>

    <!-- Item Details Modal (Simplified as inline panel for now) -->
    <div v-if="selectedSlot" class="bg-neutral-800 border-t border-neutral-700 p-4 fixed bottom-14 left-0 w-full z-20 shadow-lg">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-amber-500">{{ getItemName(selectedSlot.itemId) }}</h3>
        <button @click="selectedSlot = null" class="text-neutral-500">✕</button>
      </div>
      <p class="text-xs text-neutral-400 mb-4">{{ getItemDesc(selectedSlot.itemId) }}</p>
      
      <div class="flex gap-4">
        <button 
          v-if="canUse(selectedSlot.itemId)"
          @click="useItem(selectedSlot.itemId)"
          class="flex-1 bg-emerald-800 text-emerald-200 py-2 rounded text-sm hover:bg-emerald-700"
        >
          使用
        </button>
        <button 
          v-if="canEquip(selectedSlot.itemId)"
          @click="handleEquip(selectedSlot.itemId)"
          class="flex-1 bg-blue-800 text-blue-200 py-2 rounded text-sm hover:bg-blue-700"
        >
          装备
        </button>
        <button 
          @click="handleDiscard(selectedSlot.itemId)"
          class="flex-1 bg-red-900/50 text-red-300 py-2 rounded text-sm hover:bg-red-900"
        >
          丢弃
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useInventoryStore } from '../stores/inventory';
import { getItem } from '../core/constants/items';
import type { InventorySlot } from '../core/models/item';
import { useModal } from '../composables/useModal';

const inventoryStore = useInventoryStore();
const { showModal } = useModal();
const slots = computed(() => inventoryStore.slots);
const selectedSlot = ref<InventorySlot | null>(null);

// ... (existing helper functions) ...

function getItemName(id: string) {
  return getItem(id)?.name || '未知';
}

function getItemDesc(id: string) {
  return getItem(id)?.desc || '';
}

function handleItemClick(slot: InventorySlot) {
  selectedSlot.value = slot;
}

function canUse(id: string) {
  const item = getItem(id);
  return item?.type === 'consumable';
}

function canEquip(id: string) {
  const item = getItem(id);
  return item?.type === 'equipment';
}

function useItem(id: string) {
  if (inventoryStore.useItem(id)) {
    selectedSlot.value = null; 
  }
}

function handleEquip(id: string) {
  if (inventoryStore.equip(id)) {
    selectedSlot.value = null;
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
