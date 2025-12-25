<template>
  <!-- Global Backdrop -->
  <div class="fixed inset-0 bg-neutral-950 flex justify-center items-center overflow-hidden font-serif">
    
    <!-- Mobile Viewport Simulator -->
    <div class="relative w-full max-w-[480px] h-full shadow-2xl overflow-hidden bg-ink border-x border-neutral-800 flex flex-col">
      <MainLayout>
        <router-view></router-view>
      </MainLayout>
      <GameModal />
      <ToastContainer />

      <!-- Multi-Tab Conflict Overlay -->
      <div v-if="!isSessionActive" class="absolute inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
        <div class="bg-neutral-800 border border-red-800 p-6 rounded max-w-sm text-center shadow-2xl">
          <h2 class="text-xl font-bold text-red-500 mb-2">连接已断开</h2>
          <p class="text-gray-300 mb-6 text-sm">
            检测到游戏已在另一个窗口或标签页中打开。为防止存档冲突，当前页面已停止运行。
          </p>
          <div class="flex justify-center gap-4">
            <button 
              @click="reloadPage"
              class="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors text-sm"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import MainLayout from './components/layout/MainLayout.vue';
import GameModal from './components/common/GameModal.vue';
import ToastContainer from './components/shared/ToastContainer.vue';
import { useGameLoop } from './composables/useGameLoop';
import { SessionManager, isSessionActive } from './core/services/SessionManager';

// Start the game loop globally
useGameLoop();

onMounted(() => {
    SessionManager.init();
});

const reloadPage = () => {
    location.reload();
};
</script>
