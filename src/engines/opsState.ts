/* ===========================================================================
   Derived ops state — Command Center 지표를 시나리오 진행에 따라 인과적으로 계산.
   "정적 장식 금지" (지시서 §8.5 체크리스트). 모든 KPI는 시드 + 선택의 함수.
   =========================================================================== */
import { CASES } from '../data/cases';
import { STAFFING_SNAPSHOT } from '../data/team';
import { SCENARIO_01 } from '../data/scenarios/scenario01';

export interface KpiSnapshot {
  slaAttainment: number; // %
  queueDepth: number;
  asaSeconds: number;
  csat: number; // %
  ahtMin: number;
  fcr: number; // %
  abandonment: number; // %
  occupancy: number; // %
}

/** 위기 시작 시점의 기준 지표 (결근·적체 압박이 반영된 baseline). */
export const BASELINE: KpiSnapshot = {
  slaAttainment: 86,
  queueDepth: CASES.filter((c) => c.status === 'queued').length,
  asaSeconds: 270, // 4m30s — 결근으로 응대 속도 악화
  csat: 88,
  ahtMin: 14,
  fcr: 71,
  abandonment: 7,
  occupancy: 94, // 과가동 (available 인력 부족)
};

/**
 * 지금까지 내린 선택들의 평균 "장악도"(0–100)를 계산.
 * 각 단계가 주로 채점하는 차원의 점수 평균을 사용 — 좋은 판단일수록 지표가 회복.
 */
export function gripFactor(selections: Record<string, string>): number {
  const scores: number[] = [];
  for (const step of SCENARIO_01.steps) {
    if (step.kind !== 'choice') continue;
    const opt = step.options?.find((o) => o.id === selections[step.id]);
    if (!opt) continue;
    const vals = Object.values(opt.scores).filter(
      (v): v is number => typeof v === 'number'
    );
    if (vals.length) scores.push(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  if (!scores.length) return 50; // 아직 선택 없음 → 중립
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * 현재 Command Center 지표 계산.
 * grip이 높을수록(좋은 판단) SLA·CSAT·FCR 회복, 큐·ASA·이탈·과가동 완화.
 */
export function deriveKpis(selections: Record<string, string>): KpiSnapshot {
  const decisionsMade = Object.keys(selections).length;
  const grip = gripFactor(selections);
  // -0.5 ~ +0.5 범위의 보정 계수 (grip 50 = 중립)
  const adj = (grip - 50) / 100;
  // 결정을 내릴수록 효과가 누적 (최대 4개 choice 단계)
  const progress = Math.min(decisionsMade, 4) / 4;
  const k = adj * progress;

  const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

  return {
    slaAttainment: Math.round(clamp(BASELINE.slaAttainment + k * 12)),
    queueDepth: Math.max(
      0,
      Math.round(BASELINE.queueDepth - k * 3)
    ),
    asaSeconds: Math.max(30, Math.round(BASELINE.asaSeconds - k * 150)),
    csat: Math.round(clamp(BASELINE.csat + k * 8)),
    ahtMin: Math.max(6, Math.round((BASELINE.ahtMin - k * 4) * 10) / 10),
    fcr: Math.round(clamp(BASELINE.fcr + k * 10)),
    abandonment: Math.round(clamp(BASELINE.abandonment - k * 5, 0, 100)),
    occupancy: Math.round(clamp(BASELINE.occupancy - k * 8, 0, 100)),
  };
}

/** 가용 인력 = total − (absent + training). (지시서 §8.5 체크리스트) */
export function availableHeadcount() {
  const { headcount, absent, training } = STAFFING_SNAPSHOT;
  return headcount - absent - training;
}
