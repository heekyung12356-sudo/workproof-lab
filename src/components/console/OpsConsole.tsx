import { useEffect, useState } from 'react';
import CommandCenter from './CommandCenter';
import OperationsQueue from './OperationsQueue';
import TeamBoard from './TeamBoard';
import CrisisRoom from './CrisisRoom';
import WorkProofReport from './WorkProofReport';
import { CONSOLE } from '../../data/brand';
import { getScenario } from '../../data/scenarios';
import { emptySession, isComplete, type SessionChoices } from '../../engines/scoring';
import { STORAGE_KEY } from '../../utils/constants';

type View = 'command' | 'queue' | 'team' | 'crisis' | 'report';
type Phase = 'idle' | 'briefing' | 'playing' | 'done';

interface State {
  view: View;
  activeScenarioId: string | null;
  phase: Phase;
  cursor: number;
  session: SessionChoices;
  lastResult: SessionChoices | null;
  completed: string[];
}

const FRESH: State = {
  view: 'command',
  activeScenarioId: null,
  phase: 'idle',
  cursor: 0,
  session: emptySession(''),
  lastResult: null,
  completed: [],
};

const NAV: { id: View; label: string; glyph: string }[] = [
  { id: 'command', label: 'Command Center', glyph: '◳' },
  { id: 'queue', label: 'Operations Queue', glyph: '☰' },
  { id: 'team', label: 'Team Board', glyph: '◑' },
  { id: 'crisis', label: 'Crisis Room', glyph: '⚠' },
  { id: 'report', label: 'WorkProof Report', glyph: '◆' },
];

function load(): State {
  if (typeof window === 'undefined') return FRESH;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return FRESH;
    const p = JSON.parse(raw) as State;
    if (!p || typeof p.cursor !== 'number') return FRESH;
    return { ...FRESH, ...p, session: p.session ?? emptySession('') };
  } catch {
    return FRESH;
  }
}

function LiveClock() {
  const [t, setT] = useState('09:00:00');
  useEffect(() => {
    let s = 9 * 3600;
    const id = setInterval(() => {
      s += 1;
      const h = Math.floor(s / 3600) % 24;
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      setT(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-[13px] text-fog-400 tabular-nums">{t} KST</span>;
}

export default function OpsConsole() {
  const [s, setS] = useState<State>(FRESH);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setS(load()); setHydrated(true); }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  }, [s, hydrated]);

  const patch = (p: Partial<State>) => setS((prev) => ({ ...prev, ...p }));
  const scenario = s.activeScenarioId ? getScenario(s.activeScenarioId) ?? null : null;
  const crisisActive = Boolean(s.activeScenarioId) && s.phase !== 'idle' && s.phase !== 'done';

  /* ---- crisis handlers ---- */
  const pick = (id: string) => patch({ activeScenarioId: id, phase: 'briefing', cursor: 0, session: emptySession(id) });
  const startShift = () => patch({ phase: 'playing', cursor: 0 });
  const select = (stepId: string, optId: string) =>
    setS((p) => ({ ...p, session: { ...p.session, selections: { ...p.session.selections, [stepId]: optId } } }));
  const route = (stepId: string, roleId: string) =>
    setS((p) => {
      const cur = p.session.routing[stepId] ?? [];
      const next = cur.includes(roleId) ? cur.filter((r) => r !== roleId) : [...cur, roleId];
      return { ...p, session: { ...p.session, routing: { ...p.session.routing, [stepId]: next } } };
    });
  const memo = (stepId: string, text: string) =>
    setS((p) => ({ ...p, session: { ...p.session, memos: { ...p.session.memos, [stepId]: text } } }));
  const report = (stepId: string, text: string) =>
    setS((p) => ({ ...p, session: { ...p.session, reports: { ...p.session.reports, [stepId]: text } } }));

  const commit = () => {
    if (!scenario) return;
    if (s.cursor < scenario.steps.length - 1) {
      patch({ cursor: s.cursor + 1 });
    } else {
      const done = [...new Set([...s.completed, scenario.id])];
      patch({ phase: 'done', lastResult: s.session, completed: done });
    }
  };
  const resetCrisis = () => patch({ activeScenarioId: null, phase: 'idle', cursor: 0, session: emptySession('') });
  const viewReport = () => patch({ view: 'report' });

  const kpiScenarioId = s.activeScenarioId ?? 'absence-sla';

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-900 shadow-2xl shadow-black/40">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-ink-850 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-sky/15 font-bold text-sky">C</span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-fog-100">{CONSOLE.name}</div>
            <div className="text-[10px] text-fog-600">by {CONSOLE.by}</div>
          </div>
          <span className="ml-3 hidden rounded-full border border-line px-2 py-0.5 text-[11px] text-fog-400 sm:inline">{CONSOLE.org}</span>
        </div>
        <div className="flex items-center gap-3">
          {crisisActive && <span className="hidden animate-pulse rounded bg-rose/15 px-2 py-0.5 font-mono text-[10px] font-bold text-rose sm:inline">● LIVE CRISIS {scenario?.code}</span>}
          <LiveClock />
          <span className="flex items-center gap-1.5 text-[12px] text-fog-300"><span className="grid h-6 w-6 place-items-center rounded-full bg-ink-700 text-[10px]">You</span><span className="hidden sm:inline">Team Lead</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)]">
        {/* sidebar */}
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-ink-900 p-2 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
          {NAV.map((n) => {
            const active = s.view === n.id;
            const live = n.id === 'crisis' && crisisActive;
            return (
              <button
                key={n.id}
                onClick={() => patch({ view: n.id })}
                aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors md:w-full ${active ? 'bg-ink-800 font-semibold text-fog-100' : 'text-fog-400 hover:bg-ink-850 hover:text-fog-200'}`}
              >
                <span className={live ? 'text-rose' : active ? 'text-sky' : 'text-fog-600'}>{n.glyph}</span>
                <span className="whitespace-nowrap">{n.label}</span>
                {live && <span className="ml-auto hidden h-1.5 w-1.5 animate-pulse rounded-full bg-rose md:block" />}
              </button>
            );
          })}
          <div className="mt-auto hidden px-3 pt-4 text-[10px] text-fog-700 md:block">
            Virtual ops console.<br />Tools differ between companies — the judgment doesn’t.
          </div>
        </nav>

        {/* main */}
        <div className="min-h-[560px] bg-ink-950/40 p-4 sm:p-5">
          {s.view === 'command' && (
            <CommandCenter scenarioId={kpiScenarioId} selections={s.session.selections} crisisActive={crisisActive} onGoto={(v) => patch({ view: v })} />
          )}
          {s.view === 'queue' && <OperationsQueue />}
          {s.view === 'team' && <TeamBoard />}
          {s.view === 'crisis' && (
            <CrisisRoom
              scenario={scenario}
              phase={s.phase}
              cursor={s.cursor}
              session={s.session}
              completed={s.completed}
              onPick={pick}
              onStartShift={startShift}
              onSelect={select}
              onRoute={route}
              onMemo={memo}
              onReport={report}
              onCommit={commit}
              onReset={resetCrisis}
              onViewReport={viewReport}
            />
          )}
          {s.view === 'report' && (
            <WorkProofReport
              session={s.lastResult ?? (isComplete(s.session) ? s.session : null)}
              onReplay={() => s.lastResult && pick(s.lastResult.scenarioId)}
              onPickCrisis={() => { resetCrisis(); patch({ view: 'crisis' }); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
