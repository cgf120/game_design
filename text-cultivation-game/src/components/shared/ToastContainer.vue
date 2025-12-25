<template>
  <div class="fixed top-12 left-0 w-full z-[10000] pointer-events-none flex flex-col items-center gap-2 p-4">
    <transition-group name="toast-list">
      <SpiritToast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/useToast';
import SpiritToast from './SpiritToast.vue';

const { toasts } = useToast();
</script>

<style scoped>
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.5s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
