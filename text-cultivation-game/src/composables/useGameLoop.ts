import { onMounted, onUnmounted, ref } from 'vue';
import { usePlayerStore } from '../stores/player';

export function useGameLoop() {
    const playerStore = usePlayerStore();
    const isRunning = ref(false);
    let intervalId: number | null = null;
    const tickRate = 1000; // 1 second

    const tick = () => {
        // 1. Cultivation (Idle EXP)
        // Base gain = 5 + modifiers (todo)
        const expGain = 5;
        playerStore.addExp(expGain);

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
