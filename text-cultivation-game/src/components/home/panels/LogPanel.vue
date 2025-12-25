<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-y-auto bg-black p-2 border border-neutral-800 rounded shadow-inner scrollbar-hide font-mono text-xs leading-relaxed space-y-1">
        <div 
            v-for="(log, index) in logs" 
            :key="index"
            class="text-neutral-400 border-b border-neutral-900/50 pb-1 last:border-0"
        >
            <span class="text-neutral-600 mr-2">[{{ formatTime(index) }}]</span>
            <span v-html="highlightKeywords(log)"></span>
        </div>
        
        <div v-if="logs.length === 0" class="text-neutral-600 text-center mt-10 italic">
            暂无日志记录
        </div>
    </div>
    
    <div class="mt-2 text-[10px] text-neutral-600 text-center">
        仅显示最近 20 条记录
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    logs: string[];
}>();

function formatTime(index: number) {
    // Mock time relative to index, or just empty
    return '最新';
}

function highlightKeywords(text: string) {
    // Simple coloring for keywords like [修炼], [战斗], numbers
    return text
        .replace(/\[(.*?)\]/g, '<span class="text-amber-600">[$1]</span>')
        .replace(/(\d+)/g, '<span class="text-amber-200">$1</span>')
        .replace(/成功/g, '<span class="text-green-500">成功</span>')
        .replace(/失败/g, '<span class="text-red-500">失败</span>');
}
</script>
