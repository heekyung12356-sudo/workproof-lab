/* ===========================================================================
   Derived Command Center KPIs — move causally with the calls (정적 장식 금지).
   우리 브랜드 용어로 표기: Experience Signal(CSAT), Quality Signal(QA) 등.
   =========================================================================== */
import { WORK_ITEMS, DAILY_VOLUME } from '../data/cases';
import { getScenario } from '../data/scenarios';

export interface KpiSnapshot {
  slaAttainment: number; // %
  queueDepth: number;
  asaSeconds: number;
  experience: number; // CSAT %
  ahtMin: number;
  fcr: number; // %
  abandonment: number; // %
  occupancy: number; // %
}

export const BASELINE: KpiSnapshot = {
  slaAttainment: 86,
  queueDepth: WORK_ITEMS.filter((w) => w.status === 'queued').length,
  asaSeconds: 270,
  experience: 88,
  ahtMin: 14,
  fcr: 71,
  abandonment: 7,
  occupancy: 94,
};

export { DAILY_VOLUME };

/** 선택들의 평균 "장악도"(0–100). */
export function gripFactor(scenarioId: string, selections: Record<string, string>): number {
  const scenario = getScenario(scenarioId);
  if (!scenario) return 50;
  const scores: number[] = [];
  for (const step of scenario.steps) {
    if (step.kind !== 'choice') continue;
    const opt = step.options?.find((o) => o.id === selections[step.id]);
    if (!opt) continue;
    const vals = Object.values(opt.scores).filter((v): v is number => typeof v === 'number');
    if (vals.length) scores.push(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  if (!scores.length) return 50;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function deriveKpis(scenarioId: string, selections: Record<string, string>): KpiSnapshot {
  const made = Object.keys(selections).length;
  const grip = gripFactor(scenarioId, selections);
  const adj = (grip - 50) / 100;
  const progress = Math.min(made, 4) / 4;
  const k = adj * progress;
  const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

  return {
    slaAttainment: Math.round(clamp(BASELINE.slaAttainment + k * 12)),
    queueDepth: Math.max(0, Math.round(BASELINE.queueDepth - k * 3)),
    asaSeconds: Math.max(30, Math.round(BASELINE.asaSeconds - k * 150)),
    experience: Math.round(clamp(BASELINE.experience + k * 8)),
    ahtMin: Math.max(6, Math.round((BASELINE.ahtMin - k * 4) * 10) / 10),
    fcr: Math.round(clamp(BASELINE.fcr + k * 10)),
    abandonment: Math.round(clamp(BASELINE.abandonment - k * 5, 0, 100)),
    occupancy: Math.round(clamp(BASELINE.occupancy - k * 8, 0, 100)),
  };
}
