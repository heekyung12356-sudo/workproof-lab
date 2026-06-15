/* ===========================================================================
   Team capacity seed — 지시서 §8.5 "팀 데이터 사실성"
   가명이지만 구조는 현실적: 스킬 매트릭스, 타임존, shrinkage 반영.
   가용 인력 = total − (absent + training)  로 실제 계산됨 (engines/staffing 사용).
   =========================================================================== */

export type AgentStatus = 'available' | 'absent' | 'busy' | 'training';
export type AgentRole = 'T1' | 'T2' | 'Lead';

export interface SkillMatrix {
  /** 0–5 */
  billing: number;
  technical: number;
  deescalation: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: AgentRole;
  /** tenure in months */
  tenure: number;
  skills: SkillMatrix;
  languages: string[];
  shift: string;
  timezone: string;
  status: AgentStatus;
  /** 현재 처리 중 케이스 id (busy일 때) */
  handling?: string;
  note?: string;
}

/** Monday 09:00 KST — 시나리오 01 시점의 팀 스냅샷. */
export const TEAM: TeamMember[] = [
  {
    id: 'tl-1',
    name: 'You',
    role: 'Lead',
    tenure: 14,
    skills: { billing: 4, technical: 4, deescalation: 5 },
    languages: ['en', 'ko'],
    shift: '09:00–18:00',
    timezone: 'Asia/Seoul (KST)',
    status: 'available',
    note: 'You are the team lead on shift. Coaching + escalation owner.',
  },
  {
    id: 'a-priya',
    name: 'Priya R.',
    role: 'T2',
    tenure: 31,
    skills: { billing: 5, technical: 4, deescalation: 4 },
    languages: ['en', 'hi'],
    shift: '08:30–17:30',
    timezone: 'Asia/Kolkata (IST)',
    status: 'available',
    note: 'Strongest billing/specialist. Trusted with VIP accounts.',
  },
  {
    id: 'a-marco',
    name: 'Marco D.',
    role: 'T2',
    tenure: 22,
    skills: { billing: 3, technical: 5, deescalation: 3 },
    languages: ['en', 'es', 'pt'],
    shift: '09:00–18:00',
    timezone: 'America/Sao_Paulo (BRT)',
    status: 'busy',
    handling: 'case-3104',
    note: 'Best technical depth; mid on de-escalation. Currently on a P2 integration bug.',
  },
  {
    id: 'a-aisha',
    name: 'Aisha N.',
    role: 'T1',
    tenure: 9,
    skills: { billing: 3, technical: 2, deescalation: 4 },
    languages: ['en', 'ar'],
    shift: '09:00–18:00',
    timezone: 'Asia/Dubai (GST)',
    status: 'available',
    note: 'Reliable T1. Good tone with frustrated customers.',
  },
  {
    id: 'a-sam',
    name: 'Sam K.',
    role: 'T1',
    tenure: 3,
    skills: { billing: 2, technical: 2, deescalation: 2 },
    languages: ['en'],
    shift: '09:00–18:00',
    timezone: 'Asia/Seoul (KST)',
    status: 'available',
    handling: 'case-3101',
    note: 'Junior (3 mo). Made the data-deletion mistake on VIP Client B this morning.',
  },
  {
    id: 'a-lena',
    name: 'Lena F.',
    role: 'T1',
    tenure: 7,
    skills: { billing: 3, technical: 3, deescalation: 3 },
    languages: ['en', 'de'],
    shift: '09:00–18:00',
    timezone: 'Europe/Berlin (CET)',
    status: 'absent',
    note: 'No-call no-show this morning.',
  },
  {
    id: 'a-tomas',
    name: 'Tomás V.',
    role: 'T1',
    tenure: 5,
    skills: { billing: 2, technical: 3, deescalation: 2 },
    languages: ['en', 'es'],
    shift: '09:00–18:00',
    timezone: 'America/Mexico_City (CST)',
    status: 'absent',
    note: 'No-call no-show this morning.',
  },
  {
    id: 'a-yuki',
    name: 'Yuki T.',
    role: 'T1',
    tenure: 11,
    skills: { billing: 3, technical: 2, deescalation: 3 },
    languages: ['en', 'ja'],
    shift: '09:00–18:00',
    timezone: 'Asia/Tokyo (JST)',
    status: 'training',
    note: 'Scheduled compliance training block until 11:00. Recallable in a true emergency.',
  },
];

export const STAFFING_SNAPSHOT = {
  /** 정원 (You 포함) */
  headcount: TEAM.length,
  /** 결근 */
  absent: TEAM.filter((m) => m.status === 'absent').length,
  /** 교육 (shrinkage) */
  training: TEAM.filter((m) => m.status === 'training').length,
  /** 이미 케이스 처리 중 */
  busy: TEAM.filter((m) => m.status === 'busy').length,
  /** 즉시 가용 (available) */
  available: TEAM.filter((m) => m.status === 'available').length,
};
