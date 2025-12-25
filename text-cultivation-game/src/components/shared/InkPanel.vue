<template>
  <div 
    class="ink-panel relative p-4 bg-neutral-900/80 border border-neutral-800"
    :class="[
      hover ? 'hover:border-amber-900/50 transition-colors duration-300' : '',
      customClass
    ]"
  >
    <!-- Corner decors (top-left, top-right, bottom-left, bottom-right) -->
    <div v-if="decorated" class="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-600"></div>
    <div v-if="decorated" class="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-600"></div>
    <div v-if="decorated" class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neutral-600"></div>
    <div v-if="decorated" class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neutral-600"></div>
    
    <!-- Title Header (Optional) -->
    <div v-if="title" class="absolute -top-3 left-4 bg-black px-2 text-xs font-bold text-amber-600 border border-neutral-800 shadow-sm">
      {{ title }}
    </div>

    <!-- Content -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  decorated: {
    type: Boolean,
    default: true
  },
  hover: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.ink-panel {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
}
</style>
