/* ===========================================================================
   Scoring engine — deterministic WorkProof Leadership Score across scenarios.
   채점 대상은 "플레이하는 사람"(주로 채용담당자). 총점은 평가된 차원에 대해
   가중치를 재정규화해 산출(미평가 차원으로 불이익 없음).
   AI는 점수에 관여하지 않는다.
   =========================================================================== */
import { DIMENSIONS, gradeFor, type Dimension } from '../data/scoring';
import { getScenario } from '../data/scenarios';

export interface SessionChoices {
  scenarioId: string;
  /** stepId -> optionId (choice steps) */
  selections: Record<string, string>;
  /** stepId -> selected reporting-role ids (routing steps) */
  routing: Record<string, string[]>;
  /** stepId -> "why" memo */
  memos: Record<string, string>;
  /** stepId -> free-text report */
  reports: Record<string, string>;
}

export interface DimensionScore {
  key: Dimension;
  label: string;
  weight: number;
  score: number;
}

export interface ScoreResult {
  dimensions: DimensionScore[]; // only exercised dimensions
  total: number;
  grade: ReturnType<typeof gradeFor>;
}

export function emptySession(scenarioId: string): SessionChoices {
  return { scenarioId, selections: {}, routing: {}, memos: {}, reports: {} };
}

/* 보고서 휴리스틱: 길이 + 기대 키워드 커버리지 → 0–100. */
export function scoreReport(text: string, hints: string[]): number {
  const t = (text || '').toLowerCase().trim();
  if (!t) return 0;
  const words = t.split(/\s+/).filter(Boolean).length;
  const lengthScore = Math.max(0, Math.min(40, ((words - 8) / 27) * 40));
  const hit = hints.length ? hints.filter((h) => t.includes(h)).length : 0;
  const coverageScore = hints.length ? (hit / hints.length) * 60 : 0;
  return Math.round(Math.max(0, Math.min(100, lengthScore + coverageScore)));
}

/* 라우팅(보고 체계) 정확도: Jaccard 유사도 × 100. */
function scoreRouting(selected: string[], correct: string[]): number {
  const sel = new Set(selected ?? []);
  const cor = new Set(correct ?? []);
  if (cor.size === 0) return 0;
  let inter = 0;
  cor.forEach((c) => sel.has(c) && inter++);
  const union = new Set([...sel, ...cor]).size;
  return Math.round((inter / union) * 100);
}

export function computeScore(s: SessionChoices): ScoreResult {
  const scenario = getScenario(s.scenarioId);
  const buckets: Record<Dimension, number[]> = {
    prioritization: [], sla: [], staffing: [], communication: [], escalation: [],
    people: [], fairness: [], risk: [], documentation: [], recovery: [], reporting: [], calmness: [],
  };

  if (scenario) {
    for (const step of scenario.steps) {
      if (step.kind === 'choice') {
        const opt = step.options?.find((o) => o.id === s.selections[step.id]);
        if (opt) {
          for (const [dim, val] of Object.entries(opt.scores)) {
            if (typeof val === 'number') buckets[dim as Dimension].push(val);
          }
        }
      } else if (step.kind === 'routing') {
        const acc = scoreRouting(s.routing[step.id] ?? [], step.routingCorrect ?? []);
        for (const dim of step.scoresDimensions) buckets[dim].push(acc);
      } else if (step.kind === 'report') {
        const r = scoreReport(s.reports[step.id] ?? '', step.reportRubricHints ?? []);
        for (const dim of step.scoresDimensions) buckets[dim].push(r);
      }
    }

    // 메모 품질 → documentation + calmness 소량 반영 (판단 근거 기록 = 증거).
    const memoTexts = Object.values(s.memos).filter((m) => m && m.trim().length > 0);
    if (memoTexts.length) {
      const avgWords =
        memoTexts.reduce((a, m) => a + m.trim().split(/\s+/).length, 0) / memoTexts.length;
      const memoScore = Math.max(0, Math.min(100, ((avgWords - 4) / 16) * 100));
      buckets.documentation.push(Math.round(memoScore));
      buckets.calmness.push(Math.round(Math.min(100, 55 + memoScore * 0.4)));
    }
  }

  const exercised = DIMENSIONS.filter((d) => buckets[d.key].length > 0).map((d) => {
    const arr = buckets[d.key];
    const score = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    return { key: d.key, label: d.label, weight: d.weight, score };
  });

  const totalWeight = exercised.reduce((a, d) => a + d.weight, 0) || 1;
  const total = Math.round(
    exercised.reduce((a, d) => a + d.score * d.weight, 0) / totalWeight
  );

  return { dimensions: exercised, total, grade: gradeFor(total) };
}

export function isComplete(s: SessionChoices): boolean {
  const scenario = getScenario(s.scenarioId);
  if (!scenario) return false;
  return scenario.steps.every((step) => {
    if (step.kind === 'choice') return Boolean(s.selections[step.id]);
    if (step.kind === 'routing') return (s.routing[step.id]?.length ?? 0) > 0;
    if (step.kind === 'report') return (s.reports[step.id] ?? '').trim().length > 0;
    return true;
  });
}
