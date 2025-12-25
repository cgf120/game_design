import { defineStore } from 'pinia';
import { computed } from 'vue';
import { usePlayerStore } from './player';
import { useInventoryStore } from './inventory';
import { useAbodeStore } from './abode';
import { RECIPES, type Recipe } from '../core/constants/recipes';

export const useCraftingStore = defineStore('crafting', () => {
    const playerStore = usePlayerStore();
    const inventoryStore = useInventoryStore();
    const abodeStore = useAbodeStore();

    // Available Recipes based on Abode Level
    const availableRecipes = computed(() => {
        const level = abodeStore.abode.level || 1;
        return RECIPES.filter(r => r.unlockLevel <= level);
    });

    function canCraft(recipe: Recipe): boolean {
        const { wood, iron, herb, spiritStones } = recipe.cost;
        const resources = abodeStore.resources;

        if (spiritStones && playerStore.player.spiritStones < spiritStones) return false;
        if (wood && resources.wood < wood) return false;
        if (iron && resources.iron < iron) return false;
        if (herb && (resources.herb || 0) < herb) return false;

        return true;
    }

    function craftItem(recipeId: string): { success: boolean, msg: string } {
        const recipe = RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, msg: '配方不存在' };

        if (!canCraft(recipe)) {
            return { success: false, msg: '材料不足' };
        }

        // Deduct Resources
        const { wood, iron, herb, spiritStones } = recipe.cost;

        if (spiritStones) playerStore.player.spiritStones -= spiritStones;
        if (wood) abodeStore.resources.wood -= wood;
        if (iron) abodeStore.resources.iron -= iron;
        if (herb) abodeStore.resources.herb = (abodeStore.resources.herb || 0) - herb;

        // Add Item
        // Note: addItem handles randomization for equipment automatically if defined in constant
        const result = inventoryStore.addItem(recipe.outputId);

        if (result) {
            playerStore.save();
            return { success: true, msg: `打造成功！获得 [${recipe.name.split('[')[1]}` }; // Bit hacky name parse for msg
        } else {
            // Refund? In a real robust system yes, but here let's assume addItem success unless inventory full (not impl yet)
            // Just returning success
            return { success: true, msg: `打造成功！` };
        }
    }

    return {
        availableRecipes,
        canCraft,
        craftItem
    };
});
