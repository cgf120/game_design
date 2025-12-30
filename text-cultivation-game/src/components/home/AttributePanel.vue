<template>
    <!-- 3.1 ATTRIBUTE PANEL (Premium Jade Slip Style - Compact) -->
    <div class="mx-4 relative group my-2 shrink-0">
        <!-- SCROLL HEADER (Top Axis) -->
        <div class="h-3 bg-neutral-800 rounded-t-sm relative border-b border-neutral-950 shadow-lg mx-1 z-0">
             <div class="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-900 rounded-l border-r border-amber-950 shadow-md"></div>
             <div class="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-900 rounded-r border-l border-amber-950 shadow-md"></div>
             <div class="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20"></div>
        </div>

        <!-- MAIN SCROLL BODY -->
        <div class="relative bg-[#111] border-x border-neutral-800 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-10 bg-[url('@/assets/ui/bg_texture_paper.png')] bg-repeat text-neutral-200">
             <!-- Corner Decorations -->
            <div class="absolute top-0 left-0 w-6 h-6 border-t border-l border-amber-700/50 rounded-tl pointer-events-none"></div>
            <div class="absolute top-0 right-0 w-6 h-6 border-t border-r border-amber-700/50 rounded-tr pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-amber-700/50 rounded-bl pointer-events-none"></div>
            <div class="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-amber-700/50 rounded-br pointer-events-none"></div>

            <div class="flex gap-4 relative z-10 h-full">
                <!-- LEFT: Stats & Vitals (60%) -->
                <div class="flex-1 flex flex-col gap-3 min-w-0">
                    <!-- 1. VITALS -->
                    <div class="space-y-2">
                        <!-- HP -->
                        <div class="relative bg-black/40 px-2 py-1.5 rounded border border-neutral-800/50">
                            <div class="flex justify-between items-end mb-1">
                                <span class="text-[10px] text-neutral-500 font-serif">气血</span>
                                <span class="font-mono text-[10px] text-red-200 font-bold leading-none">{{ formatNumber(stats.hp) }}/{{ formatNumber(stats.maxHp) }}</span>
                            </div>
                            <div class="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                <div class="h-full bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.6)]" :style="{ width: `${(stats.hp / stats.maxHp) * 100}%` }"></div>
                            </div>
                        </div>
                         <!-- MP -->
                        <div class="relative bg-black/40 px-2 py-1.5 rounded border border-neutral-800/50">
                            <div class="flex justify-between items-end mb-1">
                                <span class="text-[10px] text-neutral-500 font-serif">灵力</span>
                                <span class="font-mono text-[10px] text-blue-200 font-bold leading-none">{{ formatNumber(stats.mp) }}/{{ formatNumber(stats.maxMp) }}</span>
                            </div>
                            <div class="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                <div class="h-full bg-sky-600 rounded-full shadow-[0_0_8px_rgba(2,132,199,0.6)]" :style="{ width: `${(stats.mp / stats.maxMp) * 100}%` }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. COMBAT STATS (Grid) -->
                    <div class="grid grid-cols-2 gap-2 mt-auto">
                         <div class="bg-black/20 p-1.5 rounded border border-white/5 flex items-center justify-between">
                            <span class="text-[9px] text-neutral-600">攻</span>
                            <span class="text-amber-500 font-mono font-bold text-xs">{{ formatNumber(stats.atk) }}</span>
                         </div>
                         <div class="bg-black/20 p-1.5 rounded border border-white/5 flex items-center justify-between">
                            <span class="text-[9px] text-neutral-600">防</span>
                            <span class="text-blue-400 font-mono font-bold text-xs">{{ formatNumber(stats.def) }}</span>
                         </div>
                         <div class="bg-black/20 p-1.5 rounded border border-white/5 flex items-center justify-between">
                            <span class="text-[9px] text-neutral-600">暴</span>
                            <span class="text-purple-400 font-mono font-bold text-xs">{{ (stats.critRate * 100).toFixed(0) }}%</span>
                         </div>
                         <div class="bg-black/20 p-1.5 rounded border border-white/5 flex items-center justify-between">
                            <span class="text-[9px] text-neutral-600">闪</span>
                            <span class="text-white/60 font-mono font-bold text-xs">{{ (stats.dodgeRate * 100).toFixed(0) }}%</span>
                         </div>
                    </div>
                </div>

                <!-- RIGHT: Spirit Roots (40%) -->
                <div class="w-32 shrink-0 flex flex-col items-center justify-center bg-black/20 rounded border border-white/5 p-2 relative overflow-hidden">
                     <span class="absolute top-1 left-2 text-[9px] text-neutral-600 font-serif z-10">五行</span>
                     <SpiritRootChart :roots="spiritRoot" class="w-28 h-28" />
                </div>
            </div>
        </div>

        <!-- SCROLL FOOTER (Bottom Axis) -->
        <div class="h-3 bg-neutral-800 rounded-b-sm relative border-t border-neutral-950 shadow-lg mx-1 z-0">
             <div class="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-900 rounded-l border-r border-amber-950 shadow-md"></div>
             <div class="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-900 rounded-r border-l border-amber-950 shadow-md"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PlayerStats, SpiritRoot } from '../../core/models/player';
import SpiritRootChart from '../shared/SpiritRootChart.vue';

const props = defineProps<{
    stats: PlayerStats;
    spiritRoot: SpiritRoot;
}>();

function formatNumber(num: number): string {
    if (num >= 100000) {
        return (num / 10000).toFixed(1) + 'w';
    }
    return Math.floor(num).toString();
}
</script>
