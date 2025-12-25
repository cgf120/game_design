<template>
  <div class="space-y-4 p-2">
    <!-- Pentagram visualization could go here later -->
    
    <div class="text-xs text-neutral-500 text-center mb-4">
        天地五行，相生相克。
    </div>

    <div class="space-y-3">
        <div class="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-yellow-600 shadow-[0_0_5px_rgba(202,138,4,0.5)]"></span>
                <span class="text-neutral-300 font-bold">金灵根</span>
            </div>
            <span class="text-yellow-600 font-mono text-lg">{{ roots.metal }}</span>
        </div>
        <div class="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-600 shadow-[0_0_5px_rgba(22,163,74,0.5)]"></span>
                <span class="text-neutral-300 font-bold">木灵根</span>
            </div>
            <span class="text-green-600 font-mono text-lg">{{ roots.wood }}</span>
        </div>
        <div class="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_5px_rgba(37,99,235,0.5)]"></span>
                <span class="text-neutral-300 font-bold">水灵根</span>
            </div>
            <span class="text-blue-600 font-mono text-lg">{{ roots.water }}</span>
        </div>
        <div class="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]"></span>
                <span class="text-neutral-300 font-bold">火灵根</span>
            </div>
            <span class="text-red-600 font-mono text-lg">{{ roots.fire }}</span>
        </div>
        <div class="flex items-center justify-between p-2 bg-neutral-900/50 rounded border border-neutral-800">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-800 shadow-[0_0_5px_rgba(146,64,14,0.5)]"></span>
                <span class="text-neutral-300 font-bold">土灵根</span>
            </div>
            <span class="text-amber-800 font-mono text-lg">{{ roots.earth }}</span>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    roots: any;
}>();
</script>
