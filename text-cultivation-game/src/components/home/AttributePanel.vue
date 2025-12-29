<template>
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

        <div class="relative p-4 space-y-6">
            <!-- 1. VITALS (HP/MP) -->
            <div class="grid grid-cols-2 gap-6">
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

            <!-- 2. COMBAT STATS -->
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

            <!-- 3. EQUIPMENT SECTION -->
            <div>
                <div class="mb-3 text-center text-neutral-600 text-[10px] tracking-widest flex items-center gap-2">
                    <div class="h-px bg-neutral-800 flex-1"></div>
                    <span>本命法宝</span>
                    <div class="h-px bg-neutral-800 flex-1"></div>
                </div>
                <div class="space-y-2">
                    <!-- WEAPON -->
                    <div 
                        @click="toggleSlot('weapon')"
                        class="flex justify-between items-center bg-black/40 p-2 border border-neutral-800 rounded-sm cursor-pointer hover:border-amber-900/50 hover:bg-neutral-900/50 transition-colors"
                        :class="{ 'border-amber-500/50 bg-amber-900/10': activeSlot === 'weapon' }"
                    >
                        <span class="text-neutral-500 flex items-center gap-2">
                            <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-amber-700/70">武</div>
                            <span class="text-xs">武器</span>
                        </span>
                        <div class="flex items-center gap-1">
                            <span class="text-amber-600 text-xs font-medium">{{ getEquipName(equipment?.weapon) }}</span>
                            <span v-if="equipment?.weapon" class="text-neutral-600 text-[10px] transform transition-transform" :class="activeSlot === 'weapon' ? 'rotate-90' : ''">▶</span>
                        </div>
                    </div>
                    <!-- Weapon Detail -->
                    <div v-if="activeSlot === 'weapon' && equipment?.weapon" class="bg-black/60 border-x border-b border-neutral-800 p-2 text-xs -mt-1 mx-1 mb-2">
                        <div class="text-[10px] text-neutral-400 mb-2 leading-relaxed italic">{{ getItem(getEquipId(equipment?.weapon)!)?.desc }}</div>
                        <div class="space-y-1 font-mono">
                            <div v-for="stat in getItemStatsList(equipment?.weapon)" :key="stat.label" class="flex justify-between border-b border-white/5 pb-0.5">
                                <span class="text-neutral-500">{{ stat.label }}</span>
                                <span :class="stat.color">{{ stat.value }}</span>
                            </div>
                        </div>
                        <div v-if="getItem(getEquipId(equipment?.weapon)!)?.gemSlots" class="mt-2 pt-2 border-t border-white/5 flex gap-2">
                            <div class="text-[10px] text-neutral-500">孔位:</div>
                            <div class="flex gap-1">
                                <div v-for="n in (getItem(getEquipId(equipment?.weapon)!)?.gemSlots || 0)" :key="n" class="w-4 h-4 bg-black border border-neutral-800 rounded-full flex items-center justify-center">
                                    <XianxiaIcon v-if="equipment.weapon.instanceData?.gems?.[n-1]" :src="getItem(equipment.weapon.instanceData.gems[n-1])?.icon" fallback="💎" size="xs" />
                                    <span v-else class="text-neutral-800 text-[8px]">+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ARMOR -->
                    <div 
                        @click="toggleSlot('armor')"
                        class="flex justify-between items-center bg-black/40 p-2 border border-neutral-800 rounded-sm cursor-pointer hover:border-blue-900/50 hover:bg-neutral-900/50 transition-colors"
                        :class="{ 'border-blue-500/50 bg-blue-900/10': activeSlot === 'armor' }"
                    >
                        <span class="text-neutral-500 flex items-center gap-2">
                            <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-blue-700/70">甲</div>
                            <span class="text-xs">衣袍</span>
                        </span>
                        <div class="flex items-center gap-1">
                            <span class="text-blue-600 text-xs font-medium">{{ getEquipName(equipment?.armor) }}</span>
                            <span v-if="equipment?.armor" class="text-neutral-600 text-[10px] transform transition-transform" :class="activeSlot === 'armor' ? 'rotate-90' : ''">▶</span>
                        </div>
                    </div>
                    <!-- Armor Detail -->
                    <div v-if="activeSlot === 'armor' && equipment?.armor" class="bg-black/60 border-x border-b border-neutral-800 p-2 text-xs -mt-1 mx-1 mb-2">
                        <div class="text-[10px] text-neutral-400 mb-2 leading-relaxed italic">{{ getItem(getEquipId(equipment?.armor)!)?.desc }}</div>
                        <div class="space-y-1 font-mono">
                            <div v-for="stat in getItemStatsList(equipment?.armor)" :key="stat.label" class="flex justify-between border-b border-white/5 pb-0.5">
                                <span class="text-neutral-500">{{ stat.label }}</span>
                                <span :class="stat.color">{{ stat.value }}</span>
                            </div>
                        </div>
                        <div v-if="getItem(getEquipId(equipment?.armor)!)?.gemSlots" class="mt-2 pt-2 border-t border-white/5 flex gap-2">
                            <div class="text-[10px] text-neutral-500">孔位:</div>
                            <div class="flex gap-1">
                                <div v-for="n in (getItem(getEquipId(equipment?.armor)!)?.gemSlots || 0)" :key="n" class="w-4 h-4 bg-black border border-neutral-800 rounded-full flex items-center justify-center">
                                    <XianxiaIcon v-if="equipment.armor.instanceData?.gems?.[n-1]" :src="getItem(equipment.armor.instanceData.gems[n-1])?.icon" fallback="💎" size="xs" />
                                    <span v-else class="text-neutral-800 text-[8px]">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ACCESSORY -->
                    <div 
                        @click="toggleSlot('accessory')"
                        class="flex justify-between items-center bg-black/40 p-2 border border-neutral-800 rounded-sm cursor-pointer hover:border-purple-900/50 hover:bg-neutral-900/50 transition-colors"
                        :class="{ 'border-purple-500/50 bg-purple-900/10': activeSlot === 'accessory' }"
                    >
                        <span class="text-neutral-500 flex items-center gap-2">
                            <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-purple-700/70">宝</div>
                            <span class="text-xs">法器</span>
                        </span>
                        <div class="flex items-center gap-1">
                            <span class="text-purple-600 text-xs font-medium">{{ getEquipName(equipment?.accessory) }}</span>
                            <span v-if="equipment?.accessory" class="text-neutral-600 text-[10px] transform transition-transform" :class="activeSlot === 'accessory' ? 'rotate-90' : ''">▶</span>
                        </div>
                    </div>
                    <!-- Accessory Detail -->
                    <div v-if="activeSlot === 'accessory' && equipment?.accessory" class="bg-black/60 border-x border-b border-neutral-800 p-2 text-xs -mt-1 mx-1 mb-2">
                        <div class="text-[10px] text-neutral-400 mb-2 leading-relaxed italic">{{ getItem(getEquipId(equipment?.accessory)!)?.desc }}</div>
                        <div class="space-y-1 font-mono">
                            <div v-for="stat in getItemStatsList(equipment?.accessory)" :key="stat.label" class="flex justify-between border-b border-white/5 pb-0.5">
                                <span class="text-neutral-500">{{ stat.label }}</span>
                                <span :class="stat.color">{{ stat.value }}</span>
                            </div>
                        </div>
                        <div v-if="getItem(getEquipId(equipment?.accessory)!)?.gemSlots" class="mt-2 pt-2 border-t border-white/5 flex gap-2">
                            <div class="text-[10px] text-neutral-500">孔位:</div>
                            <div class="flex gap-1">
                                <div v-for="n in (getItem(getEquipId(equipment?.accessory)!)?.gemSlots || 0)" :key="n" class="w-4 h-4 bg-black border border-neutral-800 rounded-full flex items-center justify-center">
                                    <XianxiaIcon v-if="equipment.accessory.instanceData?.gems?.[n-1]" :src="getItem(equipment.accessory.instanceData.gems[n-1])?.icon" fallback="💎" size="xs" />
                                    <span v-else class="text-neutral-800 text-[8px]">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. SPIRIT ROOTS -->
            <div>
                <div class="mb-3 text-center text-neutral-600 text-[10px] tracking-widest flex items-center gap-2">
                    <div class="h-px bg-neutral-800 flex-1"></div>
                    <span>五行灵根</span>
                    <div class="h-px bg-neutral-800 flex-1"></div>
                </div>
                <div class="flex justify-between px-2 text-center bg-neutral-900/30 p-2 rounded border border-neutral-800/50">
                    <div class="flex flex-col gap-1">
                        <span class="text-yellow-700/80 font-bold text-xs">金</span>
                        <span class="text-neutral-500 font-mono text-xs">{{ spiritRoot?.metal || 0 }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-green-700/80 font-bold text-xs">木</span>
                        <span class="text-neutral-500 font-mono text-xs">{{ spiritRoot?.wood || 0 }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-blue-700/80 font-bold text-xs">水</span>
                        <span class="text-neutral-500 font-mono text-xs">{{ spiritRoot?.water || 0 }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-red-700/80 font-bold text-xs">火</span>
                        <span class="text-neutral-500 font-mono text-xs">{{ spiritRoot?.fire || 0 }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-amber-800/80 font-bold text-xs">土</span>
                        <span class="text-neutral-500 font-mono text-xs">{{ spiritRoot?.earth || 0 }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PlayerStats } from '../../core/models/player';
import { getItem } from '../../core/constants/items';
import { getItemStatsList } from '../../core/utils/item';
import XianxiaIcon from '../shared/XianxiaIcon.vue';
import type { InventorySlot } from '../../core/models/item';

const props = defineProps<{
    stats: PlayerStats;
    equipment: any;
    spiritRoot: any;
}>();

const activeSlot = ref<'weapon' | 'armor' | 'accessory' | null>(null);

function getEquipId(data?: string | InventorySlot): string | undefined {
    if (!data) return undefined;
    if (typeof data === 'object' && 'itemId' in data) return data.itemId;
    return data as string;
}

function getEquipName(data?: string | InventorySlot) {
    const id = getEquipId(data);
    if (!id) return '空';
    return getItem(id)?.name || '未知';
}

function toggleSlot(slot: 'weapon' | 'armor' | 'accessory') {
    if (!props.equipment || !props.equipment[slot] || props.equipment[slot] === 'empty') return;
    
    // Explicitly check if the slot has a valid item ID, simple 'empty' check on string might be insufficient if logic changed
    const id = getEquipId(props.equipment[slot]);
    if (!id) return;
    
    if (activeSlot.value === slot) {
        activeSlot.value = null;
    } else {
        activeSlot.value = slot;
    }
}
</script>
