<template>
  <div class="h-full flex flex-col gap-2">
    <!-- Header visual or flavor text -->
    <div class="p-3 bg-neutral-900 border border-neutral-800 rounded mb-2 flex items-center gap-4">
         <XianxiaIcon src="ui_bg_mandala" fallback="🔮" size="lg" class="opacity-50" />
         <div class="text-xs text-neutral-400 leading-relaxed">
             <p>先天灵根，定修真之基。</p>
             <p>五行相生，生生不息。</p>
         </div>
    </div>

    <!-- Roots List -->
    <div class="space-y-3">
        <div 
            v-for="(value, type) in roots" 
            :key="type"
            class="relative"
        >
             <!-- Label & Value -->
            <div class="flex justify-between items-end mb-1 text-xs">
                <span 
                    class="font-bold tracking-widest uppercase"
                    :class="getElementColor(type)"
                >
                    {{ getElementName(type) }}灵根
                </span>
                <span class="font-mono text-neutral-500">{{ value }} / 100</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                <div 
                    class="h-full transition-all duration-500 ease-out"
                    :class="getElementBg(type)"
                    :style="{ width: `${Math.min(value, 100)}%` }"
                ></div>
            </div>
        </div>
    </div>
    
    <!-- Analysis (Mock) -->
    <div class="mt-auto pt-4 border-t border-amber-900/20">
        <h4 class="text-amber-500 text-sm font-bold mb-2">灵根评语</h4>
        <p class="text-xs text-neutral-500">
            {{ getAnalysis(roots as any) }}
        </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import XianxiaIcon from '../../shared/XianxiaIcon.vue';

interface SpiritRoot {
    metal: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
}

const props = defineProps<{
    roots: SpiritRoot;
}>();

function getElementName(type: string | number) {
    const map: Record<string, string> = {
        metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
    };
    return map[type as string] || type;
}

function getElementColor(type: string | number) {
    const map: Record<string, string> = {
        metal: 'text-yellow-200',
        wood: 'text-emerald-400',
        water: 'text-blue-400',
        fire: 'text-red-400',
        earth: 'text-amber-600'
    };
    return map[type as string] || 'text-neutral-400';
}

function getElementBg(type: string | number) {
    const map: Record<string, string> = {
        metal: 'bg-yellow-200 shadow-[0_0_10px_rgba(254,240,138,0.5)]',
        wood: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
        water: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
        fire: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
        earth: 'bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]'
    };
    return map[type as string] || 'bg-neutral-500';
}

function getAnalysis(roots: SpiritRoot) {
    // Simple mock analysis logic
    const values = Object.values(roots);
    const max = Math.max(...values);
    if (max < 20) return "资质平平，修仙之路恐多坎坷。";
    if (max > 80) return "天资卓越，乃是万中无一的修仙奇才！";
    return "灵根尚可，勤能补拙，亦可证得大道。";
}
</script>
