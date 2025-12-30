import { ref } from 'vue';
import { usePlayerStore } from '../stores/player';
import { useInventoryStore } from '../stores/inventory';
import { MAPS } from '../core/constants/maps';
import type { GameMap, Enemy } from '../core/models/combat';
import { useSectStore } from '../stores/sect'; // Import SectStore

import { SKILLS } from '../core/constants/skills'; // Import SKILLS constant
import { getItem } from '../core/constants/items'; // Import getItem

export function useCombat() {
    const playerStore = usePlayerStore();

    const currentMap = ref<GameMap | null>(null);
    const currentEnemy = ref<Enemy | null>(null);
    const battleLogs = ref<string[]>([]);
    const isFighting = ref(false);
    const fightInterval = ref<number | null>(null);
    const skillCooldowns = ref<Record<string, number>>({}); // Map: skillId -> unlock timestamp

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
        if (isFighting.value) return;
        isFighting.value = true;
        // Tick every 1s for combat round
        fightInterval.value = window.setInterval(combatRound, 1000);
    };

    const stopAutoFight = () => {
        isFighting.value = false;
        if (fightInterval.value) {
            clearInterval(fightInterval.value);
            fightInterval.value = null;
        }
    };

    const combatRound = () => {
        if (!currentMap.value) return;

        // 1. If no enemy, find one (Respawn logic)
        if (!currentEnemy.value) {
            // Chance to trigger Gathering Event instead of Enemy Spawn?
            // For MVP, keep it simple: Enemies drop loot, but we can also auto-gather if no enemy found immediately or add a "gather" state.
            // Let's make "Gathering" a passive event that can happen when looking for enemies.
            if (currentMap.value.id === 'm1' && Math.random() < 1.0) {
                const invStore = useInventoryStore();
                if (invStore.addItem('mat_herb', 1)) {
                    log(`[采集] 在路边发现了一株 灵草。`);
                }
            }

            spawnEnemy();
            return;
        }

        // --- Combat Logic ---
        const attackRound = () => {
            if (!currentEnemy.value) return;

            // Safety check: if enemy is already dead (negative HP), trigger victory immediately
            if (currentEnemy.value.stats.hp <= 0) {
                handleVictory(currentEnemy.value);
                return;
            }

            // Use effective stats for calculation (Atk, Def, Speed, etc.)
            const playerStats = playerStore.effectiveStats;
            // Use mutable stats for HP/MP updates
            const playerMutableStats = playerStore.player.stats;

            const enemy = currentEnemy.value;

            // 1. Player Action
            // Check for usable skills
            let skillUsed = false;
            // const skillStore = useSkillStore(); // Removed unused

            // Iterate equipped skills
            for (const skillId of playerStore.player.skills.equipped) {
                const skill = SKILLS[skillId];
                if (!skill) continue;

                const now = Date.now();
                const cdReady = (skillCooldowns.value[skillId] || 0) <= now;
                const mpReady = playerMutableStats.mp >= skill.cost;

                if (cdReady && mpReady) {
                    // EXECUTE SKILL
                    skillUsed = true;

                    // Pay Cost
                    playerMutableStats.mp -= skill.cost;

                    // Set CD
                    skillCooldowns.value[skillId] = now + (skill.cooldown * 1000);

                    // Apply Effect
                    let damage = 0;

                    if (skill.effect.type === 'damage') {
                        // Calc Damage
                        const mult = skill.effect.value;
                        const isCrit = Math.random() < playerStats.critRate;
                        let rawDmg = playerStats.atk * mult;
                        if (isCrit) rawDmg *= 1.5;

                        // Defense Mitigation
                        const actualDmg = Math.max(1, Math.floor(rawDmg - (enemy.stats.def * 0.5))); // Enemy def effectiveness

                        damage = Math.floor(actualDmg * (0.95 + Math.random() * 0.1));

                        // Apply to enemy
                        enemy.stats.hp -= damage;

                        log(`[神通] 你施展了【${skill.name}】，消耗 ${skill.cost} 灵力，造成了 ${damage} 点伤害！${isCrit ? '(暴击!)' : ''}`);
                    }
                    else if (skill.effect.type === 'heal') {
                        const healAmount = Math.floor(playerStats.maxHp * skill.effect.value);
                        playerMutableStats.hp = Math.min(playerStats.maxHp, playerMutableStats.hp + healAmount);
                        log(`[神通] 你施展了【${skill.name}】，恢复了 ${healAmount} 点气血！`);
                    }
                    else if (skill.effect.type === 'buff_stats') {
                        log(`[神通] 你施展了【${skill.name}】，状态提升！(Buff效果暂未实装)`);
                    }

                    break; // Only one skill per turn
                }
            }

            if (!skillUsed) {
                // Basic Attack
                const isCrit = Math.random() < playerStats.critRate;
                let damage = Math.max(1, playerStats.atk - enemy.stats.def); damage = Math.floor(damage * (0.95 + Math.random() * 0.1));
                if (isCrit) {
                    damage = Math.floor(damage * 1.5);
                }
                enemy.stats.hp -= damage;
                log(`你攻击了 ${enemy.name}，造成 ${damage} 点伤害。${isCrit ? '(暴击!)' : ''}`);
            }

            // Check Victory
            if (enemy.stats.hp <= 0) {
                handleVictory(enemy);
                return;
            }

            // 2. Enemy Action
            // Enemy basic attack (Skills for enemy later?)
            const isDodge = Math.random() < playerStats.dodgeRate;
            if (isDodge) {
                log(`${enemy.name} 发动攻击，但被你躲开了！`);
            } else {
                let enemyDmg = Math.max(1, enemy.stats.atk - playerStats.def); enemyDmg = Math.floor(enemyDmg * (0.95 + Math.random() * 0.1));
                playerMutableStats.hp -= enemyDmg;
                log(`${enemy.name} 攻击了你，造成 ${enemyDmg} 点伤害。`);
            }

            // Check Defeat
            if (playerMutableStats.hp <= 0) {
                handleDefeat();
            }

            // Regen MP a tiny bit each turn?
            if (playerMutableStats.mp < playerStats.maxMp) {
                playerMutableStats.mp = Math.min(playerStats.maxMp, playerMutableStats.mp + 1);
            }
        };

        // Call attackRound from combatRound
        attackRound();
    }; // End of combatRound

    const spawnEnemy = () => {
        if (!currentMap.value) return;

        // Special: Patrol Logic (Dynamic Scaling)
        if (currentMap.value.id === 'sect_patrol') {
            // Generate a random enemy based on player level +/- 1
            const pRealm = playerStore.player.cultivation.realmId;
            const level = Math.max(1, pRealm + (Math.random() > 0.5 ? 1 : -1));

            // Simple template generator
            const names = ['黑衣人', '偷药贼', '流窜妖兽'];
            const name = names[Math.floor(Math.random() * names.length)] || '敌方修士';

            currentEnemy.value = {
                id: 'sect_intruder', // FIXED ID for task
                name,
                level,
                realmId: level,
                stats: {
                    hp: level * 80,
                    maxHp: level * 80,
                    atk: level * 8 + 5,
                    def: level * 2
                },
                expReward: level * 8,
                drops: [],
                skills: []
            };
            log(`[遭遇] 巡逻中发现了 ${currentEnemy.value?.name}！(Lv.${currentEnemy.value?.level})`);
            return;
        }

        const enemies = currentMap.value.enemies;
        if (enemies.length === 0) return; // Should not happen for normal maps

        const template = enemies[Math.floor(Math.random() * enemies.length)];
        // Clone enemy to avoid modifying the template
        currentEnemy.value = JSON.parse(JSON.stringify(template));
        log(`[遭遇] 遇到了 ${currentEnemy.value?.name}！(Lv.${currentEnemy.value?.level})`);
    };

    const handleVictory = (enemy: Enemy) => {
        try {
            log(`[胜利] 击败了 ${enemy.name}！获得 ${enemy.expReward} 修为。`);
            playerStore.addExp(enemy.expReward);

            // Restore 10% HP/MP
            // Use effective stats directly
            const pStats = playerStore.effectiveStats; // Max values
            const pMutable = playerStore.player.stats; // Current values used for writing

            const hpRec = Math.max(1, Math.floor(pStats.maxHp * 0.1));
            const mpRec = Math.max(1, Math.floor(pStats.maxMp * 0.1));

            pMutable.hp = Math.min(pStats.maxHp, pMutable.hp + hpRec);
            pMutable.mp = Math.min(pStats.maxMp, pMutable.mp + mpRec);
            log(`[战胜回气] 气血恢复 ${hpRec}，灵力恢复 ${mpRec}。`);

            // Update Sect Task Progress
            const sectStore = useSectStore();
            sectStore.updateActiveTaskProgress(enemy.id);

            // Drop Logic (Combined Map + Enemy Drops)
            const allDrops: any[] = [];
            if (currentMap.value && currentMap.value.drops) {
                allDrops.push(...currentMap.value.drops);
            }
            if (enemy.drops) {
                allDrops.push(...enemy.drops);
            }

            if (allDrops.length > 0) {
                const invStore = useInventoryStore();
                for (const drop of allDrops) {
                    if (Math.random() < drop.chance) {
                        // Determine amount (min-max)
                        const amount = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;

                        // Fix: Use imported getItem, inventory store does not expose getItem
                        const item = getItem(drop.itemId);

                        if (invStore.addItem(drop.itemId, amount)) {
                            const name = item ? item.name : drop.itemId;
                            log(`[战利品] 获得了 ${name} x${amount}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in handleVictory:', error);
            log(`[系统] 战斗结算发生异常，请联系管理员。`);
        } finally {
            currentEnemy.value = null;
        }
    };

    const handleDefeat = () => {
        log(`[失败] 你被击败了！慌忙逃离了 ${currentMap.value?.name}。`);
        playerStore.player.stats.hp = 1; // Survive with 1 HP
        leaveMap();
    };

    const log = (msg: string) => {
        battleLogs.value.unshift(msg);
        if (battleLogs.value.length > 50) battleLogs.value.pop();
    };

    return {
        currentMap,
        currentEnemy,
        battleLogs,
        isFighting,
        enterMap,
        leaveMap,
        stopAutoFight
    };
}
