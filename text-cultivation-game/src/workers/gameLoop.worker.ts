// Game Loop Worker
// Runs in a separate thread to handle timing, ensuring the game runs even when the tab is inactive.

const TICK_RATE = 1000; // 1 second
let intervalId: number | null = null;

self.onmessage = (e: MessageEvent) => {
    const { action } = e.data;

    if (action === 'START') {
        if (intervalId) return;
        intervalId = self.setInterval(() => {
            self.postMessage({ type: 'TICK' });
        }, TICK_RATE);
    } 
    
    if (action === 'STOP') {
        if (intervalId) {
            self.clearInterval(intervalId);
            intervalId = null;
        }
    }
};
