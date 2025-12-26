import { onMounted, onUnmounted, ref } from 'vue';
import { usePlayerStore } from '../stores/player';
import { useAbodeStore } from '../stores/abode';

export function useGameLoop() {
    const playerStore = usePlayerStore();
    const abodeStore = useAbodeStore();
    const isRunning = ref(false);
    let worker: Worker | null = null;

    const tick = () => {
        // 1. Cultivation (Idle EXP)
        const expGain = playerStore.cultivationRate; // Dynamic rate
        playerStore.addExp(expGain);
        playerStore.regenStats(); // Added passive regen

        // 2. Abode Resources
        abodeStore.tickResources();

        // 3. Resource Production (Spirit Stones) - todo
        // 4. Auto-save is now reactive in stores, no need for loop check
    };

    const start = () => {
        if (isRunning.value) return;

        // Initialize Worker if not exists
        if (!worker) {
            worker = new Worker(new URL('../workers/gameLoop.worker.ts', import.meta.url), {
                type: 'module'
            });

            worker.onmessage = (e) => {
                if (e.data.type === 'TICK') {
                    tick();
                }
            };
        }

        worker.postMessage({ action: 'START' });
        isRunning.value = true;
    };

    const stop = () => {
        if (!isRunning.value) return;

        if (worker) {
            worker.postMessage({ action: 'STOP' });
            worker.terminate(); // Completely terminate to clean up
            worker = null;
        }
        isRunning.value = false;
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
