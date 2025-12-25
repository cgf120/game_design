<template>
  <div class="fixed inset-x-0 bottom-0 top-20 z-50 flex flex-col pointer-events-none">
     <!-- Backdrop (Close on click) -->
     <div class="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" @click="$emit('close')"></div>
     
     <!-- Panel Content Wrapper -->
     <!-- Added relative and z-index to explicitly stack above backdrop -->
     <div class="relative z-10 flex-1 flex flex-col mt-auto pointer-events-none">
         <div 
            class="w-full bg-neutral-900 border-t border-amber-900/50 rounded-t-xl overflow-hidden shadow-2xl pointer-events-auto animate-slide-up flex flex-col max-h-[85vh] mt-auto"
            @click.stop
        >
            <!-- Header -->
            <div class="flex-none flex items-center justify-between p-3 border-b border-white/5 bg-neutral-800/30">
                <h3 class="text-amber-500 font-bold tracking-widest text-lg">{{ title }}</h3>
                <button @click="$emit('close')" class="text-neutral-500 hover:text-white px-2 py-1 text-xl">×</button>
            </div>
            
            <!-- Scrollable Body -->
            <div class="flex-1 overflow-y-auto p-4 scrollbar-hide">
                <slot></slot>
            </div>
        </div>
     </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();

defineEmits(['close']);
</script>

<style scoped>
.animate-slide-up {
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
</style>
