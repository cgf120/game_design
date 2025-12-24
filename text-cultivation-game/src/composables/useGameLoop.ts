import { onMounted, onUnmounted, ref } from 'vue';
import { usePlayerStore } from '../stores/player';
import { useAbodeStore } from '../stores/abode';

export function useGameLoop() {
    const playerStore = usePlayerStore();
    const abodeStore = useAbodeStore();
    const isRunning = ref(false);
    let intervalId: number | null = null;
    const tickRate = 1000; // 1 second

    const tick = () => {
        // 1. Cultivation (Idle EXP)
        // 1. Cultivation (Idle EXP)
        const expGain = playerStore.cultivationRate; // Dynamic rate
        playerStore.addExp(expGain);
        playerStore.regenStats(); // Added passive regen

        // 2. Abode Resources
        abodeStore.tickResources();

        // 2. Resource Production (Spirit Stones) - todo
        // 3. Auto-save is now reactive in stores, no need for loop check
    };

    const start = () => {
        if (isRunning.value) return;
        isRunning.value = true;
        intervalId = window.setInterval(tick, tickRate);
    };

    const stop = () => {
        if (!isRunning.value) return;
        isRunning.value = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    onMounted(() => {
        start();
    });

    onUnmounted(() => {
        stop();
    });

    return {
        isRunning,
        start,
        stop,
    };
}
