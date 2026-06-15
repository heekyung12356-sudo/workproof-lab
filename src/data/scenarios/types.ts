/* Shared scenario types for the Crisis Room state machine. */
import type { Dimension } from '../scoring';

export interface DecisionOption {
  id: string;
  label: string;
  blurb: string;
  /** per-dimension score 0–100 for the dimensions this option informs */
  scores: Partial<Record<Dimension, number>>;
  /** one-line "what this choice costs" (shown in result vs. other choices) */
  consequence: string;
  /** the call the candidate would make (maps to commentary) */
  candidatePick?: boolean;
}

export interface DecisionStep {
  id: string;
  index: number;
  kind: 'choice' | 'routing' | 'report';
  title: string;
  situation: string;
  scoresDimensions: Dimension[];
  /** Rule Assist — an AI suggestion shown beside the decision (assistant, not judge). */
  ruleAssist?: string;
  /** required "why" memo prompt (대화내역: 판단 근거를 기록하게 한다) */
  memoPrompt?: string;

  /** choice step */
  options?: DecisionOption[];

  /** routing step (reporting chain) */
  routingPrompt?: string;
  /** correct reporting-role ids (from REPORTING_ROLES) */
  routingCorrect?: string[];
  /** which dimensions the routing step scores */

  /** report step */
  reportPrompt?: string;
  reportRubricHints?: string[];
}

export interface Scenario {
  id: string;
  code: string; // e.g. 'A'
  name: string;
  tagline: string;
  /** when it happens (in-world time) */
  clock: string;
  /** short card description for the picker */
  cardSummary: string;
  /** icon glyph */
  glyph: string;
  briefing: string;
  /** primary live SLA clocks to show during this crisis (minutes) */
  liveClocks: { label: string; startMin: number }[];
  steps: DecisionStep[];
}
