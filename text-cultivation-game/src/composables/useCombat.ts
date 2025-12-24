import { ref, computed } from 'vue';
import { usePlayerStore } from '../stores/player';
import { useInventoryStore } from '../stores/inventory';
import { MAPS } from '../core/constants/maps';
import type { GameMap, Enemy } from '../core/models/combat';

export function useCombat() {
    const playerStore = usePlayerStore();

    const currentMap = ref<GameMap | null>(null);
    const currentEnemy = ref<Enemy | null>(null);
    const combatLogs = ref<string[]>([]);
    const isAutoFighting = ref(false);
    let fightInterval: number | null = null;

    // Start combat in a specific map
    const enterMap = (mapId: string) => {
        const map = MAPS.find(m => m.id === mapId);
        if (!map) return;

        // Check Realm Requirement
        if (playerStore.player.cultivation.realmId < map.reqRealmId) {
            log(`[系统] 境界不足，无法进入 ${map.name}！(需 ${map.reqRealmId} 级)`);
            return;
        }

        currentMap.value = map;
        log(`[系统] 进入了 ${map.name}。`);
        startAutoFight();
    };

    const leaveMap = () => {
        stopAutoFight();
        currentMap.value = null;
        currentEnemy.value = null;
        log(`[系统] 离开了历练之地。`);
    };

    const startAutoFight = () => {
        if (isAutoFighting.value) return;
        isAutoFighting.value = true;
        // Tick every 1s for combat round
        fightInterval = window.setInterval(combatRound, 1000);
    };

    const stopAutoFight = () => {
        isAutoFighting.value = false;
        if (fightInterval) {
            clearInterval(fightInterval);
            fightInterval = null;
        }
    };

    const combatRound = () => {
        if (!currentMap.value) return;

        // 1. If no enemy, find one (Respawn logic)
        if (!currentEnemy.value) {
            spawnEnemy();
            return;
        }

        // 2. Fight Logic
        const player = playerStore.player;
        const enemy = currentEnemy.value;

        // Player attacks Enemy
        const pDmg = Math.max(1, player.stats.atk - enemy.stats.def);
        enemy.stats.hp -= pDmg;
        log(`[战斗] 你攻击了 ${enemy.name}，造成 ${pDmg} 点伤害。(敌血: ${Math.max(0, enemy.stats.hp)})`);

        if (enemy.stats.hp <= 0) {
            handleVictory(enemy);
            return;
        }

        // Enemy attacks Player
        const eDmg = Math.max(1, enemy.stats.atk - player.stats.def);
        player.stats.hp -= eDmg; // Note: This modifies the store state directly? Better to have an action.
        log(`[战斗] ${enemy.name} 攻击了你，造成 ${eDmg} 点伤害。`);

        if (player.stats.hp <= 0) {
            handleDefeat();
        }
    };

    const spawnEnemy = () => {
        if (!currentMap.value) return;
        const enemies = currentMap.value.enemies;
        const template = enemies[Math.floor(Math.random() * enemies.length)];
        // Clone enemy to avoid modifying the template
        currentEnemy.value = JSON.parse(JSON.stringify(template));
        log(`[遭遇] 遇到了 ${currentEnemy.value?.name}！(Lv.${currentEnemy.value?.level})`);
    };

    const handleVictory = (enemy: Enemy) => {
        log(`[胜利] 击败了 ${enemy.name}！获得 ${enemy.expReward} 修为。`);
        playerStore.addExp(enemy.expReward);

        // Drop Logic
        // For now, simpler random drop based on hardcoded chance
        // MVP: 100% drop rate for testing
        if (enemy.name === '野狼' && Math.random() < 1.0) {
            const invStore = useInventoryStore();
            // Drop Material
            if (invStore.addItem('mat_wolf_fang', 1)) {
                log(`[战利品] 获得了 狼牙 x1`);
            }
            // Drop Weapon (New for testing)
            if (Math.random() < 0.5 && invStore.addItem('weap_iron_sword', 1)) {
                log(`[战利品] 获得了 铁剑 x1`);
            }
        }
        if (enemy.name === '狂暴野猪' && Math.random() < 1.0) {
            const invStore = useInventoryStore();
            // Drop Material
            if (invStore.addItem('mat_boar_skin', 1)) {
                log(`[战利品] 获得了 野猪皮 x1`);
            }
            // Drop Armor (New for testing)
            if (Math.random() < 0.5 && invStore.addItem('armor_cloth', 1)) {
                log(`[战利品] 获得了 布衣 x1`);
            }
        }

        currentEnemy.value = null;

        // Full heal after battle as requested
        playerStore.player.stats.hp = playerStore.player.stats.maxHp;
    };

    const handleDefeat = () => {
        log(`[失败] 你被击败了！慌忙逃离了 ${currentMap.value?.name}。`);
        playerStore.player.stats.hp = 1; // Survive with 1 HP
        leaveMap();
    };

    const log = (msg: string) => {
        combatLogs.value.unshift(msg);
        if (combatLogs.value.length > 50) combatLogs.value.pop();
    };

    return {
        currentMap,
        currentEnemy,
        combatLogs,
        isAutoFighting,
        enterMap,
        leaveMap,
        stopAutoFight
    };
}
