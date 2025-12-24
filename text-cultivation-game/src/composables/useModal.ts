import { ref } from 'vue';

interface ModalOptions {
    title: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}

const isOpen = ref(false);
const options = ref<ModalOptions>({
    title: '',
    content: '',
});

export function useModal() {
    const showModal = (opts: ModalOptions) => {
        options.value = {
            confirmText: '确定',
            cancelText: '取消',
            showCancel: true,
            ...opts
        };
        isOpen.value = true;
    };

    const closeModal = () => {
        isOpen.value = false;
    };

    const confirm = () => {
        if (options.value.onConfirm) {
            options.value.onConfirm();
        }
        closeModal();
    };

    const cancel = () => {
        if (options.value.onCancel) {
            options.value.onCancel();
        }
        closeModal();
    };

    return {
        isOpen,
        options,
        showModal,
        closeModal,
        confirm,
        cancel
    };
}
