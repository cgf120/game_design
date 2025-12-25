<template>
  <div class="space-y-4 p-2 text-xs">
    <!-- Main Attributes -->
    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <XianxiaIcon src="ui_stat_atk" fallback="🗡️" size="xs" />
                <span>攻击</span>
            </div>
            <span class="text-amber-600 font-mono">{{ stats.atk }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <XianxiaIcon src="ui_stat_def" fallback="🛡️" size="xs" />
                <span>防御</span>
            </div>
            <span class="text-blue-600 font-mono">{{ stats.def }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <XianxiaIcon src="ui_stat_hp" fallback="❤️" size="xs" />
                <span>气血</span>
            </div>
            <span class="text-neutral-300 font-mono">{{ Math.floor(stats.hp) }}/{{ stats.maxHp }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <XianxiaIcon src="ui_stat_mp" fallback="💧" size="xs" />
                <span>灵力</span>
            </div>
            <span class="text-sky-600 font-mono">{{ Math.floor(stats.mp) }}/{{ stats.maxMp }}</span>
        </div>
        <div class="flex items-center justify-between border-b border-dashed border-neutral-800 pb-1">
            <div class="flex items-center gap-1 text-neutral-500">
                <span class="text-lg leading-none">⚡</span>
                <span>暴击</span>
            </div>
            <span class="text-neutral-400 font-mono">{{ (stats.critRate * 100).toFixed(1) }}%</span>
        </div>
    </div>

    <!-- Equipment Section -->
    <div>
        <div class="mt-4 mb-2 text-center text-neutral-600 text-[10px] tracking-widest flex items-center gap-2">
            <div class="h-px bg-neutral-800 flex-1"></div>
            <span>本命法宝</span>
            <div class="h-px bg-neutral-800 flex-1"></div>
        </div>
        <div class="space-y-1">
                <div class="flex justify-between items-center bg-black p-2 border border-neutral-800 rounded-sm">
                <span class="text-neutral-500 flex items-center gap-2">
                     <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs">武</div>
                     <span>武器</span>
                </span>
                <span class="text-amber-700">{{ getEquipName(equipment?.weapon) }}</span>
                </div>
                <div class="flex justify-between items-center bg-black p-2 border border-neutral-800 rounded-sm">
                <span class="text-neutral-500 flex items-center gap-2">
                     <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs">甲</div>
                     <span>衣袍</span>
                </span>
                <span class="text-blue-700">{{ getEquipName(equipment?.armor) }}</span>
                </div>
                <div class="flex justify-between items-center bg-black p-2 border border-neutral-800 rounded-sm">
                <span class="text-neutral-500 flex items-center gap-2">
                     <div class="w-6 h-6 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs">宝</div>
                    <span>法器</span>
                </span>
                <span class="text-purple-700">{{ getEquipName(equipment?.accessory) }}</span>
                </div>
        </div>
    </div>

    <!-- Spirit Root -->
    <div>
        <div class="mt-4 mb-2 text-center text-neutral-600 text-[10px] tracking-widest flex items-center gap-2">
            <div class="h-px bg-neutral-800 flex-1"></div>
            <span>五行灵根</span>
            <div class="h-px bg-neutral-800 flex-1"></div>
        </div>
        <div class="flex justify-between px-2 text-center bg-neutral-900/50 p-2 rounded">
            <div class="flex flex-col gap-1">
                <span class="text-yellow-700 font-bold">金</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.metal }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-green-700 font-bold">木</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.wood }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-blue-700 font-bold">水</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.water }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-red-700 font-bold">火</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.fire }}</span>
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-amber-800 font-bold">土</span>
                <span class="text-neutral-500 font-mono">{{ spiritRoot.earth }}</span>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getItem } from '../../../core/constants/items';
import XianxiaIcon from '../../shared/XianxiaIcon.vue';

const props = defineProps<{
    stats: any;
    equipment: any;
    spiritRoot: any;
}>();

function getEquipName(id?: string) {
    if (!id) return '空';
    return getItem(id)?.name || '未知';
}
</script>
