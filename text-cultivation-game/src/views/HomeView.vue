<template>
  <div class="h-full flex flex-col overflow-hidden bg-black select-none relative">
    
    <!-- 1. STATUS HEADER (Fixed Top) -->
    <StatusHeader 
        :name="playerStore.player.name || '寻道者'"
        :realm-name="currentRealmName || '凡人'"
        :combat-power="combatPower"
        :hp="Math.floor(stats.hp)"
        :max-hp="stats.maxHp"
        :spirit-stones="spiritStones"
        :day="gameDay"
    />

    <!-- 2. MAIN CONTENT (Flex column, no scroll) -->
    <div class="flex-1 flex flex-col min-h-0 relative bg-black/20 pb-safe">
         
         <!-- CHARACTER VISUALIZER (Top, Pushed Up) -->
         <!-- Spacer to push down very slightly from header if needed, but requested "Higher".
              Actually flex-col with space-between pushes it top/bottom. 
              We want Character Top, Attribute Mid, Chat Bottom.
         -->
         <div class="flex-1 flex flex-col justify-start pt-2">
             <CharacterVisualizer 
                class="flex-shrink-0 z-10"
                :progress="progressPercentage"
                :efficiency-text="efficiencyText"
                :can-breakthrough="canBreakthrough"
                @cultivate="manualCultivate"
                @breakthrough="openBreakthroughDialog"
                @open-slot="openSlotSelection"
             />

             <!-- SPACER to push Attribute Panel down slightly but keep it connected -->
             <div class="flex-grow max-h-4"></div>

             <!-- ATTRIBUTE PANEL (Middle-Bottom) -->
             <AttributePanel 
                class="w-full max-w-md mx-auto z-10"
                :stats="stats" 
                :spirit-root="playerStore.player.spiritRoot"
             />
         </div>
         
         <!-- CHAT PANEL (Fixed Bottom above nav) -->
         <ChatPanel 
            :logs="recentLogs"
            class="w-full z-20 shrink-0"
         />

         <!-- Background Decoration (Mountain) -->
         <div class="absolute inset-x-0 bottom-0 h-1/2 opacity-20 bg-[url('@/assets/ui/bg_texture_mountain.png')] bg-contain bg-bottom bg-no-repeat pointer-events-none z-0"></div>
    </div>

    <!-- MODALS -->

    <!-- SLOT SELECTION MODAL -->
    <transition name="fade">
        <div v-if="showSlotModal" class="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm" @click.self="showSlotModal = false">
             <InkPanel class="w-full max-w-sm max-h-[80vh] flex flex-col" :decorated="true">
                 <div class="p-3 border-b border-neutral-800 bg-black/20 flex justify-between items-center shrink-0">
                     <span class="text-amber-500 font-bold tracking-wider">当前装备: {{ getSlotLabel(selectedSlot) }}</span>
                     <button @click="showSlotModal = false" class="text-neutral-500 hover:text-neutral-300">✕</button>
                 </div>
                 
                 <div class="p-2 overflow-y-auto min-h-0 flex-1 space-y-4">
                     <!-- Current Equipped Item (Rich Card) -->
                     <div v-if="currentEquippedItem && getItemDef(currentEquippedItem.itemId)" class="space-y-2">
                         <ItemDetailCard 
                             :item="getItemDef(currentEquippedItem.itemId)!"
                             :instance="currentEquippedItem"
                         />
                         
                         <div 
                            @click="handleUnequip"
                            class="p-3 border border-red-900/30 bg-red-900/10 rounded flex items-center justify-center text-red-400 text-xs cursor-pointer hover:bg-red-900/20 font-bold"
                         >
                            卸下当前装备
                         </div>
                     </div>
                     <div v-else class="text-center py-4 text-neutral-500 text-xs italic">
                         当前部位未装备物品
                     </div>

                     <!-- Divider -->
                     <div class="border-t border-neutral-800 my-2 pt-2 text-xs text-neutral-400 font-bold">
                         可替换装备
                     </div>

                     <!-- Available Items List -->
                      <div v-if="slotItems.length === 0" class="py-4 text-center text-neutral-600 text-xs">
                          背包中暂无可用装备
                      </div>

                      <div 
                        v-for="item in slotItems" 
                        :key="item.itemId"
                        @click="handleEquip(item.itemId)"
                        class="p-2 border border-neutral-800 bg-black/40 rounded flex gap-3 items-center cursor-pointer hover:border-amber-700/50 hover:bg-neutral-900 transition-colors"
                      >
                           <XianxiaIcon :src="getItemDef(item.itemId)?.icon" fallback="📦" size="sm" :glow="true" />
                           <div class="flex-1">
                               <div class="flex justify-between">
                                   <span class="text-xs font-bold" :class="getItemColor(item)">{{ getItemDef(item.itemId)?.name }}</span>
                                   <span class="text-[10px] text-neutral-600">Lv.{{ item.instanceData?.level || 0 }}</span>
                               </div>
                               <div class="text-[10px] text-neutral-500 line-clamp-1">{{ getItemDef(item.itemId)?.desc }}</div>
                           </div>
                           <span class="text-xs text-amber-600">装备</span>
                      </div>
                 </div>
             </InkPanel>
        </div>
    </transition>

    <!-- BREAKTHROUGH MODAL -->
    <transition name="fade">
        <div v-if="showBreakthroughModal" class="absolute inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <InkPanel class="w-full max-w-sm" :decorated="true">
                <!-- Header Image -->
                <div class="h-24 -mt-4 -mx-4 mb-4 relative overflow-hidden border-b border-amber-900/50">
                    <div 
                        class="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-screen"
                        :style="{ backgroundImage: `url(${breakthroughBgUrl})` }"
                    ></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
                    
                    <div class="absolute bottom-2 left-0 w-full text-center">
                        <div class="text-xl text-amber-500 font-bold text-shadow-gold tracking-widest">准备突破</div>
                        <div class="text-xs text-amber-200/70 font-mono">目标境界：{{ playerStore.nextRealm?.name || '未知' }}</div>
                    </div>
                </div>

                <div class="space-y-4 text-sm px-2 pb-2">
                    <!-- Probabilities -->
                    <div class="flex justify-between items-center bg-black/30 p-2 rounded border border-neutral-800">
                        <span class="text-neutral-400">基础成功率</span>
                        <span class="text-amber-100 font-mono">{{ Math.floor(breakthroughBaseProb * 100) }}%</span>
                    </div>
                    
                    <!-- Item Usage -->
                    <div v-if="breakthroughTargetItem" class="space-y-2">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-amber-600 flex items-center gap-1">
                                <XianxiaIcon src="ui_stat_spiritstone" fallback="💊" size="xs" />
                                {{ breakthroughTargetItem.name }} ({{ breakthroughMaxCount }})
                            </span>
                            <span class="text-green-600">+{{ Math.floor(breakthroughItemBonus * 100) }}%/个</span>
                        </div>
                        
                        <div class="flex items-center gap-3">
                                <input 
                                type="range" 
                                v-model.number="breakthroughItemCount" 
                                :max="breakthroughMaxCount" 
                                min="0"
                                class="flex-1 accent-amber-600 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer border border-neutral-700"
                            >
                            <span class="w-8 text-right text-amber-500 font-mono text-lg">{{ breakthroughItemCount }}</span>
                        </div>
                    </div>
                    
                    <div v-else class="py-4 text-center text-neutral-600 text-xs italic border border-dashed border-neutral-800 rounded">
                        无可用辅助丹药
                    </div>

                    <!-- Total Probability -->
                    <div class="flex justify-between items-center border-t border-amber-900/30 pt-3">
                        <span class="text-neutral-300 font-bold">最终成功率</span>
                        <div class="text-xl font-bold font-mono"
                            :class="breakthroughTotalProb >= 0.8 ? 'text-green-500 text-shadow-green' : (breakthroughTotalProb >= 0.5 ? 'text-amber-500' : 'text-red-500')"
                        >
                            {{ Math.floor(breakthroughTotalProb * 100) }}%
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3 pt-2">
                        <SpiritButton @click="showBreakthroughModal = false" class="flex-1" variant="secondary">
                            放弃
                        </SpiritButton>
                        <SpiritButton @click="confirmBreakthrough" class="flex-1" variant="primary">
                            开始突破
                        </SpiritButton>
                    </div>
                </div>
            </InkPanel>
        </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePlayerStore } from '../stores/player';
import { getItem } from '../core/constants/items';
import { useToast } from '../composables/useToast';
import { useInventoryStore } from '../stores/inventory';
import { getItemQuality } from '../core/utils/item';
import type { EquipmentSlot, InventorySlot } from '../core/models/item';

// Sub Components
import StatusHeader from '../components/home/StatusHeader.vue';
import CharacterVisualizer from '../components/home/CharacterVisualizer.vue';
import XianxiaIcon from '../components/shared/XianxiaIcon.vue';
import InkPanel from '../components/shared/InkPanel.vue';
import SpiritButton from '../components/shared/SpiritButton.vue';
import AttributePanel from '../components/home/AttributePanel.vue';
import ChatPanel from '../components/home/ChatPanel.vue';
import ItemDetailCard from '../components/shared/ItemDetailCard.vue';

// Assets
import breakthroughBg from '@/assets/ui/ui_btn_breakthrough.png';

const playerStore = usePlayerStore();
const inventoryStore = useInventoryStore();
const { addToast } = useToast();

// --- STATE ---
const recentLogs = ref<string[]>(['[系统] 欢迎来到修真世界...']);

// --- COMPUTED ---
const stats = computed(() => playerStore.effectiveStats);
// Combat Power (Simple approximation: Atk + Def + Hp/10)
const combatPower = computed(() => Math.floor(stats.value.atk + stats.value.def + stats.value.hp / 10));
const currentRealmName = computed(() => playerStore.currentRealm?.name);
const spiritStones = computed(() => playerStore.player.spiritStones);
const gameDay = computed(() => Math.floor((Date.now() - playerStore.player.createTime) / (1000 * 60 * 60 * 24)) + 1);

const currentExp = computed(() => playerStore.player.cultivation.currentExp);
const maxExp = computed(() => playerStore.maxExp);
const progressPercentage = computed(() => playerStore.progressPercentage);
const canBreakthrough = computed(() => currentExp.value >= maxExp.value);
const efficiencyText = computed(() => `+${playerStore.cultivationRate}/s`);

// --- CULTIVATION LOGIC ---
function manualCultivate() {
  playerStore.addExp(10); 
  
  const pStats = playerStore.player.stats;
  const oldHp = pStats.hp;
  const oldMp = pStats.mp;
  const hpRestore = Math.max(1, Math.floor(pStats.maxHp * 0.01));
  const mpRestore = Math.max(1, Math.floor(pStats.maxMp * 0.01));

  pStats.hp = Math.min(pStats.maxHp, pStats.hp + hpRestore);
  pStats.mp = Math.min(pStats.maxMp, pStats.mp + mpRestore);

  let msg = `[修炼] 你静心打坐，获得了 10 点修为。`;
  if (pStats.hp > oldHp || pStats.mp > oldMp) {
      msg += ` (气血+${pStats.hp - oldHp}, 灵力+${pStats.mp - oldMp})`;
  }
  
  // Also push to chat logs
  recentLogs.value.unshift(msg);
  if (recentLogs.value.length > 50) recentLogs.value.pop();
}

// --- EQUIPMENT SLOT SELECTION LOGIC ---
const showSlotModal = ref(false);
const selectedSlot = ref<EquipmentSlot | null>(null);

const slotLabels: Record<string, string> = {
    weapon: '武器', armor: '护甲', helm: '头盔', boots: '履部', necklace: '项链', belt: '法宝'
};

function getSlotLabel(slot: string | null) {
    if (!slot) return '';
    return slotLabels[slot] || slot;
}

function openSlotSelection(slot: EquipmentSlot) {
    selectedSlot.value = slot;
    showSlotModal.value = true;
}

const slotItems = computed(() => {
    if (!selectedSlot.value) return [];
    // Filter inventory for items compatible with the slot
    return inventoryStore.getBagItems().filter(slot => {
        const item = getItem(slot.itemId);
        return item && item.type === 'equipment' && item.slot === selectedSlot.value;
    });
});

const currentEquippedItem = computed(() => {
    if (!selectedSlot.value) return null;
    const slot = playerStore.player.equipment[selectedSlot.value];
    if (!slot) return null;
    return slot;
});

function getItemDef(itemId: string) {
    return getItem(itemId);
}

function getItemColor(slot: InventorySlot) {
    const q = getItemQuality(slot);
    return q.color;
}

function handleEquip(itemId: string) {
    if (inventoryStore.equipItem(itemId)) {
        addToast('装备成功', 'success');
        showSlotModal.value = false;
        
        const item = getItem(itemId);
        recentLogs.value.unshift(`[系统] 装备了 [${item?.name || '未知'}]`);
    } else {
        addToast('装备失败', 'error');
    }
}

function handleUnequip() {
    if (!selectedSlot.value || !currentEquippedItem.value) return;
    
    // Move to inventory
    const itemName = getItemDef(currentEquippedItem.value.itemId)?.name;
    playerStore.player.inventory.push(currentEquippedItem.value);
    delete playerStore.player.equipment[selectedSlot.value];
    // Reactive update?
    playerStore.save();
    
    addToast('已卸下装备', 'success');
    showSlotModal.value = false;
    recentLogs.value.unshift(`[系统] 卸下了 [${itemName || '未知'}]`);
}

// --- BREAKTHROUGH LOGIC ---
const breakthroughBgUrl = breakthroughBg;
const showBreakthroughModal = ref(false);
const breakthroughItemCount = ref(0);
const breakthroughMaxCount = ref(0);
const breakthroughBaseProb = ref(0);
const breakthroughItemBonus = ref(0);
const breakthroughTargetItem = ref<any>(null);

const breakthroughTotalProb = computed(() => {
    return Math.min(1.0, breakthroughBaseProb.value + (breakthroughItemCount.value * breakthroughItemBonus.value));
});

function openBreakthroughDialog() {
  if (!playerStore.currentRealm) return;
  const req = playerStore.currentRealm.breakthroughReq;
  
  breakthroughBaseProb.value = req?.probability ?? 1.0;
  breakthroughItemCount.value = 0;
  breakthroughMaxCount.value = 0;
  breakthroughItemBonus.value = 0;
  breakthroughTargetItem.value = null;

  if (req?.itemId) {
      const inventoryStore = useInventoryStore();
      const count = inventoryStore.getItemCount(req.itemId);
      const item = getItem(req.itemId);
      
      breakthroughTargetItem.value = item;
      breakthroughMaxCount.value = count;
      breakthroughItemBonus.value = item?.breakthroughBonus || 0;
      
      if (breakthroughItemBonus.value > 0) {
          const needed = Math.ceil((1.0 - breakthroughBaseProb.value) / breakthroughItemBonus.value);
          breakthroughItemCount.value = Math.min(count, needed);
      }
  }

  showBreakthroughModal.value = true;
}

function confirmBreakthrough() {
  showBreakthroughModal.value = false;
  const result = playerStore.attemptBreakthrough(breakthroughItemCount.value);
  recentLogs.value.unshift(`[突破] ${result.message}`);
  
  if (result.success) {
    addToast(result.message, 'success', 5000, 'breakthrough');
  } else {
    addToast(result.message, 'error', 5000, 'breakthrough');
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
