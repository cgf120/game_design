<template>
  <MainLayout>
    <router-view></router-view>
  </MainLayout>
  <GameModal />
</template>

<script setup lang="ts">
import MainLayout from './components/layout/MainLayout.vue';
import GameModal from './components/common/GameModal.vue';
import { useGameLoop } from './composables/useGameLoop';

// Start the game loop globally
useGameLoop();
</script>
