<template>
  <div class="h-full flex flex-col overflow-y-auto p-4 space-y-6 pb-24">
    <!-- Header -->
    <div class="text-center space-y-1 py-4 border-b border-neutral-800">
        <h2 class="text-xl font-bold text-amber-500 tracking-widest">系统设置</h2>
        <div class="text-xs text-neutral-500 font-serif">大道三千，殊途同归</div>
    </div>

    <!-- Game Settings -->
    <div class="space-y-4">
        <h3 class="text-amber-500 text-sm font-bold border-b border-amber-900/30 pb-1">游戏设置</h3>
        
        <div class="flex justify-between items-center bg-black/20 p-3 rounded border border-neutral-800/50">
            <span class="text-neutral-300 text-sm">背景音乐</span>
            <div class="w-10 h-5 bg-neutral-800 rounded-full relative cursor-not-allowed opacity-50">
                <div class="absolute left-1 top-1 w-3 h-3 bg-neutral-600 rounded-full"></div>
            </div>
        </div>
        
        <div class="flex justify-between items-center bg-black/20 p-3 rounded border border-neutral-800/50">
            <span class="text-neutral-300 text-sm">音效</span>
            <div class="w-10 h-5 bg-neutral-800 rounded-full relative cursor-not-allowed opacity-50">
                <div class="absolute left-1 top-1 w-3 h-3 bg-neutral-600 rounded-full"></div>
            </div>
        </div>
    </div>

    <!-- Debug / GM Mode -->
    <div class="border-t border-amber-900/20 pt-4">
        <h3 class="text-neutral-500 text-[10px] font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
            <span>Debug / GM Tools</span>
            <div class="h-px bg-neutral-800 flex-1"></div>
        </h3>
        <div class="grid grid-cols-2 gap-2">
            <button 
                @click="addResources"
                class="bg-neutral-900 border border-neutral-700 hover:border-amber-600 text-neutral-400 hover:text-amber-500 text-xs py-2 rounded transition-colors"
            >
                +1000 灵石
            </button>
             <button 
                @click="addExp"
                class="bg-neutral-900 border border-neutral-700 hover:border-amber-600 text-neutral-400 hover:text-amber-500 text-xs py-2 rounded transition-colors"
            >
                +100w 修为
            </button>
             <button 
                @click="addItems('pill_foundation')"
                class="bg-neutral-900 border border-neutral-700 hover:border-purple-600 text-neutral-400 hover:text-purple-500 text-xs py-2 rounded transition-colors"
            >
                获得筑基丹
            </button>
            <button 
                @click="addItems('manual_sweep')"
                class="bg-neutral-900 border border-neutral-700 hover:border-blue-600 text-neutral-400 hover:text-blue-500 text-xs py-2 rounded transition-colors"
            >
                获得功法
            </button>
             <button 
                @click="addContribution"
                class="bg-neutral-900 border border-neutral-700 hover:border-green-600 text-neutral-400 hover:text-green-500 text-xs py-2 rounded transition-colors"
            >
                +500 帮贡
            </button>
        </div>
        <div class="mt-4 text-[10px] text-neutral-600 font-mono text-center mb-2">--- 装备测试 ---</div>
        <div class="grid grid-cols-2 gap-2">
            <button 
                @click="addFWJSet_Low"
                class="bg-neutral-900 border border-neutral-700 hover:border-amber-600 text-neutral-400 hover:text-amber-500 text-xs py-2 rounded transition-colors"
            >
                梦幻新手套 (Lv.60)
            </button>
             <button 
                @click="addFWJSet_High"
                class="bg-neutral-900 border border-neutral-700 hover:border-amber-600 text-neutral-400 hover:text-amber-500 text-xs py-2 rounded transition-colors"
            >
                梦幻神装 (Lv.100)
            </button>
             <button 
                @click="addGemSet"
                class="bg-neutral-900 border border-neutral-700 hover:border-red-600 text-neutral-400 hover:text-red-500 text-xs py-2 rounded col-span-2 transition-colors"
            >
                获取宝石袋 (各 x5)
            </button>
        </div>
    </div>

    <!-- Danger Zone -->
    <div class="mt-auto pt-6 border-t border-red-900/20">
        <h3 class="text-red-800 text-sm font-bold mb-4 flex items-center gap-2">
            <span class="text-lg">⚠️</span> 危险区域
        </h3>
        
        <button 
            @click="confirmReset"
            class="w-full py-3 bg-red-950/30 border border-red-900/50 text-red-500 text-xs tracking-widest hover:bg-red-900/50 active:scale-95 transition-all rounded shadow-lg shadow-red-900/10"
        >
            [ 兵解重修 ]
        </button>
        <p class="text-[10px] text-neutral-600 mt-2 text-center">
            清除所有存档数据，重新开始游戏
        </p>
    </div>
    
    <div class="text-[10px] text-neutral-700 text-center pt-8 pb-4">
        Version 0.1.0 (Alpha)
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '../stores/player';
import { useInventoryStore } from '../stores/inventory';
import { useModal } from '../composables/useModal';
import { useToast } from '../composables/useToast';

const playerStore = usePlayerStore();
const inventoryStore = useInventoryStore();
const { showModal } = useModal();
const { addToast } = useToast();

function addResources() {
    playerStore.player.spiritStones += 1000;
    playerStore.save();
    addToast('获得 1000 灵石', 'success');
}

function addExp() {
    playerStore.addExp(1000000);
    addToast('获得 100w 修为', 'success');
}

function addItems(itemId: string) {
    inventoryStore.addItem(itemId, 1);
    addToast('获得物品', 'success');
}

function addContribution() {
    if (playerStore.player.sect) {
        playerStore.player.sect.contribution += 500;
        playerStore.save();
        addToast('获得 500 帮贡', 'success');
    } else {
        addToast('请先加入宗门', 'warning');
    }
}

function addFWJSet_Low() {
    inventoryStore.addItem('weapon_qinggang', 1);
    inventoryStore.addItem('armor_night', 1);
    inventoryStore.addItem('accessory_flower', 1);
    addToast('获得梦幻新手套', 'success');
}

function addFWJSet_High() {
    inventoryStore.addItem('weapon_yitian', 1);
    inventoryStore.addItem('armor_golden', 1);
    inventoryStore.addItem('accessory_soul', 1);
    addToast('获得梦幻神装', 'success');
}

function addGemSet() {
    inventoryStore.addItem('gem_sun', 5);
    inventoryStore.addItem('gem_moon', 5);
    inventoryStore.addItem('gem_light', 5);
    inventoryStore.addItem('gem_black', 5);
    addToast('获得宝石袋', 'success');
}

function confirmReset() {
  showModal({
    title: '兵解重修',
    content: '道友确定要放弃当前修为，重新来过吗？此操作无法撤销。',
    showCancel: true,
    onConfirm: () => {
      playerStore.reset();
      addToast('已重置数据', 'success');
    }
  });
}
</script>
