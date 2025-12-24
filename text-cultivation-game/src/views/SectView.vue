<template>
  <div class="space-y-4">
    <!-- Non-Member View: Join Sect -->
    <div v-if="!currentSect" class="flex flex-col gap-4">
      <div 
        v-for="sect in availableSects" 
        :key="sect.id"
        class="bg-neutral-800 p-4 rounded border border-neutral-700"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-bold text-amber-500">{{ sect.name }}</h3>
          <span class="text-xs text-neutral-500">条件: {{ getRealmName(sect.reqRealmId) }}</span>
        </div>
        <p class="text-neutral-400 text-sm mb-4">{{ sect.desc }}</p>
        <button 
          @click="handleJoin(sect.id)"
          class="w-full py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-200"
        >
          拜入宗门
        </button>
      </div>
    </div>

    <!-- Member View: Sect Main Interface -->
    <div v-else class="flex flex-col h-full">
      <!-- Header Info -->
      <div class="bg-neutral-800 p-4 rounded border border-neutral-700 mb-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-amber-500">{{ currentSect.name }}</h2>
          <span class="text-sm text-neutral-400">职位: <span class="text-emerald-400">{{ currentRank?.name }}</span></span>
        </div>
        <div class="flex justify-between text-xs text-neutral-400">
          <span>贡献: {{ playerSectInfo?.contribution }}</span>
          <span>每日俸禄: {{ currentRank?.salary }} 灵石</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-neutral-700 mb-4">
        <button 
          v-for="tab in ['大殿', '任务', '藏经阁']" 
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'flex-1 py-2 text-sm text-center',
            activeTab === tab ? 'text-amber-500 border-b-2 border-amber-500' : 'text-neutral-500'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Tab Content: Main Hall -->
      <div v-if="activeTab === '大殿'" class="space-y-4">
        <div class="bg-neutral-800 p-4 rounded border border-neutral-700 flex justify-between items-center">
          <div>
            <h4 class="text-neutral-200">每日俸禄</h4>
            <p class="text-xs text-neutral-500">每日可领取一次</p>
          </div>
          <button 
            @click="handleSalary"
            :disabled="!canClaimSalary"
            :class="[
                'px-4 py-2 rounded text-sm transition-colors',
                canClaimSalary ? 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            ]"
          >
            {{ canClaimSalary ? '领取' : '已领取' }}
          </button>
        </div>

        <div class="bg-neutral-800 p-4 rounded border border-neutral-700">
             <h4 class="text-neutral-200 mb-2">职位晋升</h4>
             <div class="text-xs text-neutral-400 mb-4">
                当前: {{ currentRank?.name }} <br>
                下一级需要贡献: {{ nextRankContributionReq }}
             </div>
             <button 
                @click="handlePromote"
                class="w-full py-2 bg-amber-800 text-amber-200 rounded text-sm hover:bg-amber-700"
             >
                晋升
             </button>
        </div>

        <button 
            @click="handleQuit"
            class="w-full py-2 bg-red-900/30 text-red-400 rounded text-sm hover:bg-red-900/50 mt-8"
        >
            退出宗门
        </button>
      </div>

      <!-- Tab Content: Tasks -->
      <div v-if="activeTab === '任务'" class="space-y-4">
        <!-- Active Task -->
        <div v-if="playerSectInfo?.activeTask" class="bg-emerald-900/20 border border-emerald-800 p-4 rounded">
            <h4 class="text-emerald-400 font-bold mb-2">进行中: {{ getTaskName(playerSectInfo.activeTask.taskId) }}</h4>
            <div class="text-xs text-neutral-400 mb-4">
                {{ getTaskDesc(playerSectInfo.activeTask.taskId) }}
            </div>
            
            <!-- Progress / Timer -->
             <div class="mb-4 text-center">
                <div class="text-2xl font-mono text-emerald-300">{{ countdownDisplay }}</div>
                <div class="text-xs text-emerald-600">任务进度</div>
             </div>

            <button 
                @click="handleCompleteTask"
                class="w-full py-2 bg-emerald-700 text-white rounded hover:bg-emerald-600"
            >
                完成任务
            </button>
        </div>

        <!-- Available Tasks -->
        <div v-else class="space-y-3">
             <div 
                v-for="task in currentSect.tasks" 
                :key="task.id"
                class="bg-neutral-800 p-3 rounded border border-neutral-700 flex justify-between items-center"
             >
                <div class="flex-1">
                    <div class="text-sm font-bold text-neutral-200">{{ task.name }}</div>
                    <div class="text-xs text-neutral-500">{{ task.desc }}</div>
                    <div class="text-xs text-amber-800 mt-1">
                        奖励: 贡献{{ task.rewardContribution }} 灵石{{ task.rewardStones }}
                        <span v-if="task.duration" class="ml-2 text-blue-400">耗时: {{task.duration}}秒</span>
                    </div>
                </div>
                <button 
                    @click="handleStartTask(task)"
                    class="px-3 py-1 bg-neutral-700 text-neutral-300 rounded text-xs hover:bg-neutral-600 ml-2"
                >
                    接取
                </button>
             </div>
        </div>
      </div>


       <!-- Tab Content: Pavilion (Placeholder) -->
       <div v-if="activeTab === '藏经阁'" class="text-center text-neutral-500 py-8">
            <p>藏经阁暂未开放...</p>
       </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; // Add router
import { useSectStore } from '../stores/sect';
import { SECTS } from '../core/constants/sects';
import { getRealm } from '../core/constants/realms';
import { useModal } from '../composables/useModal';
import type { SectTask } from '../core/models/sect';

const router = useRouter();
const sectStore = useSectStore();
const { showModal } = useModal();

const availableSects = SECTS;
const currentSect = computed(() => sectStore.currentSect);
const currentRank = computed(() => sectStore.currentRank);
const playerSectInfo = computed(() => sectStore.playerSectInfo);
const canClaimSalary = computed(() => sectStore.canClaimSalary);

const activeTab = ref('大殿');

// Task Timer Logic
const now = ref(Date.now());
const timerId = ref<number | null>(null);

onMounted(() => {
    timerId.value = window.setInterval(() => {
        now.value = Date.now();
    }, 1000);
});
onUnmounted(() => {
    if(timerId.value) clearInterval(timerId.value);
});

const countdownDisplay = computed(() => {
    if (!playerSectInfo.value?.activeTask || !currentSect.value) return '00:00';
    
    const task = currentSect.value.tasks.find(t => t.id === playerSectInfo.value?.activeTask?.taskId);
    if (!task) return '进行中';

    // Hunt / Kill Task
    if (task.type === 'hunt') {
        const current = playerSectInfo.value.activeTask.progress || 0;
        const target = task.count;
        if (current >= target) return '可完成';
        return `${current} / ${target}`;
    }

    // Collect Task (Simulate checking inventory? Or just show target)
    if (task.type === 'collect') {
         // We might not track collect progress in activeTask, but we could check inventory here if we wanted
         return `收集 ${task.count}个`;
    }

    // Time Task
    if (task.duration) {
        const startTime = playerSectInfo.value.activeTask.startTime;
        const durationMs = task.duration * 1000;
        const remaining = Math.max(0, Math.ceil((startTime + durationMs - now.value) / 1000));
        
        if (remaining <= 0) return '可完成';
        return `${remaining}s`;
    }

    return '进行中';
});


// Helper
function getRealmName(id: number) {
  return getRealm(id)?.name || '未知';
}

function getTaskName(id: string) {
    return currentSect.value?.tasks.find(t => t.id === id)?.name || '未知任务';
}
function getTaskDesc(id: string) {
    return currentSect.value?.tasks.find(t => t.id === id)?.desc || '';
}

const nextRankContributionReq = computed(() => {
    if(!currentSect.value || !currentRank.value) return '---';
    const ranks = currentSect.value.ranks;
    const currentIdx = ranks.findIndex(r => r.id === currentRank.value?.id);
    if(currentIdx < ranks.length - 1) {
        return ranks[currentIdx+1].contributionReq;
    }
    return 'max';
});

// Actions
function handleJoin(id: string) {
    if (sectStore.joinSect(id)) {
        showModal({ title: '恭喜', content: '成功拜入宗门！' });
    } else {
        showModal({ title: '失败', content: '境界不足或未知错误。' });
    }
}

function handleSalary() {
    const res = sectStore.claimSalary();
    showModal({ title: res.success ? '成功' : '提示', content: res.msg });
}

function handlePromote() {
    const res = sectStore.promote();
    showModal({ title: res.success ? '晋升成功' : '提示', content: res.msg });
}

function handleQuit() {
    showModal({
        title: '退出宗门',
        content: '确定要退出吗？贡献将被清空。',
        showCancel: true,
        confirmText: '坚决退出',
        onConfirm: () => {
            sectStore.quitSect();
        }
    });
}

function handleStartTask(task: SectTask) {
    if (sectStore.startTask(task.id)) {
         // 2. Redirect logic based on task type
         if (task.type === 'collect' && task.id === 'task_collect_herb') {
             showModal({
                 title: '前往',
                 content: '是否立即前往后山采集灵草？',
                 confirmText: '前往 (后山)',
                 showCancel: true,
                 onConfirm: () => {
                     router.push('/combat?map=m1'); // Auto-goto map
                 }
             });
         }
         else if (task.id === 'task_patrol') {
            showModal({
                 title: '前往',
                 content: '巡逻任务需要清理宗门周边的宵小之辈，是否前往？',
                 confirmText: '前往 (宗门周边)',
                 showCancel: true,
                 onConfirm: () => {
                     router.push('/combat?map=sect_patrol'); // Special patrol map
                 }
             });
         }
    } else {
        showModal({ title: '失败', content: '无法接取任务，可能已有进行中的任务。' });
    }
}

function handleCompleteTask() {
    const res = sectStore.completeTask();
    
    if (res.success) {
        showModal({ title: '完成', content: res.msg });
    } else {
        // If failed, check if we can offer a redirect
        const activeTaskId = playerSectInfo.value?.activeTask?.taskId;
        if (activeTaskId && currentSect.value) {
            const task = currentSect.value.tasks.find(t => t.id === activeTaskId);
            if (task) {
                // Determine redirect target based on task type/id
                let targetMap = '';
                let targetName = '';

                if (task.type === 'collect' && task.id === 'task_collect_herb') {
                    targetMap = 'm1';
                    targetName = '后山';
                } else if (task.id === 'task_patrol') {
                    targetMap = 'sect_patrol';
                    targetName = '宗门周边';
                }

                if (targetMap) {
                    showModal({
                        title: '条件未达成',
                        content: `${res.msg}\n\n是否立即前往 [${targetName}] ?`,
                        confirmText: `前往 ${targetName}`,
                        showCancel: true,
                        onConfirm: () => {
                            router.push(`/combat?map=${targetMap}`);
                        }
                    });
                    return;
                }
            }
        }

        // Fallback for other errors
        showModal({ title: '提示', content: res.msg });
    }
}


</script>
