/* ===========================================================================
   Company-targeted WorkProof template.
   각 회사는 자신의 JD에 맞춘 시뮬레이션을 "설정 데이터"로 정의한다.
   엔진/콘솔/리포트는 이 데이터를 그대로 렌더 — 회사 추가 = 파일 한 장.
   =========================================================================== */

export type AccentKey = 'sky' | 'mint' | 'iris' | 'amber' | 'rose';

export interface DimensionDef {
  key: string;
  label: string;
  weight: number;
  criteria: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  blurb: string;
  /** dimension key -> 0..100 */
  scores: Record<string, number>;
  consequence: string;
  candidatePick?: boolean;
  /** shown in the report's "how I'd handle it" when this is the model call */
  commentary?: { why: string; tradeoff: string };
}

export interface RoutingTarget {
  id: string;
  label: string;
  scope: string;
}

export interface TaskStep {
  id: string;
  index: number;
  kind: 'choice' | 'routing' | 'report';
  title: string;
  situation: string;
  /** dimension keys this step scores */
  scoresDimensions: string[];
  /** tooling/AI "Assist" suggestion (assistant, never decides) */
  assist?: string;
  /** required "why" memo prompt */
  memoPrompt?: string;

  options?: DecisionOption[];

  routingPrompt?: string;
  routingTargets?: RoutingTarget[];
  routingCorrect?: string[];

  reportPrompt?: string;
  reportRubricHints?: string[];
}

export interface LiveClock {
  label: string;
  startMin: number;
  countUp?: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  tagline: string;
  clock?: string;
  briefing: string;
  liveClocks?: LiveClock[];
  steps: TaskStep[];
}

export interface KpiTile {
  label: string;
  value: string;
  sub: string;
  tone?: AccentKey | 'fog';
}

export interface QueueRow {
  id: string;
  primary: string;
  secondary: string;
  tag?: string;
  tagTone?: AccentKey | 'fog';
  right?: string;
  signal?: string; // tooling/Assist signal
}

export interface PanelItem {
  primary: string;
  secondary?: string;
  /** progress 0..100 for a small bar; omit for plain list */
  progress?: number;
  status?: string;
  statusTone?: AccentKey | 'fog';
}

export interface Company {
  slug: string;
  /** show in the home control-panel menu by default */
  visible: boolean;
  name: string;
  roleTitle: string;
  tagline: string;
  accent: AccentKey;
  wordmark: string;
  consoleName: string;
  org: string;
  about: string;
  /** JD source link (optional) */
  source?: string;
  /** their requirement -> what in the demo proves it */
  requirements: { req: string; proof: string }[];
  dimensions: DimensionDef[];
  kpis: KpiTile[];
  queueTitle: string;
  queueNote: string;
  queue: QueueRow[];
  panelTitle: string;
  panel: PanelItem[];
  scenario: Scenario;
  /** one-line cold-message hook tailored to this company */
  hook: string;
}
