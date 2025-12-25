<template>
  <div class="relative w-full py-1 flex flex-row items-center justify-center gap-2 px-2 overflow-hidden">
    <!-- Background Atmosphere -->
    <div class="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-neutral-900/10 to-neutral-900/50 pointer-events-none"></div>
    
    <!-- Rotating Mandala Behind (Centered on whole area or just character?) -> Centered on Character looks better -->
    <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-[200px] h-[200px] opacity-10 pointer-events-none">
       <XianxiaIcon src="ui_bg_mandala" fallback="" size="full" class="animate-spin-slow w-full h-full" />
    </div>

    <!-- LEFT: Character Animation (50% Width) -->
    <div 
        class="relative z-10 w-1/2 h-[200px] flex items-center justify-center cursor-pointer group active:scale-95 transition-transform duration-100"
        @click="$emit('cultivate')"
    >
        <!-- Aura Glow -->
        <div class="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <!-- Character Image -->
         <div v-if="currentFrameUrl" class="w-full h-full relative flex items-center justify-center">
            <img 
                :src="currentFrameUrl" 
                class="h-[140%] w-auto max-w-none object-contain filter drop-shadow-[0_0_15px_rgba(217,119,6,0.3)] z-10 translate-y-2"
                alt="Meditation"
            />
         </div>
         <XianxiaIcon 
            v-else
            src="ui_char_meditate" 
            fallback="🧘" 
            size="full" 
            :glow="true"
            class="filter drop-shadow-[0_0_15px_rgba(217,119,6,0.3)] h-full w-auto object-contain scale-125" 
        />
        
        <!-- Action Hint -->
        <div class="absolute bottom-0 text-[10px] text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
            点击修炼
        </div>
    </div>

    <!-- RIGHT: Cultivation Info (50% Width) -->
    <div class="relative z-10 w-1/2 flex flex-col justify-center gap-4 -translate-y-2">
        <!-- Realm Info -->
        <div class="space-y-1">
            <div class="text-[10px] text-neutral-500 tracking-wider uppercase">当前修为</div>
            <div class="text-amber-500 font-mono text-xl font-bold flex flex-col leading-none">
                <span class="text-shadow-gold filter drop-shadow-md">{{ currentExpFormatted }}</span>
                <div class="w-full h-px bg-gradient-to-r from-amber-900/50 via-amber-700/50 to-transparent my-2"></div>
                <div class="flex justify-between items-baseline">
                     <span class="text-neutral-500 text-[10px] font-normal tracking-wide">{{ maxExpFormatted }} (突破需求)</span>
                </div>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full space-y-1.5">
            <div class="flex justify-between text-[10px] text-neutral-400 font-mono tracking-wide">
                <span>修炼进度</span>
                <span class="text-amber-200/80">{{ progress.toFixed(2) }}%</span>
            </div>
            <div class="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div 
                    class="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-300 transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    :style="{ width: `${Math.min(progress, 100)}%` }"
                ></div>
            </div>
        </div>

        <!-- Efficiency -->
        <div class="text-xs text-green-500/90 font-mono flex items-center gap-1.5 bg-green-900/10 py-0.5 px-2 rounded w-max border border-green-500/20">
            <span class="animate-pulse">⚡</span>
            <span>{{ efficiencyText }}</span>
        </div>

        <!-- Breakthrough Button -->
        <div v-if="canBreakthrough" class="mt-2 animate-pulse">
            <button 
                @click.stop="$emit('breakthrough')"
                class="w-full py-2 bg-gradient-to-r from-amber-900 to-red-900 text-amber-100 font-bold text-xs tracking-[0.2em] border border-amber-500/40 rounded shadow-[0_0_15px_rgba(255,69,0,0.4)] active:scale-95 transition-all hover:brightness-125 hover:border-amber-400/60"
            >
                [ 突破 ]
            </button>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { usePlayerStore } from '../../stores/player'; 
import XianxiaIcon from '../shared/XianxiaIcon.vue';

const props = defineProps<{
    progress: number;
    efficiencyText: string;
    canBreakthrough: boolean;
}>();

defineEmits(['cultivate', 'breakthrough']);

const playerStore = usePlayerStore();

// Formatted Exp numbers (e.g. 1.2k, 10m) could be nice, but raw numbers ok for now
const currentExpFormatted = computed(() => playerStore.player.cultivation.currentExp.toLocaleString());
const maxExpFormatted = computed(() => playerStore.maxExp.toLocaleString());

// --- Animation Logic ---
// Use relative path to be safe
const frameImages = import.meta.glob('../../assets/ui/ui_char_meditates/**/*.png', { eager: true, as: 'url' });

const currentFrameUrl = ref('');
let frameIndex = 0;
let animationInterval: number | null = null;
const fps = 12; // 12 frames per second
const frameInterval = 1000 / fps;

// Map Realm ID (1...N) to asset folder (1...7)
const animFolder = computed(() => {
    const rid = playerStore.player.cultivation.realmId;
    // Debug
    // console.log('Current Realm:', rid);
    if (rid <= 10) return '1'; // Qi Condensation
    if (rid <= 13) return '2'; // Foundation
    if (rid <= 16) return '3'; // Golden Core
    if (rid <= 19) return '4'; // Nascent Soul
    if (rid <= 22) return '5'; // Spirit Severing
    if (rid <= 25) return '6'; // Void Training
    return '7'; // Mahayana+
});

// Get frames for current folder
const currentFrames = computed(() => {
    const folder = animFolder.value;
    // Filter keys roughly matching `/ui_char_meditates/${folder}/`
    const keys = Object.keys(frameImages).filter(k => k.includes(`/ui_char_meditates/${folder}/`));
    // Sort keys just in case (glob usually returns sorted but standard requires care)
    keys.sort();
    
    // console.log(`Frames found for folder ${folder}:`, keys.length);
    if (keys.length === 0) {
        // Fallback: Try folder '1' if current empty
        const fallbackKeys = Object.keys(frameImages).filter(k => k.includes(`/ui_char_meditates/1/`));
        if (fallbackKeys.length > 0) {
            fallbackKeys.sort();
            return fallbackKeys.map(k => frameImages[k] as string);
        }
    }
    
    return keys.map(k => frameImages[k] as string);
});

function startAnimation() {
    if (animationInterval) clearInterval(animationInterval);
    
    // Safety check
    if (currentFrames.value.length === 0) {
        currentFrameUrl.value = ''; // Fallback will show default
        return;
    }

    animationInterval = window.setInterval(() => {
        frameIndex = (frameIndex + 1) % currentFrames.value.length;
        currentFrameUrl.value = currentFrames.value[frameIndex];
    }, frameInterval);
}

// Watch realm change to reset animation source
watch(animFolder, () => {
    frameIndex = 0;
    startAnimation();
}, { immediate: true });

onMounted(() => {
    startAnimation();
});

onUnmounted(() => {
    if (animationInterval) clearInterval(animationInterval);
});

</script>

<style scoped>
.animate-spin-slow {
    animation: spin 60s linear infinite;
}
.animate-bounce-slow {
    animation: bounce 3s infinite;
}
@keyframes spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}
/* Re-define bounce to be subtle */
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

.mask-radial-faded {
    mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
    -webkit-mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
}
</style>
