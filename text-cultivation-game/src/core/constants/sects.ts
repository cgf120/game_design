import type { Sect, SectRank, SectTask } from '../models/sect';

const COMMON_RANKS: SectRank[] = [
    { id: 'outer_disciple', name: '外门弟子', level: 0, salary: 10, contributionReq: 0 },
    { id: 'inner_disciple', name: '内门弟子', level: 1, salary: 50, contributionReq: 100 },
    { id: 'core_disciple', name: '亲传弟子', level: 2, salary: 200, contributionReq: 500 },
    { id: 'elder', name: '长老', level: 3, salary: 1000, contributionReq: 2000 },
];

const COMMON_TASKS: SectTask[] = [
    { id: 'task_patrol', name: '山门巡逻', desc: '清理3个宗门附近的宵小之辈。', type: 'hunt', targetId: 'sect_intruder', count: 3, rewardContribution: 10, rewardStones: 5, relatedMapId: 'sect_patrol' },
    { id: 'task_collect_herb', name: '采集药草', desc: '去后山采集一些灵草。', type: 'collect', targetId: 'mat_herb', count: 5, rewardContribution: 20, rewardStones: 10, relatedMapId: 'm1' }, // Linked to Back Mountain (m1)
];

export const SECTS: Sect[] = [
    {
        id: 'sect_qingyun',
        name: '青云宗',
        desc: '正道大宗，修习剑道，浩然正气。',
        reqRealmId: 1, // 练气期可入
        ranks: COMMON_RANKS,
        tasks: COMMON_TASKS,
        techniques: [] // To be added later
    },
    {
        id: 'sect_blood',
        name: '血煞教',
        desc: '魔道巨擘，行事诡秘，实力至上。',
        reqRealmId: 1,
        ranks: COMMON_RANKS,
        tasks: COMMON_TASKS,
        techniques: []
    }
];

export function getSect(id: string): Sect | undefined {
    return SECTS.find(s => s.id === id);
}

export function getRank(sect: Sect, rankId: string): SectRank | undefined {
    return sect.ranks.find(r => r.id === rankId);
}
