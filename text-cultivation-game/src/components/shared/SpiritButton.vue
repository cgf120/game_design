<template>
  <button 
    class="spirit-btn relative px-4 py-1.5 min-w-[80px] text-xs font-serif transition-all duration-300 group overflow-hidden"
    :class="[
      variantClasses,
      disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer active:scale-95'
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <!-- Background Texture/Gradient -->
    <div class="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-noise"></div>
    
    <!-- Content logic -->
    <div class="relative z-10 flex items-center justify-center gap-2">
      <slot name="icon"></slot>
      <span :class="textClass"><slot></slot></span>
    </div>

    <!-- Hover Glow -->
    <div 
      v-if="!disabled"
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
    ></div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String, // 'primary' (gold), 'secondary' (neutral), 'danger', 'jade'
    default: 'secondary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

function handleClick(e: MouseEvent) {
  if (!props.disabled) {
    emit('click', e);
  }
}

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': // Gold/Amber
      return 'border border-amber-600/50 bg-amber-900/20 text-amber-500 hover:bg-amber-900/40 hover:border-amber-500 shadow-[0_0_10px_rgba(180,83,9,0.1)] hover:shadow-[0_0_15px_rgba(180,83,9,0.3)]';
    case 'jade': // Green/Jade
      return 'border border-emerald-600/50 bg-emerald-900/20 text-emerald-500 hover:bg-emerald-900/40 hover:border-emerald-500 shadow-[0_0_10px_rgba(5,150,105,0.1)]';
    case 'danger': // Red/Combat
      return 'border border-red-800/50 bg-red-900/10 text-red-500 hover:bg-red-900/30 hover:border-red-600';
    case 'ghost': 
        return 'border border-transparent text-neutral-500 hover:text-neutral-300';
    case 'secondary': // Default Neutral
    default:
      return 'border border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 hover:border-neutral-500';
  }
});

const textClass = computed(() => {
    if (props.variant === 'primary') return 'text-shadow-gold';
    return '';
});

</script>

<style scoped>
.bg-noise {
    /* Optional: Add a noise texture if available, or just keeping it empty for now */
}
.text-shadow-gold {
    text-shadow: 0 0 5px rgba(217, 119, 6, 0.5);
}
</style>
