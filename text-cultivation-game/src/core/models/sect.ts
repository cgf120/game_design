export interface SectRank {
    id: string;
    name: string;
    level: number; // 0=Outer, 1=Inner, 2=Deacon, etc.
    salary: number; // Daily spirit stones
    contributionReq: number; // Cost to promote to this rank
}

export interface SectTask {
    id: string;
    name: string;
    desc: string;
    type: 'collect' | 'hunt' | 'patrol';
    targetId?: string; // itemId or enemyId
    count: number;
    duration?: number; // seconds for patrol
    rewardContribution: number;
    rewardStones: number;
}

export interface Sect {
    id: string;
    name: string;
    desc: string;
    reqRealmId: number; // Min realm to join
    ranks: SectRank[];
    tasks: SectTask[]; // Available tasks pool
    techniques: string[]; // List of itemIds (books) available in Pavilion
}

export interface PlayerSectInfo {
    sectId: string;
    rankId: string; // current rank id
    contribution: number;
    joinTime: number;
    lastSalaryTime: number; // Determine if salary can be claimed today
    activeTask?: {
        taskId: string;
        startTime: number;
        progress: number; // For hunt tasks
    };
}
