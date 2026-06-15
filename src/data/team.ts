/* ===========================================================================
   Team Capacity Board seed — APAC Customer Operations, 12 members (You + 11).
   가명. 구조는 현실적: load/capacity, quality, speed, burnout, skills, status.
   가용 인력 = total − (absent + leave + training)  로 실제 계산됨.
   =========================================================================== */

export type AgentStatus = 'available' | 'absent' | 'leave' | 'training' | 'busy';
export type AgentRole = 'Lead' | 'Senior' | 'Agent' | 'New';
export type BurnoutRisk = 'low' | 'med' | 'high';

export interface SkillMatrix {
  billing: number; // 0–5
  technical: number;
  deescalation: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: AgentRole;
  tenureMonths: number;
  /** current open work items */
  load: number;
  /** max comfortable concurrent work items */
  capacity: number;
  /** Quality Signal % */
  quality: number;
  /** avg handle time, minutes */
  ahtMin: number;
  skills: SkillMatrix;
  strength: string;
  /** short risk flag, '' = none */
  riskFlag: string;
  burnout: BurnoutRisk;
  vipCapable: boolean;
  isNew: boolean;
  languages: string[];
  timezone: string;
  status: AgentStatus;
  note?: string;
}

export const TEAM: TeamMember[] = [
  {
    id: 'you', name: 'You', role: 'Lead', tenureMonths: 16,
    load: 6, capacity: 20, quality: 95, ahtMin: 11,
    skills: { billing: 4, technical: 4, deescalation: 5 },
    strength: 'Escalation owner · coaching', riskFlag: '', burnout: 'low',
    vipCapable: true, isNew: false, languages: ['en', 'ko'], timezone: 'KST',
    status: 'available', note: 'You run the shift today.',
  },
  {
    id: 'mina', name: 'Mina S.', role: 'Senior', tenureMonths: 38,
    load: 42, capacity: 40, quality: 96, ahtMin: 9,
    skills: { billing: 5, technical: 4, deescalation: 5 },
    strength: 'VIP handling', riskFlag: 'Burnout risk', burnout: 'high',
    vipCapable: true, isNew: false, languages: ['en', 'ko'], timezone: 'KST',
    status: 'available', note: 'Top performer but over capacity — protect from overload.',
  },
  {
    id: 'daniel', name: 'Daniel O.', role: 'Senior', tenureMonths: 29,
    load: 28, capacity: 38, quality: 94, ahtMin: 10,
    skills: { billing: 4, technical: 5, deescalation: 4 },
    strength: 'Technical depth', riskFlag: '', burnout: 'low',
    vipCapable: true, isNew: false, languages: ['en'], timezone: 'GST (Dubai)',
    status: 'available', note: 'Reliable senior; best for technical VIP cases.',
  },
  {
    id: 'priya', name: 'Priya R.', role: 'Senior', tenureMonths: 33,
    load: 31, capacity: 38, quality: 93, ahtMin: 12,
    skills: { billing: 5, technical: 3, deescalation: 4 },
    strength: 'Billing / reconciliation', riskFlag: '', burnout: 'med',
    vipCapable: true, isNew: false, languages: ['en', 'hi'], timezone: 'IST (Kolkata)',
    status: 'available',
  },
  {
    id: 'jae', name: 'Jae P.', role: 'Agent', tenureMonths: 14,
    load: 31, capacity: 34, quality: 82, ahtMin: 8,
    skills: { billing: 3, technical: 3, deescalation: 2 },
    strength: 'Fast resolution', riskFlag: 'Sent incorrect refund info to a VIP yesterday', burnout: 'med',
    vipCapable: false, isNew: false, languages: ['en', 'ko'], timezone: 'KST',
    status: 'available', note: 'Quality dip after a recent error — coaching candidate, not blame.',
  },
  {
    id: 'aisha', name: 'Aisha N.', role: 'Agent', tenureMonths: 19,
    load: 26, capacity: 34, quality: 90, ahtMin: 11,
    skills: { billing: 3, technical: 2, deescalation: 4 },
    strength: 'De-escalation / tone', riskFlag: '', burnout: 'low',
    vipCapable: true, isNew: false, languages: ['en', 'ar'], timezone: 'GST (Dubai)',
    status: 'available',
  },
  {
    id: 'marco', name: 'Marco D.', role: 'Agent', tenureMonths: 22,
    load: 24, capacity: 34, quality: 88, ahtMin: 13,
    skills: { billing: 3, technical: 5, deescalation: 3 },
    strength: 'Integrations / APIs', riskFlag: '', burnout: 'low',
    vipCapable: true, isNew: false, languages: ['en', 'es', 'pt'], timezone: 'BRT (São Paulo)',
    status: 'busy', note: 'On a P2 integration bug right now.',
  },
  {
    id: 'lena', name: 'Lena F.', role: 'Agent', tenureMonths: 11,
    load: 0, capacity: 32, quality: 86, ahtMin: 12,
    skills: { billing: 3, technical: 3, deescalation: 3 },
    strength: 'Steady generalist', riskFlag: 'No-call no-show', burnout: 'med',
    vipCapable: false, isNew: false, languages: ['en', 'de'], timezone: 'CET (Berlin)',
    status: 'absent',
  },
  {
    id: 'tomas', name: 'Tomás V.', role: 'Agent', tenureMonths: 9,
    load: 0, capacity: 30, quality: 84, ahtMin: 13,
    skills: { billing: 2, technical: 3, deescalation: 2 },
    strength: 'Generalist', riskFlag: 'No-call no-show', burnout: 'low',
    vipCapable: false, isNew: false, languages: ['en', 'es'], timezone: 'CST (Mexico City)',
    status: 'absent',
  },
  {
    id: 'ravi', name: 'Ravi K.', role: 'New', tenureMonths: 2,
    load: 18, capacity: 22, quality: 78, ahtMin: 16,
    skills: { billing: 2, technical: 2, deescalation: 2 },
    strength: 'Basic billing tickets', riskFlag: 'Needs supervision', burnout: 'low',
    vipCapable: false, isNew: true, languages: ['en', 'hi'], timezone: 'IST (Kolkata)',
    status: 'available', note: 'New hire (2 mo). Keep on low-risk, templated cases.',
  },
  {
    id: 'sam', name: 'Sam C.', role: 'New', tenureMonths: 3,
    load: 17, capacity: 22, quality: 79, ahtMin: 15,
    skills: { billing: 2, technical: 2, deescalation: 2 },
    strength: 'FAQ / templated cases', riskFlag: 'Needs supervision', burnout: 'low',
    vipCapable: false, isNew: true, languages: ['en'], timezone: 'KST',
    status: 'available',
  },
  {
    id: 'yuki', name: 'Yuki T.', role: 'Agent', tenureMonths: 13,
    load: 9, capacity: 32, quality: 89, ahtMin: 11,
    skills: { billing: 3, technical: 2, deescalation: 3 },
    strength: 'Process / documentation', riskFlag: 'In compliance training til 11:00', burnout: 'low',
    vipCapable: false, isNew: false, languages: ['en', 'ja'], timezone: 'JST (Tokyo)',
    status: 'training', note: 'Recallable only for a genuine P1 emergency.',
  },
];

export const STAFFING = {
  headcount: TEAM.length,
  absent: TEAM.filter((m) => m.status === 'absent').length,
  leave: TEAM.filter((m) => m.status === 'leave').length,
  training: TEAM.filter((m) => m.status === 'training').length,
  busy: TEAM.filter((m) => m.status === 'busy').length,
  available: TEAM.filter((m) => m.status === 'available').length,
};

/** 가용 인력 = total − (absent + leave + training). */
export function availableHeadcount(): number {
  return STAFFING.headcount - STAFFING.absent - STAFFING.leave - STAFFING.training;
}
