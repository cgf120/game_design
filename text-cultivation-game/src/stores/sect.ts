import { defineStore } from 'pinia';
import { computed } from 'vue';
import { usePlayerStore } from './player';
import { SECTS, getSect, getRank } from '../core/constants/sects';
import { useInventoryStore } from './inventory';

export const useSectStore = defineStore('sect', () => {
    const playerStore = usePlayerStore();
    const inventoryStore = useInventoryStore();

    // --- Getters ---
    const playerSectInfo = computed(() => playerStore.player.sect);

    const currentSect = computed(() => {
        if (!playerSectInfo.value) return null;
        return getSect(playerSectInfo.value.sectId);
    });

    const currentRank = computed(() => {
        if (!currentSect.value || !playerSectInfo.value) return null;
        return getRank(currentSect.value, playerSectInfo.value.rankId);
    });

    const canClaimSalary = computed(() => {
        if (!playerSectInfo.value) return false;
        const now = Date.now();
        const last = playerSectInfo.value.lastSalaryTime;
        const oneDay = 24 * 60 * 60 * 1000;
        return now - last >= oneDay;
    });

    // --- Actions ---

    // Join a Sect
    function joinSect(sectId: string): boolean {
        if (playerStore.player.sect) return false; // Already in a sect

        const sect = getSect(sectId);
        if (!sect) return false;

        // Check Realm Requirement
        if (playerStore.player.cultivation.realmId < sect.reqRealmId) {
            return false;
        }

        // Initialize Sect Info
        playerStore.player.sect = {
            sectId: sect.id,
            rankId: sect.ranks[0].id, // Start at lowest rank
            contribution: 0,
            joinTime: Date.now(),
            lastSalaryTime: 0,
            activeTask: undefined
        };

        playerStore.save();
        return true;
    }

    // Quit Sect
    function quitSect() {
        if (!playerStore.player.sect) return;

        // Penalty: Clear contribution? For now, just remove.
        playerStore.player.sect = undefined;
        playerStore.save();
    }

    // Claim Daily Salary
    function claimSalary(): { success: boolean, msg: string } {
        if (!playerStore.player.sect || !currentRank.value) return { success: false, msg: '无宗门' };

        const now = Date.now();
        const last = playerStore.player.sect.lastSalaryTime;
        const oneDay = 24 * 60 * 60 * 1000;

        // Simple check: is it a different calendar day? Or just 24h cooldown?
        // Let's use 24h cooldown for robustness first
        if (now - last < oneDay) {
            return { success: false, msg: '今日俸禄已领取' };
        }

        playerStore.player.spiritStones += currentRank.value.salary;
        playerStore.player.sect.lastSalaryTime = now;
        playerStore.save();

        return { success: true, msg: `领取成功！获得 ${currentRank.value.salary} 灵石` };
    }

    // Promote Rank
    function promote(): { success: boolean, msg: string } {
        if (!playerStore.player.sect || !currentSect.value || !currentRank.value) return { success: false, msg: '系统错误' };

        const ranks = currentSect.value.ranks;
        const currentIdx = ranks.findIndex(r => r.id === currentRank.value?.id);
        if (currentIdx === -1 || currentIdx >= ranks.length - 1) {
            return { success: false, msg: '已是最高职位' };
        }

        const nextRank = ranks[currentIdx + 1];
        if (playerStore.player.sect.contribution < nextRank.contributionReq) {
            return { success: false, msg: `贡献不足 (需 ${nextRank.contributionReq})` };
        }

        // Deduct Contribution
        playerStore.player.sect.contribution -= nextRank.contributionReq;
        playerStore.player.sect.rankId = nextRank.id;
        playerStore.save();

        return { success: true, msg: `恭喜晋升为 ${nextRank.name}！` };
    }

    // Start Task
    function startTask(taskId: string): boolean {
        if (!playerStore.player.sect) return false;
        if (playerStore.player.sect.activeTask) return false; // Already has task

        playerStore.player.sect.activeTask = {
            taskId: taskId,
            startTime: Date.now(),
            progress: 0
        };
        playerStore.save();
        return true;
    }

    // Update Progress (for Hunt tasks)
    function updateActiveTaskProgress(targetId: string, amount: number = 1) {
        if (!playerStore.player.sect || !playerStore.player.sect.activeTask || !currentSect.value) return;

        const { taskId, progress } = playerStore.player.sect.activeTask;
        const task = currentSect.value.tasks.find(t => t.id === taskId);

        if (task && task.type === 'hunt' && task.targetId === targetId) {
            const newProgress = Math.min(task.count, (progress || 0) + amount); // Should we cap it? Or just let it grow.
            playerStore.player.sect.activeTask.progress = newProgress;
            playerStore.save();
        }
    }

    // Complete Task
    function completeTask(): { success: boolean, msg: string } {
        if (!playerStore.player.sect || !playerStore.player.sect.activeTask || !currentSect.value) return { success: false, msg: '无进行中的任务' };

        const { taskId, startTime, progress } = playerStore.player.sect.activeTask;
        const task = currentSect.value.tasks.find(t => t.id === taskId);
        if (!task) return { success: false, msg: '任务数据错误' };

        // Check Type Specific Requirements

        // 1. Time-based (none for now if patrol is hunt, but legacy support?)
        if (task.duration) {
            const now = Date.now();
            const durationMs = (task.duration || 0) * 1000;
            if (now - startTime < durationMs) {
                const remaining = Math.ceil((durationMs - (now - startTime)) / 1000);
                return { success: false, msg: `任务进行中...还需 ${remaining} 秒` };
            }
        }

        // 2. Collect Items
        if (task.type === 'collect' && task.targetId) {
            if (!inventoryStore.removeItem(task.targetId, task.count)) {
                return { success: false, msg: `缺少任务物品` };
            }
        }

        // 3. Hunt (Check progress)
        if (task.type === 'hunt') {
            if ((progress || 0) < task.count) {
                return { success: false, msg: `目标击杀数量不足 (${progress || 0}/${task.count})` };
            }
        }

        // Award Rewards
        playerStore.player.sect.contribution += task.rewardContribution;
        playerStore.player.spiritStones += task.rewardStones;

        // Clear Task
        playerStore.player.sect.activeTask = undefined;
        playerStore.save();

        return { success: true, msg: `任务完成！贡献+${task.rewardContribution}, 灵石+${task.rewardStones}` };
    }

    return {
        playerSectInfo,
        currentSect,
        currentRank,
        joinSect,
        quitSect,
        claimSalary,
        promote,
        startTask,
        completeTask,
        updateActiveTaskProgress, // Export this
        canClaimSalary
    };
});
