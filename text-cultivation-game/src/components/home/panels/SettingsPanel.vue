<template>
  <div class="p-4 flex flex-col items-center gap-8">
    <div class="text-neutral-500 text-sm text-center">
        <p class="mb-2">道途漫漫，若觉前路已尽，或许重入轮回也是一种选择。</p>
        <p class="text-red-900/50 text-xs">注意：兵解重修将清除当前所有修为与进度。</p>
    </div>
    <button 
        @click="$emit('reset')"
        class="w-full max-w-[200px] py-3 border border-red-900/30 bg-red-950/10 text-red-800 hover:bg-red-900/20 hover:text-red-600 transition-colors rounded"
    >
        [ 兵解重修 ]
    </button>
    
    <div class="text-[10px] text-neutral-800 mt-auto">
        Version 0.1.0 Alpha
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['reset']);
</script>
