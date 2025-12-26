<template>
  <div class="h-full flex flex-col overflow-hidden bg-black select-none relative">
    
    <!-- 1. STATUS HEADER -->
    <StatusHeader 
        :name="playerStore.player.name || '寻道者'"
        :realm-name="currentRealmName || '凡人'"
        :combat-power="combatPower"
        :hp="Math.floor(stats.hp)"
        :max-hp="stats.maxHp"
        :spirit-stones="spiritStones"
        :day="gameDay"
    />

    <!-- 2. CHARACTER VISUALIZER -->
    <div class="flex-none relative bg-black/20">
         <CharacterVisualizer 
            :progress="progressPercentage"
            :efficiency-text="efficiencyText"
            :can-breakthrough="canBreakthrough"
            @cultivate="manualCultivate"
            @breakthrough="openBreakthroughDialog"
         />
    </div>

    <!-- 3. MAIN CONTENT AREA (Scrollable) -->
    <div class="flex-1 min-h-0 relative overflow-y-auto scrollbar-hide py-4 space-y-6 pb-24">
         
         <!-- 3.1 ATTRIBUTE PANEL (Premium Jade Slip) -->
         <div class="mx-4 relative group">
            <!-- Decorative Borders -->
            <div class="absolute inset-0 bg-neutral-900/90 rounded border border-amber-900/50 shadow-lg shadow-black/80"></div>
            <div class="absolute -top-[2px] -left-[2px] -right-[2px] h-[4px] bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"></div>
            <div class="absolute -bottom-[2px] -left-[2px] -right-[2px] h-[4px] bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"></div>
            
            <!-- Corner Accents -->
            <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/60"></div>
            <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/60"></div>
            <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500/60"></div>
            <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/60"></div>

            <div class="relative p-4">
                <!-- Vitals (HP/MP) with glowing numbers -->
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- HP -->
                    <div class="flex flex-col gap-1.5">
                        <div class="flex justify-between items-end px-1">
                             <div class="flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-glow-red"></span>
                                <span class="text-xs text-neutral-400 font-serif">气血</span>
                             </div>
                             <span class="font-mono text-sm text-neutral-200 font-bold tracking-tight">{{ Math.floor(stats.hp) }}</span>
                        </div>
                        <div class="h-2 bg-black/50 rounded-full overflow-hidden border border-neutral-800 relative shadow-inner">
                            <div class="absolute inset-0 bg-red-900/20"></div>
                            <div class="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-500" :style="{ width: `${(stats.hp / stats.maxHp) * 100}%` }"></div>
                        </div>
                    </div>
                    <!-- MP -->
                    <div class="flex flex-col gap-1.5">
                         <div class="flex justify-between items-end px-1">
                             <div class="flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-glow-blue"></span>
                                <span class="text-xs text-neutral-400 font-serif">灵力</span>
                             </div>
                             <span class="font-mono text-sm text-neutral-200 font-bold tracking-tight">{{ Math.floor(stats.mp) }}</span>
                        </div>
                        <div class="h-2 bg-black/50 rounded-full overflow-hidden border border-neutral-800 relative shadow-inner">
                             <div class="absolute inset-0 bg-sky-900/20"></div>
                            <div class="h-full bg-gradient-to-r from-sky-900 via-sky-600 to-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-500" :style="{ width: `${(stats.mp / stats.maxMp) * 100}%` }"></div>
                        </div>
                    </div>
                </div>

                <!-- Combat Stats Grid -->
                <div class="grid grid-cols-4 divide-x divide-neutral-800 border-t border-neutral-800 pt-4">
                     <div class="flex flex-col items-center gap-1">
                        <span class="text-[10px] text-neutral-500 font-serif tracking-widest">攻击</span>
                        <span class="font-mono font-bold text-amber-500 text-base drop-shadow-sm">{{ stats.atk }}</span>
                     </div>
                     <div class="flex flex-col items-center gap-1">
                        <span class="text-[10px] text-neutral-500 font-serif tracking-widest">防御</span>
                        <span class="font-mono font-bold text-blue-400 text-base drop-shadow-sm">{{ stats.def }}</span>
                     </div>
                     <div class="flex flex-col items-center gap-1">
                        <span class="text-[10px] text-neutral-500 font-serif tracking-widest">暴击</span>
                        <span class="font-mono font-bold text-purple-400 text-base drop-shadow-sm">{{ (stats.critRate * 100).toFixed(0) }}%</span>
                     </div>
                     <div class="flex flex-col items-center gap-1">
                        <span class="text-[10px] text-neutral-500 font-serif tracking-widest">闪避</span>
                        <span class="font-mono font-bold text-white/50 text-base drop-shadow-sm">{{ (stats.dodgeRate * 100).toFixed(0) }}%</span>
                     </div>
                </div>
            </div>
         </div>
    </div>
    
    <!-- 4. BOTTOM DOCK (Fixed) -->
    <div class="absolute bottom-4 left-4 right-4 h-16 bg-neutral-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-50 flex items-center justify-around px-2">
         <button 
            v-for="item in menuItems" 
            :key="item.id"
            @click="handleMenuSelect(item.id)"
            class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative group"
            :class="activePanel === item.id ? 'bg-white/10 -translate-y-2 scale-110 shadow-lg border border-white/5' : 'hover:bg-white/5 opacity-70 hover:opacity-100'"
         >
            <XianxiaIcon 
                :src="item.icon" 
                :fallback="item.fallback" 
                size="sm" 
                class="transition-transform duration-300"
                :class="activePanel === item.id ? 'shadow-glow-gold' : ''"
            />
            <span 
                class="text-[10px] font-serif tracking-widest transition-colors duration-300"
                :class="activePanel === item.id ? 'text-amber-400 font-bold' : 'text-neutral-400 group-hover:text-neutral-200'"
            >
                {{ item.label }}
            </span>
            
            <!-- Active Indicator Dot -->
            <div 
                v-if="activePanel === item.id"
                class="absolute -bottom-1 w-1 h-1 rounded-full bg-amber-500 shadow-glow-gold"
            ></div>
         </button>
    </div>
    <!-- 4. PANELS MODAL -->
    <transition name="fade">
        <HomePanelModal 
            v-if="activePanel" 
            :title="activePanelTitle" 
            @close="activePanel = null"
        >
            <component :is="activePanelComponent" v-bind="activePanelProps" @reset="confirmReset" />
        </HomePanelModal>
    </transition>

    <!-- BREAKTHROUGH MODAL (Keep existing logic but ensure it overlays everything) -->
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
import { useRouter } from 'vue-router';

// Sub Components
import StatusHeader from '../components/home/StatusHeader.vue';
import CharacterVisualizer from '../components/home/CharacterVisualizer.vue';
import HomePanelModal from '../components/home/HomePanelModal.vue';
import XianxiaIcon from '../components/shared/XianxiaIcon.vue';
import InkPanel from '../components/shared/InkPanel.vue';
import SpiritButton from '../components/shared/SpiritButton.vue';

// Panels
import PlayerStatsPanel from '../components/home/panels/PlayerStatsPanel.vue';
import SkillPanel from '../components/home/panels/SkillPanel.vue';
import LogPanel from '../components/home/panels/LogPanel.vue';
import SpiritRootPanel from '../components/home/panels/SpiritRootPanel.vue';
import SettingsPanel from '../components/home/panels/SettingsPanel.vue';
import ForgePanel from '../components/home/panels/ForgePanel.vue';

// Assets
import breakthroughBg from '@/assets/ui/ui_btn_breakthrough.png';

const playerStore = usePlayerStore();
const { addToast } = useToast();
const router = useRouter();

// --- STATE ---
const recentLogs = ref<string[]>(['[系统] 欢迎来到修真世界...']);
const activePanel = ref<string | null>(null);

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

// Efficiency display
const efficiencyText = computed(() => `修炼效率: +${playerStore.cultivationRate}/秒`);

// --- MENU CONFIG ---
// --- MENU CONFIG ---
// Filtered main items for the Dock
const menuItems = computed(() => [
    { id: 'stats', label: '属性', icon: 'ui_stat_atk', fallback: '📊' },
    // { id: 'skills', label: '神通', icon: 'ui_stat_mp', fallback: '⚡' },
    { id: 'roots', label: '灵根', icon: 'ui_bg_mandala', fallback: '🌱' },
    { id: 'forge', label: '炼器', icon: 'ui_icon_furnace', fallback: '🔥' },
    { id: 'settings', label: '设置', icon: 'ui_nav_abode', fallback: '⚙️' },
]);

// --- PANEL LOGIC ---
const activePanelTitle = computed(() => {
    switch(activePanel.value) {
        case 'stats': return '角色属性';
        case 'skills': return '神通秘术';
        case 'roots': return '五行灵根';
        case 'logs': return '修真日志';
        case 'settings': return '系统设置';
        default: return '';
    }
});

const activePanelComponent = computed(() => {
    switch(activePanel.value) {
        case 'stats': return PlayerStatsPanel;
        case 'skills': return SkillPanel;
        case 'roots': return SpiritRootPanel;
        case 'logs': return LogPanel;
        case 'settings': return SettingsPanel;
        case 'forge': return ForgePanel;
        default: return null;
    }
});

const activePanelProps = computed(() => {
    switch(activePanel.value) {
        case 'stats': return { stats: stats.value, equipment: playerStore.player.equipment, spiritRoot: playerStore.player.spiritRoot };
        case 'roots': return { roots: playerStore.player.spiritRoot };
        case 'logs': return { logs: recentLogs.value };
        default: return {};
    }
});

function handleMenuSelect(id: string) {
    if (id === 'bag') {
        router.push('/inventory');
        return;
    }
    // Placeholder feedback for unconnected items
    if (id === 'steps') {
        addToast('功法系统暂未开放', 'info');
        return;
    }
    activePanel.value = id;
}

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
  
  recentLogs.value.unshift(msg);
  if (recentLogs.value.length > 20) recentLogs.value.pop();
}

// --- BREAKTHROUGH LOGIC (Ported) ---
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
    addToast(result.message, 'success', 5000);
  } else {
    addToast(result.message, 'error', 5000);
  }
}

import { useModal } from '../composables/useModal';

function confirmReset() {
  const { showModal } = useModal();
  showModal({
    title: '兵解重修',
    content: '道友确定要放弃当前修为，重新来过吗？此操作无法撤销。',
    showCancel: true,
    onConfirm: () => {
      playerStore.reset();
      activePanel.value = null;
    }
  });
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
</style>
