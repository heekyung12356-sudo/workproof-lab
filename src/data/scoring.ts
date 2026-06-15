/* ===========================================================================
   Scoring rubric — 지시서 §9
   결정론적이고 방어 가능한 6차원 가중 루브릭.
   이 엔진이 채점하는 대상은 "플레이하는 사람"(주로 채용담당자)이다.
   =========================================================================== */

export type Dimension =
  | 'prioritization'
  | 'staffing'
  | 'communication'
  | 'escalation'
  | 'documentation'
  | 'recovery';

export interface DimensionDef {
  key: Dimension;
  label: string;
  /** 가중치 (합계 100) */
  weight: number;
  criteria: string;
}

export const DIMENSIONS: DimensionDef[] = [
  { key: 'prioritization', label: 'Prioritization', weight: 25, criteria: 'Accuracy of what gets attention first under time pressure.' },
  { key: 'staffing', label: 'Staffing Judgment', weight: 20, criteria: 'Fit of people to work, given skills, status, and shrinkage.' },
  { key: 'communication', label: 'Customer Communication', weight: 20, criteria: 'Honesty, timing, and ownership in customer-facing messaging.' },
  { key: 'escalation', label: 'Escalation Accuracy', weight: 15, criteria: 'Routing to the right level per the escalation matrix.' },
  { key: 'documentation', label: 'Documentation', weight: 10, criteria: 'Quality and completeness of the incident report.' },
  { key: 'recovery', label: 'Recovery Planning', weight: 10, criteria: 'Completeness of recovery, remediation, and prevention.' },
];

export const GRADES = [
  { min: 90, label: 'Operations Leader Ready', tone: 'mint' as const },
  { min: 75, label: 'Strong Candidate', tone: 'sky' as const },
  { min: 60, label: 'Developing', tone: 'amber' as const },
  { min: 0, label: 'Needs Practice', tone: 'rose' as const },
];

export function gradeFor(total: number) {
  return GRADES.find((g) => total >= g.min) ?? GRADES[GRADES.length - 1];
}
