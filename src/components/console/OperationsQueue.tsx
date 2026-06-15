import { useState } from 'react';
import { WORK_ITEMS } from '../../data/cases';
import { TEAM } from '../../data/team';

const nameOf = (id?: string) => TEAM.find((m) => m.id === id)?.name ?? '—';

const PRI: Record<string, string> = {
  P1: 'bg-rose/15 text-rose',
  P2: 'bg-amber/15 text-amber',
  P3: 'bg-ink-700 text-fog-400',
};
const CX: Record<string, string> = {
  High: 'text-rose',
  Med: 'text-amber',
  Low: 'text-mint',
};

export default function OperationsQueue() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-line bg-ink-900/40">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold text-fog-100">Operations Queue</h3>
        <span className="text-[11px] text-fog-500">
          {WORK_ITEMS.length} work items · Rule Assist signals shown
        </span>
      </div>

      {/* desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-[13px]">
          <thead className="text-[11px] uppercase tracking-wide text-fog-500">
            <tr className="border-b border-line">
              <th className="px-3 py-2">Case</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Impact</th>
              <th className="px-3 py-2">Cx</th>
              <th className="px-3 py-2">Deadline</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Rule Assist signal</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {WORK_ITEMS.map((w) => (
              <tr key={w.id} className="hover:bg-ink-850/50">
                <td className="px-3 py-2">
                  <span className={`mr-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${PRI[w.priority]}`}>{w.priority}</span>
                  <span className="font-mono text-[11px] text-fog-500">{w.id}</span>
                </td>
                <td className="px-3 py-2">
                  <span className={w.tier === 'VIP' ? 'font-semibold text-fog-100' : 'text-fog-300'}>{w.clientLabel}</span>
                  {w.flag === 'data_loss' && <span className="ml-1 rounded bg-rose/15 px-1 text-[10px] font-bold text-rose">DATA LOSS</span>}
                  {w.flag === 'duplicate' && <span className="ml-1 rounded bg-amber/15 px-1 text-[10px] font-bold text-amber">DUP?</span>}
                </td>
                <td className="px-3 py-2 text-fog-400">{w.impact}</td>
                <td className={`px-3 py-2 font-medium ${CX[w.complexity]}`}>{w.complexity}</td>
                <td className="px-3 py-2 font-mono text-fog-300">{w.status === 'in_progress' ? '● live' : `${w.deadlineMin}m`}</td>
                <td className="px-3 py-2 text-fog-400">{nameOf(w.assignee)}</td>
                <td className="px-3 py-2 text-[12px] text-fog-400">
                  <span className="text-iris">◆</span> {w.riskSignal}
                </td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${w.status === 'in_progress' ? 'bg-sky/15 text-sky' : 'bg-ink-700 text-fog-400'}`}>{w.status === 'in_progress' ? 'in progress' : 'queued'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <ul className="divide-y divide-line md:hidden">
        {WORK_ITEMS.map((w) => (
          <li key={w.id} className="px-3 py-2.5">
            <button onClick={() => setOpen(open === w.id ? null : w.id)} className="flex w-full items-center gap-2 text-left">
              <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${PRI[w.priority]}`}>{w.priority}</span>
              <span className={`truncate text-[13px] ${w.tier === 'VIP' ? 'font-semibold text-fog-100' : 'text-fog-300'}`}>{w.clientLabel}</span>
              <span className="ml-auto font-mono text-[11px] text-fog-500">{w.status === 'in_progress' ? '● live' : `${w.deadlineMin}m`}</span>
            </button>
            {open === w.id && (
              <div className="mt-2 space-y-1 text-[12px] text-fog-400">
                <div>{w.subject}</div>
                <div>Impact: {w.impact} · Cx: <span className={CX[w.complexity]}>{w.complexity}</span></div>
                <div>Owner: {nameOf(w.assignee)}</div>
                <div className="text-iris">◆ {w.riskSignal}</div>
                <div className="rounded bg-ink-850/60 p-1.5 text-fog-500">Suggested: {w.suggestedAction}</div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="border-t border-line px-4 py-2 text-[11px] text-fog-600">
        Rule Assist proposes signals & suggested actions. You make the call — it never auto-acts.
      </p>
    </div>
  );
}
