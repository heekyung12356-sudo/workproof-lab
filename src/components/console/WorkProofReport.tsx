import { useState } from 'react';
import RadarChart from '../ui/RadarChart';
import { computeScore, type SessionChoices } from '../../engines/scoring';
import { getScenario } from '../../data/scenarios';
import { REPORTING_ROLES } from '../../data/ops-spec';

interface Props {
  session: SessionChoices | null;
  onReplay: () => void;
  onPickCrisis: () => void;
}

const TONE: Record<string, string> = {
  mint: 'text-mint border-mint/50 bg-mint/10',
  sky: 'text-sky border-sky/50 bg-sky/10',
  amber: 'text-amber border-amber/50 bg-amber/10',
  rose: 'text-rose border-rose/50 bg-rose/10',
};

export default function WorkProofReport({ session, onReplay, onPickCrisis }: Props) {
  const [ai, setAi] = useState<{ state: 'idle' | 'loading' | 'done'; text: string }>({ state: 'idle', text: '' });

  if (!session) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-line bg-ink-900/40 p-6 text-center">
        <h3 className="text-sm font-semibold text-fog-100">No report yet</h3>
        <p className="mt-1 text-[13px] text-fog-500">Play a crisis in the Crisis Room to generate your WorkProof Report.</p>
        <button onClick={onPickCrisis} className="mt-4 rounded-lg bg-sky px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90">Go to Crisis Room →</button>
      </div>
    );
  }

  const scenario = getScenario(session.scenarioId);
  const result = computeScore(session);

  async function runAi() {
    setAi({ state: 'loading', text: '' });
    const lastReport = scenario
      ? Object.values(session!.reports).join('\n') || Object.values(session!.memos).join('\n')
      : '';
    try {
      const res = await fetch('/api/ai-review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reportText: lastReport, total: result.total }),
      });
      const data = (await res.json()) as { review?: string };
      setAi({ state: 'done', text: data.review || 'No review returned.' });
    } catch {
      setAi({ state: 'done', text: 'AI review unavailable right now — your deterministic score above stands on its own.' });
    }
  }

  const choiceSteps = scenario?.steps.filter((s) => s.kind === 'choice') ?? [];
  const routingSteps = scenario?.steps.filter((s) => s.kind === 'routing') ?? [];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-line bg-ink-850/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-fog-500">
          WorkProof Report · Crisis {scenario?.code} — {scenario?.name}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-mono text-4xl font-bold text-fog-100">{result.total}</span>
          <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${TONE[result.grade.tone]}`}>{result.grade.label}</span>
        </div>
        <p className="mt-2 max-w-prose text-[13px] text-fog-400">
          This scores <em>you</em> playing the crisis — a read on how realistic and demanding it is. The candidate’s
          evidence is the reasoning recorded on each call, plus the trade-offs in{' '}
          <a href="/how-id-handle-it" className="text-sky underline">How I’d Handle It</a>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-fog-500">Leadership radar</h3>
          <div className="mx-auto max-w-[360px]"><RadarChart data={result.dimensions} /></div>
        </div>
        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">Dimensions exercised</h3>
          <ul className="space-y-2">
            {result.dimensions.map((d) => (
              <li key={d.key}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-fog-300">{d.label} <span className="text-fog-600">· {d.weight}%</span></span>
                  <span className="font-mono font-semibold text-fog-200">{d.score}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-700"><div className="h-full rounded-full bg-sky" style={{ width: `${d.score}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* calls vs best + your reasoning */}
      <div className="rounded-xl border border-line bg-ink-900/40 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fog-500">Your calls, your reasoning, and how I’d handle it</h3>
        <ol className="space-y-4">
          {choiceSteps.map((step) => {
            const chosen = step.options!.find((o) => o.id === session.selections[step.id]);
            const best = step.options!.find((o) => o.candidatePick);
            const memo = session.memos[step.id];
            const matched = chosen?.id === best?.id;
            return (
              <li key={step.id}>
                <div className="text-[13px] font-semibold text-fog-200">Step {step.index}: {step.title}</div>
                {chosen && (
                  <div className="mt-1 rounded-lg border border-sky/40 bg-sky/5 p-2.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-sky">Your call {matched && '· matches my call'}</div>
                    <div className="text-[13px] text-fog-200">{chosen.label}</div>
                    <div className="mt-1 text-[12px] text-fog-400">→ {chosen.consequence}</div>
                  </div>
                )}
                {memo && (
                  <div className="mt-1.5 rounded-lg border border-line bg-ink-850/50 p-2.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-fog-500">Your reasoning</div>
                    <div className="text-[12px] italic text-fog-300">“{memo}”</div>
                  </div>
                )}
                {!matched && best && (
                  <div className="mt-1.5 rounded-lg border border-mint/30 bg-mint/5 p-2.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-mint">How I’d handle it</div>
                    <div className="text-[13px] text-fog-200">{best.label}</div>
                    <div className="mt-1 text-[12px] text-fog-400">→ {best.consequence}</div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* reporting chain accuracy */}
      {routingSteps.map((step) => {
        const sel = session.routing[step.id] ?? [];
        const correct = step.routingCorrect ?? [];
        const label = (id: string) => REPORTING_ROLES.find((r) => r.id === id)?.label ?? id;
        return (
          <div key={step.id} className="rounded-xl border border-line bg-ink-900/40 p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">Reporting chain — {step.title}</h3>
            <div className="grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
              <div><span className="text-fog-500">You routed to: </span><span className="text-fog-200">{sel.map(label).join(', ') || '—'}</span></div>
              <div><span className="text-fog-500">Correct routing: </span><span className="text-mint">{correct.map(label).join(', ')}</span></div>
            </div>
          </div>
        );
      })}

      {/* AI review */}
      <div className="rounded-xl border border-line bg-ink-900/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-500">Optional: AI review of your written report</h3>
          <button onClick={runAi} disabled={ai.state === 'loading'} className="rounded-lg border border-iris/50 bg-iris/10 px-3 py-1.5 text-[12px] font-semibold text-iris hover:bg-iris/20 disabled:opacity-50">
            {ai.state === 'loading' ? 'Reviewing…' : 'Run AI review'}
          </button>
        </div>
        <p className="mt-1 text-[11px] text-fog-600">AI is an assistant, never the judge — your score above is computed by a deterministic local engine.</p>
        {ai.text && <div className="mt-3 whitespace-pre-wrap rounded-lg border border-line bg-ink-850/60 p-3 text-[13px] leading-relaxed text-fog-300">{ai.text}</div>}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <a href="/how-id-handle-it" className="flex-1 rounded-lg bg-sky px-4 py-3 text-center text-sm font-semibold text-ink-950 hover:opacity-90">See how I’d handle it →</a>
        <button onClick={onPickCrisis} className="flex-1 rounded-lg border border-line bg-ink-850 px-4 py-3 text-center text-sm font-semibold text-fog-200 hover:border-fog-600">Try another crisis</button>
        <button onClick={onReplay} className="rounded-lg border border-line bg-ink-850 px-4 py-3 text-center text-sm font-semibold text-fog-400 hover:border-fog-600">Replay this one</button>
      </div>
    </div>
  );
}
