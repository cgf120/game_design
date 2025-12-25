<template>
  <InkPanel class="w-full flex items-center justify-between p-2 mb-2 bg-neutral-900/90 relative z-20" :decorated="true">
    <!-- Left: Avatar + Basic Info -->
    <div class="flex items-center gap-3">
        <!-- Avatar Frame -->
        <div class="relative w-12 h-12 border border-amber-900/50 bg-black p-0.5 rounded-sm overflow-hidden box-glow">
            <XianxiaIcon src="ui_avatar_default" fallback="👤" size="full" />
            <div class="absolute inset-0 border border-white/5 pointer-events-none"></div>
        </div>
        
        <!-- Info -->
        <div class="flex flex-col justify-center">
            <div class="flex items-center gap-2">
                <span class="text-amber-500 font-bold text-sm tracking-widest text-glow-gold">{{ name }}</span>
                <span class="text-[10px] bg-amber-900/20 px-1 border border-amber-900/30 rounded text-amber-200/80">
                    {{ realmName }}
                </span>
            </div>
            <div class="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500">
                <span class="font-mono text-amber-600">战力 {{ combatPower }}</span>
                <span>|</span>
                <span>寿元 {{ hp }}/{{ maxHp }}</span>
            </div>
        </div>
    </div>

    <!-- Right: Quick Resources -->
    <div class="flex flex-col items-end gap-1">
        <div class="flex items-center gap-1 text-jade text-xs text-glow-jade select-none" title="灵石">
            <XianxiaIcon src="ui_stat_spiritstone" fallback="💎" size="xs" />
            <span class="font-mono">{{ spiritStones }}</span>
        </div>
        <!-- Settings / Notification / Extra placeholder -->
         <div class="flex gap-2">
             <!-- Could place small system icons here -->
             <div class="text-[10px] text-neutral-600">道历 {{ day }} 年</div>
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
