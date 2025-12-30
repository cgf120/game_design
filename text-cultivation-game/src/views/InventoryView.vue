<template>
  <div class="h-full flex flex-col bg-black">
    <!-- 1. Header with Capacity -->
    <div class="px-4 py-3 bg-neutral-900 border-b border-amber-900/30 flex justify-between items-center z-10">
        <h2 class="text-amber-500 font-bold tracking-widest text-lg">储物袋</h2>
        <div class="flex items-center gap-4">
            <button 
                @click="showDecompose = true"
                class="text-xs text-amber-500/80 hover:text-amber-400 border border-amber-500/30 px-2 py-1 rounded"
            >
                批量分解
            </button>
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
            :title="getSlotTitle(selectedSlot)" 
            variant="center"
            :clean="true"
            @close="selectedSlot = null"
        >
            <div class="space-y-4">
                <!-- New Rich Item Card -->
                <ItemDetailCard 
                    v-if="selectedSlot && getItem(selectedSlot.itemId)"
                    :item="getItem(selectedSlot.itemId)!"
                    :instance="selectedSlot"
                />

                <!-- Actions -->
                <div class="pt-2 flex flex-col gap-2">
                    
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

    <!-- 5. Batch Decompose Modal -->
    <transition name="fade">
        <HomePanelModal 
            v-if="showDecompose" 
            title="批量分解" 
            @close="showDecompose = false"
        >
            <div class="space-y-6">
                <div class="text-neutral-400 text-sm">
                    请勾选要自动分解的装备品质：
                </div>
                
                <!-- Checkboxes -->
                <div class="grid grid-cols-2 gap-3">
                    <div 
                        v-for="opt in QUALITY_OPTIONS" 
                        :key="opt.label"
                        @click="toggleDecompose(opt.label)"
                        class="border rounded px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors"
                        :class="[
                            decomposeQualities.includes(opt.label) 
                                ? 'bg-amber-900/30 border-amber-600' 
                                : 'bg-black border-neutral-700 hover:border-neutral-500'
                        ]"
                    >
                        <div 
                            class="w-4 h-4 rounded-sm border flex items-center justify-center transition-colors"
                            :class="decomposeQualities.includes(opt.label) ? 'bg-amber-500 border-amber-500' : 'border-neutral-500'"
                        >
                            <span v-if="decomposeQualities.includes(opt.label)" class="text-black text-[10px] font-bold">✓</span>
                        </div>
                        <span :class="opt.color">{{ opt.label }}</span>
                    </div>
                </div>

                <!-- Preview -->
                <div class="bg-neutral-800/50 p-3 rounded text-sm space-y-1">
                    <div class="flex justify-between text-neutral-400">
                        <span>预计分解数量</span>
                        <span class="text-white font-mono">{{ decomposePreview.count }}</span>
                    </div>
                    <div class="flex justify-between text-neutral-400">
                        <span>预计获得灵石</span>
                        <span class="text-amber-400 font-mono">+{{ decomposePreview.value }}</span>
                    </div>
                </div>

                <!-- Actions -->
                <button 
                    @click="executeDecompose"
                    class="w-full py-3 bg-red-900/80 border border-red-700 text-red-100 rounded shadow hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="decomposePreview.count === 0"
                >
                    确认分解
                </button>
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
import ItemDetailCard from '../components/shared/ItemDetailCard.vue';

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
            return item?.type === 'equipment' || ['weapon', 'armor', 'accessory'].includes(item?.type || '');
        }
        return item?.type === activeCategory.value;
    });
});

// Helpers
import { getItemQuality } from '../core/utils/item';

function getSlotTitle(slot: InventorySlot) {
    const item = getItem(slot.itemId);
    if (!item) return '未知物件';
    
    const quality = getItemQuality(slot);
    if (!quality || quality.label === '下品') {
        return item.name;
    }
    
    return `[${quality.label}] ${item.name}`;
}


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

// --- Batch Decompose Logic ---
import { QUALITY_TIERS, getDecomposeValue } from '../core/utils/item';

const showDecompose = ref(false);
const decomposeQualities = ref<string[]>([]);
const QUALITY_OPTIONS = [
    QUALITY_TIERS.common,
    QUALITY_TIERS.good,
    QUALITY_TIERS.superior,
    QUALITY_TIERS.peerless
];

const decomposePreview = computed(() => {
    let count = 0;
    let value = 0;
    
    // Scan inventory locally for preview
    const list = inventoryStore.inventory;
    for (const slot of list) {
        const item = getItem(slot.itemId);
        if (!item || item.type !== 'equipment') continue;
        
        const q = getItemQuality(slot);
        if (decomposeQualities.value.includes(q.label)) {
            count++;
            value += getDecomposeValue(slot);
        }
    }
    return { count, value };
});

function toggleDecompose(qualityLabel: string) {
    const idx = decomposeQualities.value.indexOf(qualityLabel);
    if (idx === -1) decomposeQualities.value.push(qualityLabel);
    else decomposeQualities.value.splice(idx, 1);
}

function executeDecompose() {
    if (decomposePreview.value.count === 0) return;
    
    const result = inventoryStore.batchDecompose(decomposeQualities.value);
    
    showModal({ 
        title: '分解完成', 
        content: `成功分解 ${result.count} 件装备，获得 ${result.totalValue} 灵石。`, 
        showCancel: false 
    });
    
    showDecompose.value = false;
    decomposeQualities.value = [];
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
