<template>
  <div class="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-sm overflow-hidden flex flex-col relative text-sm select-none shadow-2xl font-serif">
    <!-- 1. Header: Name & Quality -->
    <div class="relative px-3 py-2 border-b border-[#3a3a3a] bg-gradient-to-r from-black/80 via-[#2a2a2a] to-black/80 flex justify-between items-baseline">
      <div 
        class="text-lg font-bold tracking-wider drop-shadow-md"
        :class="qualityColor"
      >
        {{ item.name }}
        <span class="text-xs font-normal opacity-80 decoration-transparent ml-1">
             {{ qualityLabel ? `【${qualityLabel}】` : '' }}
        </span>
      </div>
      <div class="text-[10px] text-neutral-500 font-mono tracking-tighter">
        {{ typeLabel }}
      </div>
    </div>

    <!-- 2. Main Info: Icon & Basic Properties -->
    <div class="p-3 flex gap-4 bg-[#151515] relative group">
        <!-- Icon Box -->
        <div class="relative w-16 h-16 shrink-0 border border-[#444] bg-[#0a0a0a] flex items-center justify-center shadow-inner">
             <XianxiaIcon 
                :src="item.icon || ''" 
                :fallback="item.type === 'equipment' ? '⚔️' : '📦'"
                size="lg"
                class="scale-90 group-hover:scale-100 transition-transform duration-300"
                :glow="true"
            />
            <!-- Quality Frame Overlay -->
             <div class="absolute inset-0 border-[2px] opacity-50" :class="qualityBorder"></div>
             <!-- Enhancement Level (Top Left) -->
             <div v-if="instanceLevel > 0" class="absolute top-0 left-0 bg-red-900/80 text-[9px] text-white px-1 leading-tight border-r border-b border-white/10 shadow">
                 +{{ instanceLevel }}
             </div>
        </div>

        <!-- Info List -->
        <div class="flex-1 flex flex-col justify-between text-xs leading-relaxed">
            <div class="flex justify-between">
                <span class="text-[#a0a0a0]">等级需求</span>
                <span class="text-white font-mono">{{ realmRequirement }}</span>
            </div>
            
             <div v-if="isBound" class="flex justify-start text-red-500/80 font-bold">
                【已绑定】
            </div>
            <div v-else class="flex justify-start text-green-500/80">
                【可交易】
            </div>

             <div class="flex justify-between items-end mt-auto">
                <span class="text-[#a0a0a0]">出售价格</span>
                <div class="flex items-center gap-1">
                    <XianxiaIcon src="ui_stat_spiritstone" fallback="🪙" size="xs" />
                    <span class="text-white/90 font-mono">{{ item.salePrice || 0 }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. Attributes (Equipment Only) -->
    <div v-if="item.type === 'equipment'" class="px-3 py-2 bg-[#181818] border-t border-[#2a2a2a] space-y-3">
        
        <!-- Base Stats -->
        <div class="space-y-1">
            <div class="text-[#c7b299] font-bold text-xs mb-1 flex items-center gap-1">
                <span class="w-1 h-3 bg-[#c7b299]"></span> 基础属性
            </div>
            <div v-for="(val, key) in baseStats" :key="key" class="flex items-center justify-between text-xs pl-2">
                <span class="text-[#888]">{{ getStatLabel(String(key)) }}</span>
                <span class="text-white font-mono tracking-wide">{{ formatStatValue(String(key), Number(val)) }}</span>
            </div>
        </div>

        <!-- Enhancement Stats (Mock Visuals for layout) -->
        <div v-if="instanceLevel > 0" class="space-y-1">
             <div class="text-[#d4b95e] font-bold text-xs mb-1 flex items-center gap-1">
                <span class="w-1 h-3 bg-[#d4b95e]"></span> 强化属性 [+{{ instanceLevel }}]
            </div>
            <!-- Mock enhancement blocks -->
            <div class="flex gap-0.5 mb-1 px-2">
                <div v-for="n in 10" :key="n" 
                    class="w-2 h-2 border border-[#444] rounded-[1px]"
                    :class="n <= instanceLevel ? 'bg-[#d4b95e] shadow-[0_0_4px_rgba(212,185,94,0.5)]' : 'bg-[#111]'"
                ></div>
            </div>
             <!-- Just display a consolidated enhancement bonus for now since we don't have per-stat logic yet -->
            <div class="flex items-center justify-between text-xs pl-2">
                <span class="text-[#888]">全属性提升</span>
                <span class="text-[#d4b95e] font-mono tracking-wide">+{{ (instanceLevel * 5) }}%</span>
            </div>
        </div>

        <!-- Sockets / Gems -->
        <div v-if="maxSockets > 0" class="space-y-1 pt-1">
             <div class="text-[#5ebad4] font-bold text-xs mb-1 flex items-center gap-1">
                <span class="w-1 h-3 bg-[#5ebad4]"></span> 镶嵌孔位
            </div>
            <div class="flex gap-2 pl-2">
                <div v-for="n in maxSockets" :key="n" 
                     class="w-6 h-6 border border-[#333] bg-[#080808] flex items-center justify-center relative shadow-inner"
                >
                    <!-- Mock Gem Logic: If index < gems.length -->
                    <XianxiaIcon v-if="n <= (instance?.instanceData?.gems?.length || 0)" src="mat_essence" size="sm" :glow="true" />
                    <span v-else class="text-[#222] text-[8px]">●</span>
                </div>
            </div>
        </div>
        
    </div>

    <!-- 4. Description / Flavor Text -->
    <div class="p-3 bg-[#111] text-xs text-[#666] italic leading-relaxed border-t border-[#2a2a2a] min-h-[60px]">
        “{{ item.desc }}”
    </div>

    <!-- 5. Footer: Combat Power -->
    <div v-if="item.type === 'equipment'" class="px-3 py-2 bg-black border-t border-[#2a2a2a] flex justify-between items-center">
        <span class="text-[#a0a0a0] text-xs">装备评分</span>
        <span class="text-[#ffb74d] font-bold font-mono text-sm">{{ combatPower }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Item, InventorySlot } from '../../core/models/item';
import XianxiaIcon from './XianxiaIcon.vue';
import { getItemQuality, QUALITY_TIERS } from '../../core/utils/item';

const props = defineProps<{
    item: Item;
    instance?: InventorySlot | null; // Optional, for instance data
}>();

// --- Computed Helpers ---

const quality = computed(() => {
    if (props.instance) {
        return getItemQuality(props.instance);
    }
    // Fallback based on item ID suffix if just viewing base definition is needed (rare case)
    if (props.item.id.includes('_legend')) return QUALITY_TIERS.godly;
    if (props.item.id.includes('_epic')) return QUALITY_TIERS.peerless;
    if (props.item.id.includes('_rare')) return QUALITY_TIERS.superior;
    if (props.item.id.includes('_uncommon')) return QUALITY_TIERS.good;
    return QUALITY_TIERS.common;
});

const qualityColor = computed(() => quality.value.color || 'text-neutral-400');
const qualityLabel = computed(() => quality.value.label || '');
const qualityBorder = computed(() => {
   // Check based on standard tiers or label
   if (quality.value === QUALITY_TIERS.godly) return 'border-red-500';
   if (quality.value === QUALITY_TIERS.peerless) return 'border-orange-500';
   if (quality.value === QUALITY_TIERS.superior) return 'border-blue-500';
   if (quality.value === QUALITY_TIERS.good) return 'border-emerald-500';
   return 'border-neutral-700';
});

const typeLabel = computed(() => {
    const map: Record<string, string> = {
        equipment: '法宝',
        material: '材料',
        consumable: '丹药'
    };
    return map[props.item.type] || '物品';
});

const isBound = computed(() => false); // Mock binding logic

const realmRequirement = computed(() => {
    // Extract realm info from ID or name logic if possible. 
    // Current system is loose, let's just infer from item ID 'eq_REALMID_...'
    const parts = props.item.id.split('_');
    if (parts[1] && !isNaN(parseInt(parts[1]))) {
// Simple map for display
        const rNames = ['练气','筑基','金丹','元婴','化神','炼虚','合体','大乘'];
        const rid = parseInt(parts[1]);
        return rNames[rid-1] ? `${rNames[rid-1]}期` : '无限制';
    }
    return '无限制';
});

const instanceLevel = computed(() => props.instance?.instanceData?.level || 0);

const startStats = computed(() => {
    if (props.instance?.instanceData?.stats) {
        return props.instance.instanceData.stats;
    }
    // Only ranges exist on base item, take min as visible default if no instance
    const res: any = {};
    if (props.item.statsRange) {
        for (const k in props.item.statsRange) {
            // @ts-ignore
            res[k] = props.item.statsRange[k][0]; 
        }
    }
    return res;
});

const baseStats = computed(() => startStats.value);

const maxSockets = computed(() => props.item.gemSlots || 0);

// Simple CP estimation
const combatPower = computed(() => {
    let score = 0;
    const s = baseStats.value;
    if (s.atk) score += s.atk;
    if (s.hp) score += s.hp / 10;
    if (s.def) score += s.def;
    if (s.critRate) score += s.critRate * 1000;
    
    // Enhancement bonus
    score *= (1 + instanceLevel.value * 0.05);
    
    return Math.floor(score);
});

function getStatLabel(key: string) {
    const map: Record<string, string> = {
        atk: '攻击力',
        def: '防御力',
        hp: '气血',
        mp: '灵力',
        spd: '身法',
        critRate: '暴击率',
        dodgeRate: '闪避率'
    };
    return map[key] || key;
}

function formatStatValue(key: string, val: number) {
    if (['critRate', 'dodgeRate'].includes(key)) {
        return `+${(val * 100).toFixed(0)}%`;
    }
    return `+${val}`;
}

</script>
