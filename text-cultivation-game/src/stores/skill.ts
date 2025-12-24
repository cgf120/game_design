import { defineStore } from 'pinia';
import { computed } from 'vue';
import { usePlayerStore } from './player';
import { SKILLS } from '../core/constants/skills';
import type { Skill } from '../core/models/skill';

export const useSkillStore = defineStore('skill', () => {
    const playerStore = usePlayerStore();

    // Getters
    const learnedSkills = computed(() => {
        return playerStore.player.skills?.learned.map(id => SKILLS[id]).filter(Boolean) || [];
    });

    const equippedSkills = computed(() => {
        return playerStore.player.skills?.equipped.map(id => SKILLS[id]).filter(Boolean) || [];
    });

    const allSkills = computed(() => SKILLS);

    // Actions
    function learnSkill(skillId: string): boolean {
        if (!SKILLS[skillId]) return false;
        if (playerStore.player.skills.learned.includes(skillId)) return false; // Already learned

        // Check requirements (e.g. realm)
        const skill = SKILLS[skillId];
        if (skill.reqRealmId && playerStore.player.cultivation.realmId < skill.reqRealmId) {
            return false;
        }

        playerStore.player.skills.learned.push(skillId);
        playerStore.save();
        return true;
    }

    function equipSkill(skillId: string): boolean {
        if (!playerStore.player.skills.learned.includes(skillId)) return false;
        if (playerStore.player.skills.equipped.includes(skillId)) return false;

        // Limit max equipped skills (e.g., 3)
        if (playerStore.player.skills.equipped.length >= 3) {
            return false;
        }

        playerStore.player.skills.equipped.push(skillId);
        playerStore.save();
        return true;
    }

    function unequipSkill(skillId: string) {
        const idx = playerStore.player.skills.equipped.indexOf(skillId);
        if (idx > -1) {
            playerStore.player.skills.equipped.splice(idx, 1);
            playerStore.save();
        }
    }

    return {
        learnedSkills,
        equippedSkills,
        allSkills,
        learnSkill,
        equipSkill,
        unequipSkill
    };
});
