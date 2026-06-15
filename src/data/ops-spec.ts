/* ===========================================================================
   Ops Authenticity Spec — 지시서 §8.5
   업계 통용 KPI 정의, SLA 티어 매트릭스, 에스컬레이션 매트릭스.
   시나리오/시드 데이터의 모든 수치는 이 파일과 일관되어야 한다.
   =========================================================================== */

export interface KpiDef {
  key: string;
  label: string;
  /** 업계 통용 정의 */
  definition: string;
  /** 데모에서의 쓰임 */
  usage: string;
}

export const KPI_DEFS: KpiDef[] = [
  {
    key: 'csat',
    label: 'CSAT',
    definition: 'Customer Satisfaction — % of surveyed contacts rated satisfied.',
    usage: 'Team/case health; drops under crisis pressure.',
  },
  {
    key: 'aht',
    label: 'AHT',
    definition: 'Average Handle Time — mean time to fully handle one contact.',
    usage: 'Core variable for staffing math.',
  },
  {
    key: 'fcr',
    label: 'FCR',
    definition: 'First Contact Resolution — % resolved on the first touch.',
    usage: 'Quality vs. reallocation trade-off.',
  },
  {
    key: 'sla',
    label: 'SLA Attainment',
    definition: 'SLA Attainment — % of contacts meeting their SLA target.',
    usage: 'The crisis headline metric; wired to the SLA clock.',
  },
  {
    key: 'queue',
    label: 'Queue Depth',
    definition: 'Backlog — number of cases waiting to be worked.',
    usage: 'Makes the staffing shortage visible.',
  },
  {
    key: 'asa',
    label: 'ASA',
    definition: 'Average Speed of Answer — mean wait before an agent responds.',
    usage: 'Quantifies the impact of the absences.',
  },
  {
    key: 'abandon',
    label: 'Abandonment',
    definition: 'Abandonment Rate — % of customers who leave before being served.',
    usage: 'Downstream result of queue build-up.',
  },
  {
    key: 'occupancy',
    label: 'Occupancy',
    definition: 'Occupancy — % of paid time agents spend actively handling work.',
    usage: 'Basis for available-headcount math (with shrinkage).',
  },
];

/* --------------------------- SLA tier matrix ----------------------------- */
/* Response SLA / Resolution SLA, in minutes. 지시서 §8.5 표와 동일. */
export type Priority = 'P1' | 'P2' | 'P3';
export type ClientTier = 'VIP' | 'Standard';

export interface SlaTarget {
  responseMin: number;
  resolutionMin: number;
}

export const SLA_MATRIX: Record<ClientTier, Record<Priority, SlaTarget>> = {
  VIP: {
    P1: { responseMin: 15, resolutionMin: 120 },
    P2: { responseMin: 30, resolutionMin: 240 },
    P3: { responseMin: 60, resolutionMin: 480 },
  },
  Standard: {
    P1: { responseMin: 30, resolutionMin: 240 },
    P2: { responseMin: 60, resolutionMin: 480 },
    P3: { responseMin: 240, resolutionMin: 1440 },
  },
};

export function slaLabel(tier: ClientTier, p: Priority): string {
  const t = SLA_MATRIX[tier][p];
  const fmt = (m: number) => (m >= 60 ? `${m / 60}h` : `${m}m`);
  return `R ${fmt(t.responseMin)} / Resolve ${fmt(t.resolutionMin)}`;
}

/* ------------------------- Escalation matrix ----------------------------- */
export const ESCALATION_CHAIN = [
  'T1 Agent',
  'T2 Specialist',
  'Team Lead',
  'Ops Manager',
  'Director',
] as const;

export interface EscalationTrigger {
  condition: string;
  routeTo: string;
  /** 보고 의무 여부 */
  mandatoryReport: boolean;
}

/* ------------------------- Reporting chain ------------------------------- */
/* 대화내역: 실제 회사처럼 역할을 두고, 이슈별로 누구에게 보고할지 판단하게 한다. */
export interface ReportingRole {
  id: string;
  label: string;
  scope: string;
}

export const REPORTING_ROLES: ReportingRole[] = [
  { id: 'senior', label: 'Senior Agent', scope: 'Peer help, second opinion on a case' },
  { id: 'teamlead', label: 'Team Lead (You)', scope: 'Owns the shift, first escalation point' },
  { id: 'opsmgr', label: 'Operations Manager', scope: 'Cross-team, mandatory-report incidents, capacity' },
  { id: 'regional', label: 'Regional Manager', scope: 'Executive/regional reporting pressure' },
  { id: 'csm', label: 'Client Success Manager', scope: 'Owns the customer relationship / renewal risk' },
  { id: 'hr', label: 'HR Partner', scope: 'People, leave, fairness, conduct' },
  { id: 'wfm', label: 'Workforce Management', scope: 'Staffing, shrinkage, coverage, schedules' },
  { id: 'qa', label: 'QA Analyst', scope: 'Quality dips, coaching plans' },
  { id: 'it', label: 'IT Support', scope: 'System outages, tooling failures' },
];

export const ESCALATION_TRIGGERS: EscalationTrigger[] = [
  {
    condition: 'VIP / Enterprise + Resolution SLA ≤ 30 min remaining',
    routeTo: 'Team Lead (immediate)',
    mandatoryReport: false,
  },
  {
    condition: 'Data loss / security or compliance breach',
    routeTo: 'Ops Manager',
    mandatoryReport: true,
  },
  {
    condition: 'Repeat complaint (same customer 3+) or refund beyond agent authority',
    routeTo: 'Team Lead',
    mandatoryReport: false,
  },
  {
    condition: 'Media / legal risk signal',
    routeTo: 'Ops Manager → Director',
    mandatoryReport: true,
  },
];
