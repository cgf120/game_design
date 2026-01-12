import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
    tag?: string;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToast() {
    function addToast(message: string, type: ToastType = 'info', duration: number = 3000, tag?: string) {
        if (tag) {
            // Remove existing toast with the same tag
            const existingIdx = toasts.value.findIndex(t => t.tag === tag);
            if (existingIdx !== -1) {
                // Determine if we just splice or smart replace. 
                // Splice is simplest and effectively resetting the timer.
                toasts.value.splice(existingIdx, 1);
            }
        }

        const id = nextId++;
        const toast: Toast = { id, message, type, duration, tag };
        toasts.value.push(toast);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }

    function removeToast(id: number) {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }

    return {
        toasts,
        addToast,
        removeToast
    };
}
