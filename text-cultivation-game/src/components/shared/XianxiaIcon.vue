<template>
  <div 
    class="xianxia-icon relative inline-flex items-center justify-center select-none"
    :class="[sizeClass, customClass]"
    :title="alt"
  >
    <!-- Image Asset (if available) -->
    <img 
      v-if="hasAsset && !imgError"
      :src="assetPath"
      :alt="alt"
      class="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300"
      @error="handleError"
    />
    
    <!-- Fallback Unicode/Text -->
    <span 
      v-else 
      class="fallback-text font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-700"
      :style="{ fontSize: fontSize }"
    >
      {{ fallback }}
    </span>

    <!-- Optional: Glow Effect Wrapper -->
    <div v-if="glow" class="absolute inset-0 bg-amber-500/10 rounded-full blur-md -z-10"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
  // The filename in src/assets/ui/ without extension, or full path logic if we change it.
  // For now, let's assume we pass 'ui_nav_cultivate'
  src: {
    type: String,
    required: false,
    default: ''
  },
  // Fallback unicode or text
  fallback: {
    type: String,
    default: '?'
  },
  alt: {
    type: String,
    default: ''
  },
  size: {
    type: String, // 'sm', 'md', 'lg', 'xl', or custom px
    default: 'md'
  },
  glow: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
});

const imgError = ref(false);

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-4 h-4';
    case 'sm': return 'w-6 h-6';
    case 'md': return 'w-8 h-8';
    case 'lg': return 'w-12 h-12';
    case 'xl': return 'w-16 h-16';
    case '2xl': return 'w-24 h-24';
    default: return ''; // Handle custom size via style or class
  }
});

const fontSize = computed(() => {
  switch (props.size) {
    case 'xs': return '0.75rem';
    case 'sm': return '1.2rem';
    case 'md': return '1.5rem';
    case 'lg': return '2rem';
    case 'xl': return '2.5rem';
    case '2xl': return '4rem';
    default: return '1rem';
  }
});

const hasAsset = computed(() => !!props.src);

// Vite asset handling
// We need to resolve the path dynamically. 
// Note: Dynamic import with template literals in Vite requires specific structure.
const assetPath = computed(() => {
  if (!props.src) return '';
  // Assuming all UI assets are png for now
  return new URL(`/src/assets/ui/${props.src}.png`, import.meta.url).href;
});

function handleError() {
  imgError.value = true;
}

watch(() => props.src, () => {
    imgError.value = false;
});
</script>

<style scoped>
.xianxia-icon:hover img {
    transform: scale(1.1);
}
</style>
