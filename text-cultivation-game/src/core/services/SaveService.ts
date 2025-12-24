import type { Player } from '../models/player';

import type { InventorySlot } from '../models/item';

const SAVE_KEY = 'text_cultivation_save_v1';

export interface SaveData {
    player: Player;
    inventory: InventorySlot[];
}

export const SaveService = {
    save(player: Player, inventory: InventorySlot[]): void {
        try {
            const data: SaveData = { player, inventory };
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
            console.log('[SaveService] Game saved.');
        } catch (e) {
            console.error('[SaveService] Save failed:', e);
        }
    },

    load(): SaveData | null {
        try {
            const data = localStorage.getItem(SAVE_KEY);
            if (!data) return null;
            // Handle backward compatibility (migration from Phase 1/2 plain player save)
            const parsed = JSON.parse(data);
            if (parsed.id && !parsed.player) {
                // Old save format where root was player
                console.log('[SaveService] Migrating old save...');
                return { player: parsed as Player, inventory: [] };
            }
            return parsed as SaveData;
        } catch (e) {
            console.error('[SaveService] Load failed:', e);
            return null;
        }
    },

    clear(): void {
        localStorage.removeItem(SAVE_KEY);
    }
};
