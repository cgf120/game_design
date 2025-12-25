<template>
  <InkPanel class="mx-2 mt-2 p-3 mb-1 bg-neutral-900/90 relative z-20 rounded shadow-lg flex justify-between items-center" :decorated="true">
    <!-- Left: Avatar + Basic Info -->
    <div class="flex items-center gap-3">
        <!-- Avatar Frame -->
        <div class="relative w-12 h-12 border border-amber-900/50 bg-black p-0.5 rounded-sm overflow-hidden box-glow shrink-0">
            <XianxiaIcon src="ui_avatar_default" fallback="👤" size="full" />
            <div class="absolute inset-0 border border-white/5 pointer-events-none"></div>
        </div>
        
        <!-- Info -->
        <div class="flex flex-col justify-center gap-0.5">
            <div class="flex items-baseline gap-2">
                <span class="text-amber-500 font-bold text-lg tracking-widest text-glow-gold">{{ name }}</span>
                <span class="text-[10px] bg-amber-900/20 px-1.5 py-0.5 border border-amber-900/30 rounded text-amber-100/80 tracking-wide transform translate-y-[-1px]">
                    {{ realmName }}
                </span>
            </div>
            <div class="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                <span class="text-amber-700/80">战力 <span class="text-amber-600 font-bold ml-0.5">{{ combatPower }}</span></span>
                <span class="text-neutral-700 mx-1">|</span>
                <span class="text-neutral-500">寿元 {{ hp }}/{{ maxHp }}</span>
            </div>
        </div>
    </div>

    <!-- Right: Quick Resources -->
    <div class="flex flex-col items-end gap-1.5">
        <div class="flex items-center gap-1.5 text-jade text-sm font-bold text-glow-jade select-none bg-black/40 px-2 py-1 rounded border border-green-900/30" title="灵石">
            <XianxiaIcon src="ui_stat_spiritstone" fallback="💎" size="xs" />
            <span class="font-mono">{{ spiritStones }}</span>
        </div>
        <div class="text-[10px] text-neutral-600 font-mono tracking-widest">
            道历 <span class="text-neutral-400">{{ day }}</span> 年
        </div>
    </div>
  </InkPanel>
</template>

<script setup lang="ts">
import InkPanel from '../shared/InkPanel.vue';
import XianxiaIcon from '../shared/XianxiaIcon.vue';

defineProps<{
    name: string;
    realmName: string;
    combatPower: number;
    hp: number;
    maxHp: number;
    spiritStones: number;
    day: number;
}>();
</script>
