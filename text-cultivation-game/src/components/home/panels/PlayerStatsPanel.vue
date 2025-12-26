<template>
  <div class="space-y-4 p-2 text-xs">
    <!-- Main Attributes -->
    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <XianxiaIcon src="ui_stat_atk" fallback="🗡️" size="xs" />
                <span>攻击</span>
            </div>
            <span class="text-amber-600 font-mono">{{ stats.atk }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <XianxiaIcon src="ui_stat_def" fallback="🛡️" size="xs" />
                <span>防御</span>
            </div>
            <span class="text-blue-600 font-mono">{{ stats.def }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <XianxiaIcon src="ui_stat_hp" fallback="❤️" size="xs" />
                <span>气血</span>
            </div>
            <span class="text-neutral-300 font-mono">{{ Math.floor(stats.hp) }}/{{ stats.maxHp }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <XianxiaIcon src="ui_stat_mp" fallback="💧" size="xs" />
                <span>灵力</span>
            </div>
            <span class="text-sky-600 font-mono">{{ Math.floor(stats.mp) }}/{{ stats.maxMp }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <span class="text-lg leading-none">⚡</span>
                <span>暴击</span>
            </div>
            <span class="text-neutral-400 font-mono">{{ (stats.critRate * 100).toFixed(1) }}%</span>
        </div>
    </div>

    <!-- Equipment Section -->
    <div>
        <div class="mt-4 mb-2 text-center text-neutral-600 text-[10px] tracking-widest flex items-center gap-2">
            <div class="h-px bg-neutral-800 flex-1"></div>
            <span>本命法宝</span>
            <div class="h-px bg-neutral-800 flex-1"></div>
        </div>
        <div class="space-y-1">
            <!-- WEAPON -->
            <div 
                @click="toggleSlot('weapon')"
                class="flex justify-between items-center bg-black p-2 border border-neutral-800 rounded-sm cursor-pointer hover:border-amber-900/50 hover:bg-neutral-900/50 transition-colors"
                :class="{ 'border-amber-500/50 bg-amber-900/10': activeSlot === 'weapon' }"
            >
                <span class="text-neutral-500 flex items-center gap-2">
                     <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs">武</div>
                     <span>武器</span>
                </span>
                <div class="flex items-center gap-1">
                    <span class="text-amber-700">{{ getEquipName(equipment?.weapon) }}</span>
                    <span v-if="equipment?.weapon" class="text-neutral-600 text-[10px] transform transition-transform" :class="activeSlot === 'weapon' ? 'rotate-90' : ''">▶</span>
                </div>
            </div>
            <!-- Weapon Detail -->
            <div v-if="activeSlot === 'weapon' && equipment?.weapon" class="bg-black/40 border-x border-b border-neutral-800 p-2 mb-2 text-xs">
                <div class="text-[10px] text-neutral-400 mb-1 leading-relaxed">{{ getItem(getEquipId(equipment?.weapon)!)?.desc }}</div>
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
                class="flex justify-between items-center bg-black p-2 border border-neutral-800 rounded-sm cursor-pointer hover:border-blue-900/50 hover:bg-neutral-900/50 transition-colors"
                :class="{ 'border-blue-500/50 bg-blue-900/10': activeSlot === 'armor' }"
            >
                <span class="text-neutral-500 flex items-center gap-2">
                     <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs">甲</div>
                     <span>衣袍</span>
                </span>
                <div class="flex items-center gap-1">
                     <span class="text-blue-700">{{ getEquipName(equipment?.armor) }}</span>
                     <span v-if="equipment?.armor" class="text-neutral-600 text-[10px] transform transition-transform" :class="activeSlot === 'armor' ? 'rotate-90' : ''">▶</span>
                </div>
            </div>
            <!-- Armor Detail -->
            <div v-if="activeSlot === 'armor' && equipment?.armor" class="bg-black/40 border-x border-b border-neutral-800 p-2 mb-2 text-xs">
                <div class="text-[10px] text-neutral-400 mb-1 leading-relaxed">{{ getItem(getEquipId(equipment?.armor)!)?.desc }}</div>
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
                class="flex justify-between items-center bg-black p-2 border border-neutral-800 rounded-sm cursor-pointer hover:border-purple-900/50 hover:bg-neutral-900/50 transition-colors"
                :class="{ 'border-purple-500/50 bg-purple-900/10': activeSlot === 'accessory' }"
            >
                <span class="text-neutral-500 flex items-center gap-2">
                     <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs">宝</div>
                    <span>法器</span>
                </span>
                <div class="flex items-center gap-1">
                    <span class="text-purple-700">{{ getEquipName(equipment?.accessory) }}</span>
                    <span v-if="equipment?.accessory" class="text-neutral-600 text-[10px] transform transition-transform" :class="activeSlot === 'accessory' ? 'rotate-90' : ''">▶</span>
                </div>
            </div>
            <!-- Accessory Detail -->
             <div v-if="activeSlot === 'accessory' && equipment?.accessory" class="bg-black/40 border-x border-b border-neutral-800 p-2 mb-2 text-xs">
                <div class="text-[10px] text-neutral-400 mb-1 leading-relaxed">{{ getItem(getEquipId(equipment?.accessory)!)?.desc }}</div>
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

    <!-- Item Detail Inline Component -->
    <!-- Helper component to avoid repetition -->
    <!-- We will inline the v-if logic for simplicity -->



    <!-- Spirit Root -->
    <div>
        <div class="mt-4 mb-2 text-center text-neutral-600 text-[10px] tracking-widest flex items-center gap-2">
            <div class="h-px bg-neutral-800 flex-1"></div>
            <span>五行灵根</span>
            <div class="h-px bg-neutral-800 flex-1"></div>
        </div>
        <div class="flex justify-between px-2 text-center bg-neutral-900/50 p-2 rounded">
            <div class="flex flex-col gap-1">
                <span class="text-yellow-700 font-bold">金</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.metal }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-green-700 font-bold">木</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.wood }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-blue-700 font-bold">水</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.water }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-red-700 font-bold">火</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.fire }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-amber-800 font-bold">土</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.earth }}</span>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getItem } from '../../../core/constants/items';
import XianxiaIcon from '../../shared/XianxiaIcon.vue';
import type { InventorySlot } from '../../../core/models/item';
import { getItemStatsList } from '../../../core/utils/item';

const props = defineProps<{
    stats: any;
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
    if (!props.equipment || !props.equipment[slot]) return;
    
    if (activeSlot.value === slot) {
        activeSlot.value = null;
    } else {
        activeSlot.value = slot;
    }
}
</script>
