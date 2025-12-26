<template>
    <!-- 4. BOTTOM DOCK (Fixed) -->
    <div class="absolute bottom-4 left-4 right-4 h-16 bg-neutral-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-50 flex items-center justify-around px-2">
         <button 
            v-for="item in menuItems" 
            :key="item.id"
            @click="$emit('select', item.id)"
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
</template>

<script setup lang="ts">
import XianxiaIcon from '../shared/XianxiaIcon.vue';

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    fallback: string;
}

defineProps<{
    menuItems: MenuItem[];
    activePanel: string | null;
}>();

defineEmits<{
    (e: 'select', id: string): void
}>();
</script>
