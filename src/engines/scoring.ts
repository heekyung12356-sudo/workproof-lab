/* ===========================================================================
   Scoring engine — deterministic, defensible. (지시서 §9)
   입력: 단계별 선택 id + 자유 서술 보고서 텍스트
   출력: 차원별 0–100 점수 + 가중 총점 + 등급
   AI는 점수에 관여하지 않는다(소스 오브 트루스는 이 엔진).
   =========================================================================== */
import { DIMENSIONS, gradeFor, type Dimension } from '../data/scoring';
import { SCENARIO_01, type DecisionStep } from '../data/scenarios/scenario01';

export interface SessionChoices {
  /** stepId -> optionId */
  selections: Record<string, string>;
  /** report 단계 자유 서술 */
  reportText: string;
}

export interface DimensionScore {
  key: Dimension;
  label: string;
  weight: number;
  score: number; // 0–100
}

export interface ScoreResult {
  dimensions: DimensionScore[];
  total: number; // 0–100 가중 평균
  grade: ReturnType<typeof gradeFor>;
  /** 차원별 기여 출처(설명 가능성). */
  breakdown: Record<Dimension, number[]>;
}

/* ------------------- 문서화(보고서) 휴리스틱 채점 --------------------- */
/* 길이 + 기대 키워드 커버리지로 결정론적 점수 산출. */
export function scoreReport(text: string, hints: string[]): number {
  const t = (text || '').toLowerCase().trim();
  if (t.length === 0) return 0;

  const words = t.split(/\s+/).filter(Boolean).length;
  // 길이 점수: 15단어 미만은 빈약, 35단어 이상이면 충분 (0–40)
  const lengthScore = Math.max(0, Math.min(40, ((words - 8) / 27) * 40));

  // 커버리지 점수: 기대 키워드 매칭 비율 (0–60)
  const hit = hints.filter((h) => t.includes(h)).length;
  const coverageScore = (hit / hints.length) * 60;

  return Math.round(Math.max(0, Math.min(100, lengthScore + coverageScore)));
}

export function computeScore(choices: SessionChoices): ScoreResult {
  const breakdown: Record<Dimension, number[]> = {
    prioritization: [],
    staffing: [],
    communication: [],
    escalation: [],
    documentation: [],
    recovery: [],
  };

  for (const step of SCENARIO_01.steps as DecisionStep[]) {
    if (step.kind === 'choice') {
      const chosenId = choices.selections[step.id];
      const opt = step.options?.find((o) => o.id === chosenId);
      if (!opt) continue;
      for (const [dim, val] of Object.entries(opt.scores)) {
        if (typeof val === 'number') breakdown[dim as Dimension].push(val);
      }
    } else if (step.kind === 'report') {
      const docScore = scoreReport(choices.reportText, step.reportRubricHints ?? []);
      breakdown.documentation.push(docScore);
    }
  }

  const dimensions: DimensionScore[] = DIMENSIONS.map((d) => {
    const contributions = breakdown[d.key];
    const score = contributions.length
      ? Math.round(contributions.reduce((a, b) => a + b, 0) / contributions.length)
      : 0;
    return { key: d.key, label: d.label, weight: d.weight, score };
  });

  const totalWeight = dimensions.reduce((a, d) => a + d.weight, 0);
  const total = Math.round(
    dimensions.reduce((a, d) => a + d.score * d.weight, 0) / totalWeight
  );

  return { dimensions, total, grade: gradeFor(total), breakdown };
}

/** 완료 여부: 모든 choice 단계 선택됨 + 보고서 작성됨. */
export function isComplete(choices: SessionChoices): boolean {
  const choiceSteps = SCENARIO_01.steps.filter((s) => s.kind === 'choice');
  const allChosen = choiceSteps.every((s) => Boolean(choices.selections[s.id]));
  const reported = (choices.reportText || '').trim().length > 0;
  return allChosen && reported;
}
