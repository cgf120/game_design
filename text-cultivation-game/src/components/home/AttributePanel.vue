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
</template>

<script setup lang="ts">
import type { PlayerStats } from '../../core/models/player';

defineProps<{
    stats: PlayerStats
}>();
</script>
