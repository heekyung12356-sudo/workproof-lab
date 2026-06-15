import { useEffect, useState } from 'react';
import CommandCenter from './CommandCenter';
import DecisionWorkspace from './DecisionWorkspace';
import ResultReport from './ResultReport';
import { SCENARIO_01 } from '../../data/scenarios/scenario01';
import { STORAGE_KEY } from '../../utils/constants';
import type { SessionChoices } from '../../engines/scoring';

type Phase = 'briefing' | 'playing' | 'result';

interface DemoState {
  phase: Phase;
  /** index into choiceable+report steps (0-based) */
  cursor: number;
  selections: Record<string, string>;
  memos: Record<string, string>;
  reportText: string;
}

const STEPS = SCENARIO_01.steps;
const TOTAL = STEPS.length;

const FRESH: DemoState = {
  phase: 'briefing',
  cursor: 0,
  selections: {},
  memos: {},
  reportText: '',
};

function load(): DemoState {
  if (typeof window === 'undefined') return FRESH;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return FRESH;
    const parsed = JSON.parse(raw) as DemoState;
    if (!parsed || typeof parsed.cursor !== 'number') return FRESH;
    return { ...FRESH, ...parsed };
  } catch {
    return FRESH;
  }
}

export default function OpsLeaderDemo() {
  const [state, setState] = useState<DemoState>(FRESH);
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const loaded = load();
    setState(loaded);
    setHydrated(true);
    if (loaded.phase !== 'briefing' || Object.keys(loaded.selections).length > 0) {
      setRestored(true);
    }
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
  }, [state, hydrated]);

  const step = STEPS[state.cursor];

  function patch(p: Partial<DemoState>) {
    setState((s) => ({ ...s, ...p }));
  }

  function commit() {
    if (state.cursor < TOTAL - 1) {
      patch({ cursor: state.cursor + 1 });
    } else {
      patch({ phase: 'result' });
    }
  }

  function reset() {
    setRestored(false);
    setState(FRESH);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  const choices: SessionChoices = {
    selections: state.selections,
    reportText: state.reportText,
  };

  const locked = STEPS.slice(0, state.cursor)
    .filter((s) => s.kind === 'choice')
    .map((s) => {
      const opt = s.options?.find((o) => o.id === state.selections[s.id]);
      return { title: s.title, choiceLabel: opt?.label ?? '—' };
    });

  /* ------------------------------ render ------------------------------- */
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      {/* Left: Command Center (always visible context) */}
      <div className="order-2 lg:order-1">
        <CommandCenter selections={state.selections} />
      </div>

      {/* Right: flow */}
      <div className="order-1 lg:order-2">
        {restored && state.phase !== 'briefing' && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-mint/40 bg-mint/10 px-3 py-2 text-[12px] text-mint">
            <span>Session restored from your last visit.</span>
            <button onClick={reset} className="font-semibold underline">
              Start over
            </button>
          </div>
        )}

        {state.phase === 'briefing' && (
          <section className="rounded-xl border border-line bg-ink-850/70 p-5">
            <span className="rounded bg-rose/15 px-2 py-0.5 font-mono text-[11px] font-bold text-rose">
              LIVE CRISIS
            </span>
            <h2 className="mt-2 text-xl font-bold text-fog-100">{SCENARIO_01.name}</h2>
            <p className="text-[13px] text-fog-500">{SCENARIO_01.tagline}</p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-fog-300">
              {SCENARIO_01.briefing}
            </pre>
            <button
              onClick={() => patch({ phase: 'playing' })}
              className="mt-4 w-full rounded-lg bg-sky px-4 py-3 text-sm font-semibold text-ink-950 hover:opacity-90"
            >
              Take the shift →
            </button>
            <p className="mt-2 text-center text-[11px] text-fog-600">
              No login. ~3 minutes. Your progress saves automatically.
            </p>
          </section>
        )}

        {state.phase === 'playing' && (
          <DecisionWorkspace
            step={step}
            totalSteps={TOTAL}
            selection={state.selections[step.id]}
            memo={state.memos[step.id] ?? ''}
            reportText={state.reportText}
            onSelect={(optionId) =>
              patch({ selections: { ...state.selections, [step.id]: optionId } })
            }
            onMemo={(text) => patch({ memos: { ...state.memos, [step.id]: text } })}
            onReport={(text) => patch({ reportText: text })}
            onCommit={commit}
            committed={false}
            locked={locked}
          />
        )}

        {state.phase === 'result' && (
          <ResultReport choices={choices} onReplay={reset} />
        )}
      </div>
    </div>
  );
}
