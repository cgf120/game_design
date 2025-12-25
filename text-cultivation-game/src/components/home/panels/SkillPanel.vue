<template>
  <div class="space-y-4">
     <div class="flex justify-around mb-4 border-b border-neutral-800 pb-2">
        <!-- Equipped Slots -->
        <div 
            v-for="(skill, idx) in equippedSkills" 
            :key="skill.id"
            @click="skillStore.unequipSkill(skill.id)"
            class="w-16 h-16 border border-amber-900/50 bg-black flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-colors relative"
        >
            <div class="text-[10px] text-amber-500 text-center leading-tight">{{ skill.name }}</div>
            <div class="text-[8px] text-neutral-600 mt-1">CD{{ skill.cooldown }}</div>
            <div class="absolute -top-1 -right-1 text-[8px] text-neutral-700">IV</div>
        </div>
        
        <!-- Empty Slots -->
        <div 
            v-for="n in (3 - equippedSkills.length)" 
            :key="`empty-${n}`"
            class="w-16 h-16 border border-neutral-800 border-dashed bg-transparent flex items-center justify-center"
        >
            <span class="text-neutral-800 text-xl font-thin">+</span>
        </div>
     </div>
     
     <div class="space-y-1">
        <div v-if="learnedSkills.length === 0" class="text-center text-neutral-700 py-4 text-xs">暂无领悟神通</div>
        <div 
            v-for="skill in learnedSkills" 
            :key="skill.id"
            class="flex justify-between items-center p-3 border-b border-neutral-900 hover:bg-neutral-900/50"
        >
            <div>
                <div class="text-neutral-300">{{ skill.name }}</div>
                <div class="text-[10px] text-neutral-600">{{ skill.desc }}</div>
            </div>
            <button 
                v-if="!isEquipped(skill.id)"
                @click="skillStore.equipSkill(skill.id)"
                :disabled="equippedSkills.length >= 3"
                class="text-xs px-3 py-1 border border-neutral-700 hover:border-neutral-500 text-neutral-500 rounded-sm"
            >
                装备
            </button>
            <span v-else class="text-[10px] text-amber-900">已装配</span>
        </div>
     </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSkillStore } from '../../../stores/skill';

const skillStore = useSkillStore();
const equippedSkills = computed(() => skillStore.equippedSkills);
const learnedSkills = computed(() => skillStore.learnedSkills);

function isEquipped(id: string) {
    return skillStore.equippedSkills.some(s => s.id === id);
}
</script>
