<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Equipped Skills -->
    <div>
        <h3 class="text-amber-500 font-bold mb-2 flex items-center gap-2">
            <XianxiaIcon src="ui_stat_mp" fallback="⚡" size="sm" />
            <span>已装备神通</span>
            <span class="text-neutral-500 text-xs font-normal ml-auto">{{ equippedSkills.length }} / {{ maxEquipped }}</span>
        </h3>
        
        <div class="grid grid-cols-4 gap-3 bg-neutral-900/50 p-3 rounded border border-neutral-800">
            <div 
                v-for="index in maxEquipped" 
                :key="`equip-${index}`"
                class="aspect-square bg-black border border-neutral-800 rounded relative group overflow-hidden"
                :class="getEquippedSkill(index - 1) ? 'border-amber-700/50 cursor-pointer hover:border-amber-500' : 'border-dashed opacity-50'"
                @click="getEquippedSkill(index - 1) && handleUnequip(getEquippedSkill(index - 1)!)"
            >
                <div v-if="getEquippedSkill(index - 1)" class="w-full h-full relative">
                     <XianxiaIcon 
                        :src="getSkillIcon(getEquippedSkill(index - 1)!)" 
                        fallback="📜" 
                        size="full" 
                        class="opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <!-- Skill Name Overlay -->
                    <div class="absolute bottom-0 left-0 right-0 bg-black/80 text-center py-0.5 pointer-events-none">
                         <span class="text-[9px] text-neutral-300 block transform scale-90 whitespace-nowrap overflow-hidden text-ellipsis px-1">
                            {{ getEquippedSkill(index - 1)!.name }}
                        </span>
                    </div>
                </div>
                <div v-else class="w-full h-full flex items-center justify-center text-neutral-700 text-xs">
                    空
                </div>
            </div>
        </div>
        <p class="text-[10px] text-neutral-500 mt-1 pl-1">* 点击已装备神通可卸下</p>
    </div>

    <div class="w-full h-px bg-amber-900/20 my-1"></div>

    <!-- Learned Skills List -->
    <div class="flex-1 min-h-0 flex flex-col">
        <h3 class="text-amber-500 font-bold mb-2">已习得神通</h3>
        <div class="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
             <div 
                v-for="skill in learnedSkills" 
                :key="skill.id"
                class="bg-neutral-900 border border-neutral-800 p-2 rounded flex justify-between items-center group hover:border-amber-900/50 transition-colors"
            >
                <div class="flex items-center gap-3">
                     <div class="w-10 h-10 bg-black border border-neutral-800 rounded flex items-center justify-center">
                        <XianxiaIcon :src="getSkillIcon(skill)" fallback="📘" size="sm" />
                     </div>
                     <div>
                         <div class="text-sm text-neutral-300 font-bold group-hover:text-amber-200">{{ skill.name }}</div>
                         <div class="text-[10px] text-neutral-500 space-x-2">
                             <span>{{ skillMap[skill.id]?.type === 'active' ? '【主动】' : '【被动】' }}</span>
                             <span>消耗: {{ skillMap[skill.id]?.cost || 0 }} 灵力</span>
                         </div>
                     </div>
                </div>

                <SpiritButton 
                    v-if="!isEquipped(skill.id)"
                    @click="handleEquip(skill)"
                    class="px-3 py-1 text-xs"
                    :disabled="equippedSkills.length >= maxEquipped"
                >
                    装备
                </SpiritButton>
                <span v-else class="text-xs text-neutral-500 px-3">已装备</span>
            </div>
            
            <div v-if="learnedSkills.length === 0" class="py-8 text-center text-neutral-600 text-xs italic">
                暂未领悟任何神通
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSkillStore } from '../../../stores/skill';
import { getSkill } from '../../../core/constants/skills';
import type { Skill } from '../../../core/models/skill';
import XianxiaIcon from '../../shared/XianxiaIcon.vue';
import SpiritButton from '../../shared/SpiritButton.vue';

const skillStore = useSkillStore();
const maxEquipped = 3; // Match store limit

// Computed
// We need to map user skills to static data for display details
const learnedSkills = computed(() => skillStore.learnedSkills);
const equippedSkills = computed(() => skillStore.equippedSkills);

// Create a map helper for template
const skillMap = computed(() => {
    const map: Record<string, any> = {};
    learnedSkills.value.forEach(s => {
        map[s.id] = getSkill(s.id);
    });
    return map;
});

// Helpers
function getEquippedSkill(index: number) {
    return equippedSkills.value[index];
}

function isEquipped(id: string) {
    return equippedSkills.value.some(s => s.id === id);
}

function getSkillIcon(skill: Skill) {
    // Mock icon logic based on skill ID or type
    const def = getSkill(skill.id);
    // Use existing assets for now
    if (def?.type === 'passive') return 'ui_bg_mandala'; // Passive -> Mandala
    if (def?.damageType === 'physical') return 'ui_stat_atk'; // Physical -> Sword/Atk
    if (def?.damageType === 'water') return 'ui_stat_mp'; // Magic -> Blue orb
    if (def?.damageType === 'fire') return 'ui_stat_hp';  // Fire -> Red orb (reusing HP for now)
    return 'icon_skills'; // Default
}

// Actions
function handleEquip(skill: Skill) {
   if (equippedSkills.value.length >= maxEquipped) return;
   skillStore.equipSkill(skill.id);
}

function handleUnequip(skill: Skill) {
    skillStore.unequipSkill(skill.id);
}

</script>
