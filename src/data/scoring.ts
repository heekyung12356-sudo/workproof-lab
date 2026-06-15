/* ===========================================================================
   WorkProof Leadership Score — 대화내역의 평가 차원.
   정답 하나가 아니라 "판단 품질"을 결정론적·방어 가능하게 점수화한다.
   각 시나리오는 관련 차원의 부분집합만 평가하고, 총점은 평가된 차원에 대해
   가중치를 재정규화해 산출한다(미평가 차원으로 불이익 없음).
   =========================================================================== */

export type Dimension =
  | 'prioritization'
  | 'sla'
  | 'staffing'
  | 'communication'
  | 'escalation'
  | 'people'
  | 'fairness'
  | 'risk'
  | 'documentation'
  | 'recovery'
  | 'reporting'
  | 'calmness';

export interface DimensionDef {
  key: Dimension;
  label: string;
  weight: number;
  criteria: string;
}

export const DIMENSIONS: DimensionDef[] = [
  { key: 'prioritization', label: 'Prioritization', weight: 14, criteria: 'What gets attention first under pressure.' },
  { key: 'sla', label: 'SLA Judgment', weight: 10, criteria: 'Protecting the right deadlines.' },
  { key: 'staffing', label: 'Staffing Judgment', weight: 12, criteria: 'Fitting people to work given skills & capacity.' },
  { key: 'communication', label: 'Customer Communication', weight: 12, criteria: 'Honest, timely, ownership-taking messaging.' },
  { key: 'escalation', label: 'Escalation Accuracy', weight: 10, criteria: 'Routing to the right level per the matrix.' },
  { key: 'people', label: 'People Management', weight: 8, criteria: 'Coaching vs. blame; protecting the team.' },
  { key: 'fairness', label: 'Fairness', weight: 6, criteria: 'Consistent, defensible treatment of people.' },
  { key: 'risk', label: 'Risk Control', weight: 8, criteria: 'Containing compliance / data / reputational risk.' },
  { key: 'documentation', label: 'Documentation', weight: 8, criteria: 'Quality of the record and the report.' },
  { key: 'recovery', label: 'Recovery Planning', weight: 6, criteria: 'Recovery + remediation + prevention.' },
  { key: 'reporting', label: 'Executive Reporting', weight: 4, criteria: 'Routing the right info to the right role.' },
  { key: 'calmness', label: 'Calmness Under Pressure', weight: 2, criteria: 'Composed reasoning, not reactive.' },
];

export const DIMENSION_LABEL: Record<Dimension, string> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d.label])
) as Record<Dimension, string>;

export const GRADES = [
  { min: 90, label: 'Operations Leader Ready', tone: 'mint' as const },
  { min: 75, label: 'Strong Candidate', tone: 'sky' as const },
  { min: 60, label: 'Developing', tone: 'amber' as const },
  { min: 0, label: 'Needs Practice', tone: 'rose' as const },
];

export function gradeFor(total: number) {
  return GRADES.find((g) => total >= g.min) ?? GRADES[GRADES.length - 1];
}
