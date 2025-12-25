<template>
  <div class="space-y-2 font-mono text-xs">
    <div v-if="logs.length === 0" class="text-neutral-700 text-center py-4">暂无日志</div>
    <div v-for="(log, i) in logs" :key="i" class="text-neutral-500 leading-snug border-b border-neutral-900/50 pb-1">
        <span class="text-amber-900/50 mr-2">[{{ i + 1 }}]</span>
        <span class="text-neutral-400">{{ log }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    logs: string[];
}>();
</script>
