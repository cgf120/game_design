<template>
  <div class="relative w-full py-2 flex items-center justify-between px-2 overflow-hidden bg-gradient-radial from-black/0 to-black/80 shrink-0">
    <!-- Background Atmosphere -->
    <div class="absolute inset-0 bg-[url('@/assets/ui/bg_texture_cloud.png')] bg-cover opacity-10 pointer-events-none mix-blend-overlay"></div>
    <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

    <!-- LEFT COLUMN: Slots -->
    <div class="flex flex-col gap-4 z-10 w-16">
        <div v-for="slot in leftSlots" :key="slot.key" 
             class="group relative w-12 h-12 border border-white/10 bg-black/40 rounded flex items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all mx-auto"
             @click="$emit('open-slot', slot.key)"
        >
            <!-- Slot Label -->
            <div class="absolute inset-0 flex items-center justify-center text-[10px] text-white/5 font-serif select-none pointer-events-none">{{ slot.label }}</div>
            
            <!-- Item Icon or Fallback -->
            <XianxiaIcon 
                v-if="getEquippedItem(slot.key)"
                :src="getEquippedItem(slot.key)?.icon" 
                :fallback="slot.fallback"
                class="w-10 h-10 opacity-90 group-hover:scale-110 transition-transform"
                :glow="getSlotQualityColor(slot.key).includes('text-red') || getSlotQualityColor(slot.key).includes('text-orange')" 
            />
            <span v-else class="text-2xl opacity-20 grayscale">{{ slot.fallback }}</span>

            <!-- Quality Border Overlay -->
            <div v-if="getEquippedItem(slot.key)" 
                 class="absolute inset-0 border pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                 :class="getSlotQualityBorder(slot.key)"
            ></div>
        </div>
    </div>

    <!-- CENTER: Character & Progress Halo -->
    <div class="relative w-48 h-48 flex items-center justify-center shrink-0">
         
         <!-- Rotating Halo behind -->
         <div class="absolute inset-0 opacity-20 animate-spin-slow pointer-events-none">
             <svg viewBox="0 0 100 100" class="w-full h-full fill-current text-amber-500">
                <circle cx="50" cy="50" r="48" stroke="currentColor" stroke-width="0.5" fill="none" stroke-dasharray="4 2" />
                <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="0.2" fill="none" />
                <path d="M50 2 L52 10 L50 12 L48 10 Z" />
                <path d="M98 50 L90 52 L88 50 L90 48 Z" />
             </svg>
         </div>

         <!-- Progress Ring (SVG) -->
         <div class="absolute inset-0 -rotate-90 pointer-events-none">
            <svg class="w-full h-full" viewBox="0 0 100 100">
                <!-- Track -->
                <circle cx="50" cy="50" r="48" stroke="rgba(245, 158, 11, 0.2)" stroke-width="4" fill="none" />
                <!-- Progress -->
                <circle 
                    cx="50" cy="50" r="48" 
                    stroke="url(#progressGradient)" 
                    stroke-width="4" 
                    fill="none" 
                    class="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="strokeDashoffset"
                    stroke-linecap="round"
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#b45309" />
                        <stop offset="100%" stop-color="#fbbf24" />
                    </linearGradient>
                </defs>
            </svg>
         </div>

         <!-- Character (Breathing) -->
         <div 
            class="relative z-10 w-32 h-32 flex items-center justify-center cursor-pointer group animate-breathe"
            @click="$emit('cultivate')"
         >
            <div v-if="currentFrameUrl" class="w-full h-full relative flex items-center justify-center">
                 <img 
                 :src="currentFrameUrl" 
                 class="h-[140%] w-auto max-w-none object-contain filter drop-shadow-[0_0_20px_rgba(217,119,6,0.3)] z-10 translate-y-2"
                 alt="Meditation"
                 />
            </div>
            <div v-else class="w-full h-full relative flex items-center justify-center">
                 <XianxiaIcon 
                     src="ui_char_meditate" 
                     fallback="🧘" 
                     size="full" 
                     :glow="true"
                     class="filter drop-shadow-[0_0_20px_rgba(217,119,6,0.3)] h-full w-auto object-contain scale-110" 
                 />
            </div>
             
             <!-- Click Hint -->
            <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest border-t border-b border-amber-900/30 py-0.5">
                点击修炼
            </div>
            
            <!-- Efficiency (Top Center) -->
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs text-emerald-400 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)] whitespace-nowrap z-20">
                 {{ efficiencyText }}
            </div>

            <!-- Breakthrough Button (Center Overlay) -->
            <div v-if="canBreakthrough" class="absolute inset-0 z-30 flex items-center justify-center">
                 <button 
                    @click.stop="$emit('breakthrough')"
                    class="bg-black/60 backdrop-blur border border-amber-500 text-amber-500 px-6 py-2 rounded-full font-bold animate-pulse hover:bg-amber-900/50 hover:scale-110 transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] tracking-widest text-lg"
                 >
                    突破
                 </button>
            </div>
         </div>
    </div>

    <!-- RIGHT COLUMN: Slots -->
    <div class="flex flex-col gap-4 z-10 w-16">
        <div v-for="slot in rightSlots" :key="slot.key" 
             class="group relative w-12 h-12 border border-white/10 bg-black/40 rounded flex items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all mx-auto"
             @click="$emit('open-slot', slot.key)"
        >
            <div class="absolute inset-0 flex items-center justify-center text-[10px] text-white/5 font-serif select-none pointer-events-none">{{ slot.label }}</div>
            
            <XianxiaIcon 
                v-if="getEquippedItem(slot.key)"
                :src="getEquippedItem(slot.key)?.icon" 
                :fallback="slot.fallback"
                class="w-10 h-10 opacity-90 group-hover:scale-110 transition-transform"
                :glow="getSlotQualityColor(slot.key).includes('text-red') || getSlotQualityColor(slot.key).includes('text-orange')"
            />
            <span v-else class="text-2xl opacity-20 grayscale">{{ slot.fallback }}</span>

            <div v-if="getEquippedItem(slot.key)" 
                 class="absolute inset-0 border pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                 :class="getSlotQualityBorder(slot.key)"
            ></div>
        </div>
    </div>

    <!-- Realm Name (Absolute Bottom Center) -->
     <div class="absolute bottom-1 left-1/2 -translate-x-1/2 text-xl font-bold text-amber-500 tracking-widest text-shadow-gold font-serif z-20 pointer-events-none whitespace-nowrap">
        {{ currentRealmName }}
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { usePlayerStore } from '../../stores/player'; 
import XianxiaIcon from '../shared/XianxiaIcon.vue';
import { getItem } from '../../core/constants/items';
import { getItemQuality, QUALITY_TIERS } from '../../core/utils/item';
import type { EquipmentSlot } from '../../core/models/item';

const props = defineProps<{
    progress: number;
    efficiencyText: string;
    canBreakthrough: boolean; 
}>();

defineEmits(['cultivate', 'breakthrough', 'open-slot']);

const playerStore = usePlayerStore();

const currentRealmName = computed(() => playerStore.currentRealm?.name || '凡人');

// Equipment Slots Config
const leftSlots = [
    { key: 'helm', label: '头', fallback: '🪖' },
    { key: 'weapon', label: '武', fallback: '⚔️' },
    { key: 'necklace', label: '饰', fallback: '📿' },
];

const rightSlots = [
    { key: 'armor', label: '衣', fallback: '🛡️' },
    { key: 'boots', label: '履', fallback: '👢' },
    { key: 'belt', label: '宝', fallback: '🥋' },
];

function getEquippedItem(slotKey: string) {
    const slot = playerStore.player.equipment[slotKey as EquipmentSlot];
    if (!slot) return null;
    return getItem(slot.itemId); // Returns Item definition
}

function getSlotQuality(key: string) {
    const slot = playerStore.player.equipment[key as EquipmentSlot];
    if (!slot) return QUALITY_TIERS.common;
    return getItemQuality(slot);
}

function getSlotQualityColor(key: string) {
    return getSlotQuality(key).color;
}

function getSlotQualityBorder(key: string) {
    const q = getSlotQuality(key);
    // Map quality to border color utils
    if (q === QUALITY_TIERS.godly) return 'border-red-500/80 shadow-red-500/20';
    if (q === QUALITY_TIERS.peerless) return 'border-orange-500/80 shadow-orange-500/20';
    if (q === QUALITY_TIERS.superior) return 'border-blue-500/80 shadow-blue-500/20';
    if (q === QUALITY_TIERS.good) return 'border-emerald-500/80 shadow-emerald-500/20';
    return 'border-white/20';
}


// Circular Progress Logic
const radius = 48; // matched SVG
const circumference = computed(() => 2 * Math.PI * radius);
const strokeDashoffset = computed(() => {
    const p = Math.min(props.progress, 100) / 100;
    return circumference.value * (1 - p);
});

// --- Animation Logic ---
const frameImages = import.meta.glob('../../assets/ui/ui_char_meditates/**/*.png', { eager: true, as: 'url' });

const currentFrameUrl = ref('');
let frameIndex = 0;
let animationInterval: number | null = null;
const fps = 12; // 12 frames per second
const frameInterval = 1000 / fps;

// Map Realm ID (1...N) to asset folder (1...7)
const animFolder = computed(() => {
    const rid = playerStore.player.cultivation.realmId;
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
    const keys = Object.keys(frameImages).filter(k => k.includes(`/ui_char_meditates/${folder}/`));
    keys.sort();
    
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
        // Fix string | undefined assignment type error with fallback
        currentFrameUrl.value = currentFrames.value[frameIndex] || '';
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
    50% { transform: translateY(-3px); }
}
@keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.9; filter: brightness(1); }
    50% { transform: scale(1.02); opacity: 1; filter: brightness(1.1); }
}

.animate-breathe {
    animation: breathe 6s ease-in-out infinite;
}
</style>
