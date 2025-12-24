<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" @click="handleBackdropClick"></div>
      
      <!-- Modal Content -->
      <div class="bg-neutral-800 border-2 border-neutral-600 rounded-lg p-6 w-full max-w-sm shadow-2xl relative z-10 transform transition-all">
        <h3 class="text-xl font-bold text-amber-500 mb-4">{{ options.title }}</h3>
        
        <div class="text-neutral-300 text-sm mb-8 leading-relaxed">
          {{ options.content }}
        </div>
        
        <div class="flex gap-4 justify-end">
          <button 
            v-if="options.showCancel"
            @click="cancel"
            class="px-4 py-2 rounded text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-colors"
          >
            {{ options.cancelText }}
          </button>
          
          <button 
            @click="confirm"
            class="px-6 py-2 rounded text-sm bg-amber-700 hover:bg-amber-600 text-amber-100 shadow-lg transition-all active:scale-95"
          >
            {{ options.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useModal } from '../../composables/useModal';

const { isOpen, options, confirm, cancel } = useModal();

function handleBackdropClick() {
  // Optional: close on backdrop click? For now, let's enforce button usage for important decisions
  // cancel();
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: all 0.2s ease;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
