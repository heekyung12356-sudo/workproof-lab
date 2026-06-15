/* ===========================================================================
   Generalized, deterministic scoring over a company's own dimensions + scenario.
   동일 입력 → 동일 점수 (방어 가능). AI는 점수에 관여하지 않는다.
   =========================================================================== */
import type { Company } from '../data/companies/types';

export interface Session {
  selections: Record<string, string>; // stepId -> optionId
  routing: Record<string, string[]>;  // stepId -> target ids
  memos: Record<string, string>;
  reports: Record<string, string>;
}

export interface DimScore { key: string; label: string; weight: number; score: number; }
export interface Result {
  dimensions: DimScore[];
  total: number;
  grade: { label: string; tone: 'mint' | 'sky' | 'amber' | 'rose' };
}

export const GRADES = [
  { min: 90, label: 'Role-Ready', tone: 'mint' as const },
  { min: 75, label: 'Strong Fit', tone: 'sky' as const },
  { min: 60, label: 'Developing', tone: 'amber' as const },
  { min: 0, label: 'Needs Practice', tone: 'rose' as const },
];
export const gradeFor = (t: number) => GRADES.find((g) => t >= g.min) ?? GRADES[GRADES.length - 1];

export function emptySession(): Session {
  return { selections: {}, routing: {}, memos: {}, reports: {} };
}

export function scoreReport(text: string, hints: string[]): number {
  const t = (text || '').toLowerCase().trim();
  if (!t) return 0;
  const words = t.split(/\s+/).filter(Boolean).length;
  const lengthScore = Math.max(0, Math.min(40, ((words - 8) / 27) * 40));
  const hit = hints.length ? hints.filter((h) => t.includes(h)).length : 0;
  const coverage = hints.length ? (hit / hints.length) * 60 : 0;
  return Math.round(Math.max(0, Math.min(100, lengthScore + coverage)));
}

function scoreRouting(selected: string[], correct: string[]): number {
  const sel = new Set(selected ?? []);
  const cor = new Set(correct ?? []);
  if (!cor.size) return 0;
  let inter = 0;
  cor.forEach((c) => sel.has(c) && inter++);
  const union = new Set([...sel, ...cor]).size;
  return Math.round((inter / union) * 100);
}

export function computeScore(company: Company, s: Session): Result {
  const buckets: Record<string, number[]> = {};
  for (const d of company.dimensions) buckets[d.key] = [];

  for (const step of company.scenario.steps) {
    if (step.kind === 'choice') {
      const opt = step.options?.find((o) => o.id === s.selections[step.id]);
      if (opt) for (const [k, v] of Object.entries(opt.scores)) if (buckets[k]) buckets[k].push(v);
    } else if (step.kind === 'routing') {
      const acc = scoreRouting(s.routing[step.id] ?? [], step.routingCorrect ?? []);
      for (const k of step.scoresDimensions) if (buckets[k]) buckets[k].push(acc);
    } else if (step.kind === 'report') {
      const r = scoreReport(s.reports[step.id] ?? '', step.reportRubricHints ?? []);
      for (const k of step.scoresDimensions) if (buckets[k]) buckets[k].push(r);
    }
  }

  // memo quality -> small, even contribution to documentation-like dims if present
  const memoTexts = Object.values(s.memos).filter((m) => m && m.trim());
  if (memoTexts.length) {
    const avgWords = memoTexts.reduce((a, m) => a + m.trim().split(/\s+/).length, 0) / memoTexts.length;
    const memoScore = Math.round(Math.max(0, Math.min(100, ((avgWords - 4) / 16) * 100)));
    // nudge the lowest-weight "communication/documentation" style dim if it exists
    const docDim = company.dimensions.find((d) => /document|communicat|report|proposal/i.test(d.label));
    if (docDim) buckets[docDim.key].push(memoScore);
  }

  const dimensions: DimScore[] = company.dimensions
    .filter((d) => buckets[d.key].length > 0)
    .map((d) => {
      const arr = buckets[d.key];
      return { key: d.key, label: d.label, weight: d.weight, score: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) };
    });

  const tw = dimensions.reduce((a, d) => a + d.weight, 0) || 1;
  const total = Math.round(dimensions.reduce((a, d) => a + d.score * d.weight, 0) / tw);
  return { dimensions, total, grade: gradeFor(total) };
}

export function isComplete(company: Company, s: Session): boolean {
  return company.scenario.steps.every((step) => {
    if (step.kind === 'choice') return Boolean(s.selections[step.id]);
    if (step.kind === 'routing') return (s.routing[step.id]?.length ?? 0) > 0;
    if (step.kind === 'report') return (s.reports[step.id] ?? '').trim().length > 0;
    return true;
  });
}
