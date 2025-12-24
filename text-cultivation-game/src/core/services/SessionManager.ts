import { ref } from 'vue';

const SESSION_KEY = 'text_cultivation_session_id';
// Simple unique ID for this tab instance
const mySessionId = Date.now().toString(36) + '-' + Math.random().toString(36).substr(2);

export const isSessionActive = ref(true);

export const SessionManager = {
    init() {
        // 1. Claim the session lock immediately
        localStorage.setItem(SESSION_KEY, mySessionId);
        isSessionActive.value = true;
        console.log('[SessionManager] Session claimed:', mySessionId);

        // 2. Listen for other tabs claiming it
        window.addEventListener('storage', (e) => {
            if (e.key === SESSION_KEY) {
                if (e.newValue !== mySessionId) {
                    console.warn('[SessionManager] Session lost to another tab!');
                    isSessionActive.value = false;
                }
            }
        });

        // 3. Optional: Polling to ensure we didn't miss an event (e.g. same browser window focused changes?)
        // Usually 'storage' event is enough for cross-tab.
    },

    /**
     * Call this before saving or critical actions.
     * If we lost the lock, strict blocking.
     */
    canWrite(): boolean {
        if (!isSessionActive.value) return false;

        // Double check source of truth (paranoid check)
        const currentLock = localStorage.getItem(SESSION_KEY);
        if (currentLock && currentLock !== mySessionId) {
            isSessionActive.value = false;
            return false;
        }
        return true;
    },

    takeControl() {
        localStorage.setItem(SESSION_KEY, mySessionId);
        isSessionActive.value = true;
    }
};
