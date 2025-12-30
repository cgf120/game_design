<template>
  <div class="absolute inset-0 z-50 flex pointer-events-none" :class="variant === 'center' ? 'items-center justify-center' : 'flex-col justify-end pt-20'">
     <!-- Backdrop (Close on click) -->
     <div class="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity" @click="$emit('close')"></div>
     
     <!-- Panel Content -->
     <div 
        class="relative z-10 overflow-hidden pointer-events-auto flex flex-col max-h-[85vh] transition-all"
        :class="[
            variant === 'center' 
                ? 'w-[85%] max-w-sm animate-scale-in rounded-xl'
                : 'w-full rounded-t-xl animate-slide-up mt-auto',
            clean 
                ? '' // Clean mode: no bg, no border (inner content provides it)
                : 'bg-neutral-900 shadow-2xl ' + (variant === 'center' ? 'border border-amber-600/50' : 'border-t border-amber-900/50')
        ]"
        @click.stop
    >
        <!-- Floating Close (Clean Mode) -->
        <button 
            v-if="clean" 
            @click="$emit('close')" 
            class="absolute top-2 right-2 z-50 w-8 h-8 rounded-full bg-black/50 text-neutral-400 hover:text-white flex items-center justify-center backdrop-blur hover:bg-black/80 transition-all border border-white/10"
        >
            ×
        </button>

        <!-- Header (Standard Mode) -->
        <div v-if="!clean" class="flex-none flex items-center justify-between p-3 border-b border-white/5 bg-neutral-800/30">
            <h3 class="text-amber-500 font-bold tracking-widest text-lg">{{ title }}</h3>
            <button @click="$emit('close')" class="text-neutral-500 hover:text-white px-2 py-1 text-xl">×</button>
        </div>
        
        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto scrollbar-hide" :class="clean ? '' : 'p-4'">
            <slot></slot>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    title?: string;
    variant?: 'drawer' | 'center';
    clean?: boolean;
}>(), {
    title: '',
    variant: 'drawer',
    clean: false
});

defineEmits(['close']);
</script>

<style scoped>
.animate-slide-up {
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-scale-in {
    animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
</style>
