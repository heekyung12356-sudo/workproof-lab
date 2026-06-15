import { useState } from 'react';
import RadarChart from '../ui/RadarChart';
import { computeScore, type SessionChoices } from '../../engines/scoring';
import { SCENARIO_01 } from '../../data/scenarios/scenario01';

interface Props {
  choices: SessionChoices;
  onReplay: () => void;
}

const TONE_BG: Record<string, string> = {
  mint: 'text-mint border-mint/50 bg-mint/10',
  sky: 'text-sky border-sky/50 bg-sky/10',
  amber: 'text-amber border-amber/50 bg-amber/10',
  rose: 'text-rose border-rose/50 bg-rose/10',
};

export default function ResultReport({ choices, onReplay }: Props) {
  const result = computeScore(choices);
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'done' | 'fallback'>('idle');
  const [aiText, setAiText] = useState('');

  async function runAiReview() {
    setAiState('loading');
    try {
      const res = await fetch('/api/ai-review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          selections: choices.selections,
          reportText: choices.reportText,
          total: result.total,
        }),
      });
      if (!res.ok) throw new Error('bad status');
      const data = (await res.json()) as { review?: string; source?: string };
      setAiText(data.review || '');
      setAiState(data.source === 'deepseek' ? 'done' : 'fallback');
    } catch {
      // 로컬 폴백 — API 실패해도 데모는 항상 작동 (지시서 §5, §13 Edge Cases)
      setAiText(localFallbackReview(result.total));
      setAiState('fallback');
    }
  }

  return (
    <section aria-label="Your result" className="space-y-5">
      <div className="rounded-xl border border-line bg-ink-850/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-fog-500">
          Your Result · you played the crisis
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-mono text-4xl font-bold text-fog-100">{result.total}</span>
          <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${TONE_BG[result.grade.tone]}`}>
            {result.grade.label}
          </span>
        </div>
        <p className="mt-2 max-w-prose text-sm text-fog-400">
          This is <em>your</em> score for playing the scenario — a read on how tough and realistic it is, not the
          candidate’s self-grade. The candidate’s evidence is the reasoning + trade-offs in{' '}
          <a href="/how-id-handle-it" className="text-sky underline">
            How I’d Handle It
          </a>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-fog-500">Dimension radar</h3>
          <div className="mx-auto max-w-[340px]">
            <RadarChart data={result.dimensions} />
          </div>
        </div>
        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">Weighted breakdown</h3>
          <ul className="space-y-2.5">
            {result.dimensions.map((d) => (
              <li key={d.key}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-fog-300">
                    {d.label} <span className="text-fog-600">· {d.weight}%</span>
                  </span>
                  <span className="font-mono font-semibold text-fog-200">{d.score}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
                  <div className="h-full rounded-full bg-sky" style={{ width: `${d.score}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Your choice vs other reasonable choices */}
      <div className="rounded-xl border border-line bg-ink-900/40 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fog-500">
          Your calls vs. other reasonable choices
        </h3>
        <ol className="space-y-4">
          {SCENARIO_01.steps
            .filter((s) => s.kind === 'choice')
            .map((step) => {
              const chosenId = choices.selections[step.id];
              const chosen = step.options!.find((o) => o.id === chosenId);
              const others = step.options!.filter((o) => o.id !== chosenId);
              return (
                <li key={step.id}>
                  <div className="text-[13px] font-semibold text-fog-200">
                    Step {step.index}: {step.title}
                  </div>
                  {chosen && (
                    <div className="mt-1 rounded-lg border border-sky/40 bg-sky/5 p-2.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-sky">Your call</div>
                      <div className="text-[13px] text-fog-200">{chosen.label}</div>
                      <div className="mt-1 text-[12px] text-fog-400">→ {chosen.consequence}</div>
                    </div>
                  )}
                  <details className="mt-1.5">
                    <summary className="cursor-pointer text-[12px] text-fog-500">
                      Other choices & what they’d cost ({others.length})
                    </summary>
                    <ul className="mt-1.5 space-y-1.5">
                      {others.map((o) => (
                        <li key={o.id} className="rounded-lg border border-line bg-ink-850/50 p-2">
                          <div className="text-[12px] text-fog-300">{o.label}</div>
                          <div className="mt-0.5 text-[11px] text-fog-500">→ {o.consequence}</div>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
        </ol>
      </div>

      {/* Optional AI review */}
      <div className="rounded-xl border border-line bg-ink-900/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-500">
            Optional: AI review of your written report
          </h3>
          <button
            onClick={runAiReview}
            disabled={aiState === 'loading'}
            className="rounded-lg border border-iris/50 bg-iris/10 px-3 py-1.5 text-[12px] font-semibold text-iris hover:bg-iris/20 disabled:opacity-50"
          >
            {aiState === 'loading' ? 'Reviewing…' : 'Run AI review'}
          </button>
        </div>
        <p className="mt-1 text-[11px] text-fog-600">
          AI is an assistant, never the judge — your score above is computed by a deterministic local engine. If the
          API is unavailable, a local fallback review is shown instead.
        </p>
        {aiText && (
          <div className="mt-3 whitespace-pre-wrap rounded-lg border border-line bg-ink-850/60 p-3 text-[13px] leading-relaxed text-fog-300">
            {aiState === 'fallback' && (
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-amber">
                Local fallback review
              </span>
            )}
            {aiText}
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href="/how-id-handle-it"
          className="flex-1 rounded-lg bg-sky px-4 py-3 text-center text-sm font-semibold text-ink-950 hover:opacity-90"
        >
          See how I’d handle it →
        </a>
        <a
          href="/case-study"
          className="flex-1 rounded-lg border border-line bg-ink-850 px-4 py-3 text-center text-sm font-semibold text-fog-200 hover:border-fog-600"
        >
          Read the system case study
        </a>
        <button
          onClick={onReplay}
          className="rounded-lg border border-line bg-ink-850 px-4 py-3 text-center text-sm font-semibold text-fog-400 hover:border-fog-600"
        >
          Replay
        </button>
      </div>
    </section>
  );
}

function localFallbackReview(total: number): string {
  const band =
    total >= 90
      ? 'You handled this like a seasoned ops lead — priorities, escalation, and recovery all lined up.'
      : total >= 75
        ? 'Strong instincts. A couple of calls traded short-term comfort for long-term risk — tighten those and you’re ready.'
        : total >= 60
          ? 'You kept the lights on, but some calls under-weighted compliance exposure or proactive customer comms.'
          : 'This crisis bites. The misses here are exactly the ones a real ops lead has to avoid — see the commentary for the reasoning.';
  return `${band}\n\nThe deterministic engine scored you ${total}/100. The biggest differentiator in this scenario is whether the data-loss event is routed as a mandatory Ops Manager report and whether customers hear from you proactively. Compare your calls against the commentary to see the trade-offs.`;
}
