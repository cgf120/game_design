<template>
  <div class="flex flex-col h-48 bg-black/60 border-t border-amber-900/50 backdrop-blur-md relative pointer-events-auto">
    <!-- Decor Top Border -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

    <!-- TABS -->
    <div class="flex items-center px-2 pt-1 gap-1 border-b border-white/5 bg-black/40">
        <button 
            v-for="channel in channels" 
            :key="channel.key"
            @click="activeChannel = channel.key"
            class="px-3 py-1 text-[10px] transition-all relative group"
            :class="activeChannel === channel.key ? 'text-amber-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'"
        >
            {{ channel.label }}
            <!-- Active Indicator -->
            <div v-if="activeChannel === channel.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
        </button>
        <div class="flex-1"></div>
        <!-- Resize/Collapse Handle (Visual only for now) -->
        <div class="w-8 flex justify-center opacity-30">
            <div class="w-4 h-1 bg-neutral-600 rounded-full"></div>
        </div>
    </div>

    <!-- LOG CONTENT -->
    <div class="flex-1 overflow-y-auto p-2 scrollbar-none font-mono text-[11px] leading-relaxed space-y-1.5 min-h-0" ref="logContainer">
         <div v-for="(log, idx) in filteredLogs" :key="idx" class="break-all animate-fade-in-left">
             <!-- Channel Tag -->
             <span class="mr-1.5 px-0.5 rounded text-[9px] border border-opacity-30 inline-block scale-90 origin-left"
                :class="getChannelStyle(log.channel)"
             >
                {{ getChannelLabel(log.channel) }}
             </span>
             <!-- Content -->
             <span class="text-neutral-300" :class="{'text-amber-100/90': log.channel === 'system'}" v-html="highlightKeywords(log.content)"></span>
         </div>
         
         <div v-if="filteredLogs.length === 0" class="text-center text-neutral-600 italic py-4 text-xs">
             暂无消息
         </div>
    </div>

    <!-- INPUT AREA (Placeholder for future chat) -->
    <div class="h-8 border-t border-white/5 flex items-center px-2 bg-black/20 gap-2">
        <div class="w-4 h-4 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-[8px] text-neutral-400">?</div>
        <input 
            type="text" 
            placeholder="[世界] 发言..." 
            class="bg-transparent border-none outline-none text-xs text-neutral-300 placeholder-neutral-600 flex-1 h-full"
            disabled
        />
        <button class="text-[10px] text-neutral-600 px-2 border border-neutral-800 rounded bg-neutral-900 opacity-50 cursor-not-allowed">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

type ChannelType = 'world' | 'system' | 'self';

interface LogMessage {
    id: number;
    channel: ChannelType;
    content: string;
    timestamp: number;
}

const props = defineProps<{
    logs: string[]; // Legacy simple string logs
}>();

// Internal structured logs (simulated from props + internal logic)
// In a real app, this would come from a defined store
const internalLogs = ref<LogMessage[]>([
    { id: 1, channel: 'system', content: '欢迎来到text-cultivation-test!', timestamp: Date.now() },
    { id: 2, channel: 'world', content: '道友 [韩立] 突破到了筑基期！', timestamp: Date.now() },
    { id: 3, channel: 'self', content: '你运转周天，感觉修为有所精进。', timestamp: Date.now() },
]);

// Watch legacy logs to inject into 'self' or 'system'
watch(() => props.logs, (newLogs) => {
    if (newLogs.length > 0) {
        // Assume the newest log is at index 0 or length-1? 
        // Based on HomeView: recentLogs.value.unshift(msg); so 0 is newest.
        // But here we want to append.
        
        // Let's simplified: We just take the latest log from props[0] if it's new
        const latestInfo = newLogs[0];
        // Check if we already have it to avoid dupe (simple check)
        const lastSelf = internalLogs.value.find(l => l.content === latestInfo && (l.channel === 'self' || l.channel === 'system'));
        
        if (!lastSelf) {
             internalLogs.value.push({
                 id: Date.now(),
                 channel: latestInfo.startsWith('[系统]') ? 'system' : 'self',
                 content: latestInfo,
                 timestamp: Date.now()
             });
             scrollToBottom();
        }
    }
}, { deep: true });

const activeChannel = ref<ChannelType | 'all'>('all');
const logContainer = ref<HTMLElement | null>(null);

const channels = [
    { key: 'all', label: '综合' },
    { key: 'self', label: '个人' },
    { key: 'world', label: '世界' },
    { key: 'system', label: '系统' },
];

const filteredLogs = computed(() => {
    if (activeChannel.value === 'all') return internalLogs.value;
    return internalLogs.value.filter(l => l.channel === activeChannel.value);
});

function getChannelLabel(c: ChannelType) {
    switch(c) {
        case 'world': return '世界';
        case 'system': return '系统';
        case 'self': return '个人';
    }
}

function getChannelStyle(c: ChannelType) {
    switch(c) {
        case 'world': return 'border-orange-500 text-orange-400 bg-orange-900/20';
        case 'system': return 'border-red-500 text-red-400 bg-red-900/20';
        case 'self': return 'border-emerald-500 text-emerald-400 bg-emerald-900/20';
    }
}

function highlightKeywords(text: string) {
     return text
        .replace(/\[(.*?)\]/g, '<span class="text-amber-500/80">[$1]</span>')
        .replace(/(\d+)/g, '<span class="text-amber-200 font-bold">$1</span>')
        .replace(/成功/g, '<span class="text-green-400">成功</span>')
        .replace(/失败/g, '<span class="text-red-400">失败</span>');
}

function scrollToBottom() {
    nextTick(() => {
        if (logContainer.value) {
            logContainer.value.scrollTop = logContainer.value.scrollHeight;
        }
    });
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
.scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.animate-fade-in-left {
    animation: fadeInLeft 0.3s ease-out;
}

@keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
}
</style>
