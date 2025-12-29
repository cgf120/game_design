import type { Sect, SectRank, SectTask } from '../models/sect';

// Commercial v6.8 Sect Config (Skill Integration)
// Linking Sects to their MHXY-style skills in skills.ts

const COMMON_RANKS: SectRank[] = [
    { id: 'outer_disciple', name: '外门弟子', level: 0, salary: 500, contributionReq: 0 },
    { id: 'inner_disciple', name: '内门弟子', level: 1, salary: 2000, contributionReq: 1000 },
    { id: 'core_disciple', name: '亲传弟子', level: 2, salary: 10000, contributionReq: 5000 },
    { id: 'elder', name: '长老', level: 3, salary: 50000, contributionReq: 20000 },
];

const COMMON_TASKS: SectTask[] = [
    { id: 'task_patrol', name: '山门巡逻', desc: '清理3个宗门附近的宵小之辈。', type: 'hunt', targetId: 'sect_intruder', count: 3, rewardContribution: 50, rewardStones: 100, relatedMapId: 'sect_patrol' },
    { id: 'task_collect_herb', name: '采集药草', desc: '去后山采集一些灵草。', type: 'collect', targetId: 'mat_herb', count: 5, rewardContribution: 100, rewardStones: 200, relatedMapId: 'map_1_0' },
];

export const SECTS: Sect[] = [
    {
        id: 'sect_qingyun', // Mapped to DT (Datang) logic
        name: '青云宗',
        desc: '正道大宗，绝学包括【横扫千军】与【后发制人】。',
        reqRealmId: 1,
        ranks: COMMON_RANKS,
        tasks: COMMON_TASKS,
        techniques: ['dt_sweep', 'dt_slash', 'dt_break'] // SKILL IDs
    },
    {
        id: 'sect_blood', // Mapped to STL (Shituo) logic
        name: '血煞教',
        desc: '魔道巨擘，擅长【鹰击】与【狮搏】，需变身作战。',
        reqRealmId: 1,
        ranks: COMMON_RANKS,
        tasks: COMMON_TASKS,
        techniques: ['stl_transform', 'stl_eagle', 'stl_lion']
    },
    // Future Expansion:
    {
        id: 'sect_dragon', // LG
        name: '东海龙宫',
        desc: '法术冠绝天下，擅长【龙卷雨击】。',
        reqRealmId: 1,
        ranks: COMMON_RANKS,
        tasks: COMMON_TASKS,
        techniques: ['lg_tornado', 'lg_shot', 'lg_buff']
    },
    {
        id: 'sect_putuo', // PT
        name: '普陀山',
        desc: '救死扶伤，擅长【普渡众生】与【杨柳甘露】。',
        reqRealmId: 1,
        ranks: COMMON_RANKS,
        tasks: COMMON_TASKS,
        techniques: ['pt_five', 'pt_lantern', 'pt_revive']
    }
];

export function getSect(id: string): Sect | undefined {
    return SECTS.find(s => s.id === id);
}

export function getRank(sect: Sect, rankId: string): SectRank | undefined {
    return sect.ranks.find(r => r.id === rankId);
}
