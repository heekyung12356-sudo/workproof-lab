import { useEffect, useState } from 'react';
import { CASES } from '../../data/cases';
import { TEAM } from '../../data/team';
import { STAFFING_SNAPSHOT } from '../../data/team';
import { deriveKpis, availableHeadcount, BASELINE } from '../../engines/opsState';

interface Props {
  selections: Record<string, string>;
}

const STATUS_STYLE: Record<string, string> = {
  available: 'text-mint border-mint/40 bg-mint/10',
  absent: 'text-rose border-rose/40 bg-rose/10',
  busy: 'text-amber border-amber/40 bg-amber/10',
  training: 'text-iris border-iris/40 bg-iris/10',
};

function fmtClock(totalSec: number) {
  const s = Math.max(0, totalSec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(h * 60 + m).padStart(2, '0');
  return `${mm}:${String(sec).padStart(2, '0')}`;
}

function SlaClock({ label, startMin, tier }: { label: string; startMin: number; tier: 'VIP' }) {
  const [remaining, setRemaining] = useState(startMin * 60);
  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const min = remaining / 60;
  const tone =
    min <= 15 ? 'text-rose border-rose/50' : min <= 30 ? 'text-amber border-amber/50' : 'text-mint border-mint/50';
  return (
    <div className={`rounded-lg border ${tone} bg-ink-900/60 px-3 py-2`}>
      <div className="text-[11px] uppercase tracking-wide text-fog-500">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold tabular-nums">{fmtClock(remaining)}</span>
        <span className="text-[11px] text-fog-500">{tier} P1 · 2h resolution</span>
      </div>
    </div>
  );
}

function Kpi({ label, value, base, suffix = '', goodWhenHigh = true }: {
  label: string; value: number; base: number; suffix?: string; goodWhenHigh?: boolean;
}) {
  const delta = value - base;
  const improved = goodWhenHigh ? delta > 0 : delta < 0;
  const worsened = goodWhenHigh ? delta < 0 : delta > 0;
  const tone = delta === 0 ? 'text-fog-400' : improved ? 'text-mint' : worsened ? 'text-rose' : 'text-fog-400';
  const arrow = delta === 0 ? '·' : delta > 0 ? '▲' : '▼';
  return (
    <div className="rounded-lg border border-line bg-ink-900/50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-fog-500">{label}</div>
      <div className="font-mono text-lg font-bold text-fog-100 tabular-nums">
        {value}
        {suffix}
      </div>
      <div className={`text-[11px] tabular-nums ${tone}`}>
        {arrow} {delta === 0 ? 'steady' : `${Math.abs(Math.round(delta * 10) / 10)}${suffix} vs start`}
      </div>
    </div>
  );
}

export default function CommandCenter({ selections }: Props) {
  const kpis = deriveKpis(selections);
  const avail = availableHeadcount();
  const queued = CASES.filter((c) => c.status === 'queued');
  const inProgress = CASES.filter((c) => c.status === 'in_progress');

  return (
    <section aria-label="Command Center" className="space-y-4">
      {/* KPI strip */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">
          Live KPIs <span className="font-normal normal-case text-fog-600">— move causally with your calls</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Kpi label="SLA Attainment" value={kpis.slaAttainment} base={BASELINE.slaAttainment} suffix="%" />
          <Kpi label="Queue Depth" value={kpis.queueDepth} base={BASELINE.queueDepth} goodWhenHigh={false} />
          <Kpi label="ASA" value={Math.round(kpis.asaSeconds / 6) / 10} base={Math.round(BASELINE.asaSeconds / 6) / 10} suffix="m" goodWhenHigh={false} />
          <Kpi label="CSAT" value={kpis.csat} base={BASELINE.csat} suffix="%" />
          <Kpi label="FCR" value={kpis.fcr} base={BASELINE.fcr} suffix="%" />
          <Kpi label="AHT" value={kpis.ahtMin} base={BASELINE.ahtMin} suffix="m" goodWhenHigh={false} />
          <Kpi label="Abandonment" value={kpis.abandonment} base={BASELINE.abandonment} suffix="%" goodWhenHigh={false} />
          <Kpi label="Occupancy" value={kpis.occupancy} base={BASELINE.occupancy} suffix="%" goodWhenHigh={false} />
        </div>
      </div>

      {/* SLA clocks */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SlaClock label="VIP-A · Northwind — P1 outage" startMin={120} tier="VIP" />
        <SlaClock label="VIP-B · Helio — P1 data loss" startMin={95} tier="VIP" />
      </div>

      {/* Queue + Team */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Operations Queue */}
        <div className="rounded-xl border border-line bg-ink-900/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-500">Operations Queue</h3>
            <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-fog-400">
              {queued.length} queued · {inProgress.length} in progress
            </span>
          </div>
          <ul className="space-y-1.5">
            {CASES.map((c) => {
              const isVip = c.tier === 'VIP';
              const danger = c.slaRemainingMin <= 120 && isVip;
              return (
                <li
                  key={c.id}
                  className="flex items-start gap-2 rounded-lg border border-line/70 bg-ink-850/60 px-2.5 py-2 text-sm"
                >
                  <span
                    className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                      c.priority === 'P1' ? 'bg-rose/15 text-rose' : c.priority === 'P2' ? 'bg-amber/15 text-amber' : 'bg-ink-700 text-fog-400'
                    }`}
                  >
                    {c.priority}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`truncate text-[13px] ${isVip ? 'font-semibold text-fog-100' : 'text-fog-300'}`}>
                        {c.clientLabel}
                      </span>
                      {c.flag === 'data_loss' && (
                        <span className="rounded bg-rose/15 px-1 text-[10px] font-semibold text-rose">DATA LOSS</span>
                      )}
                    </div>
                    <div className="truncate text-[12px] text-fog-500">{c.subject}</div>
                  </div>
                  <div className={`shrink-0 text-right font-mono text-[11px] ${danger ? 'text-rose' : 'text-fog-500'}`}>
                    {c.status === 'in_progress' ? '● live' : `${c.slaRemainingMin}m`}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Team Capacity Board */}
        <div className="rounded-xl border border-line bg-ink-900/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-500">Team Capacity Board</h3>
            <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-fog-400">
              {avail} available / {STAFFING_SNAPSHOT.headcount} · {STAFFING_SNAPSHOT.absent} absent · {STAFFING_SNAPSHOT.training} training
            </span>
          </div>
          <ul className="space-y-1.5">
            {TEAM.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-2 rounded-lg border border-line/70 bg-ink-850/60 px-2.5 py-1.5 text-sm"
              >
                <span className="w-24 shrink-0 truncate text-[13px] text-fog-200">{m.name}</span>
                <span className="w-10 shrink-0 font-mono text-[11px] text-fog-500">{m.role}</span>
                <span className="hidden flex-1 truncate text-[11px] text-fog-600 sm:block">
                  bil{m.skills.billing}/tec{m.skills.technical}/de{m.skills.deescalation} · {m.timezone.split(' ')[1] ?? ''}
                </span>
                <span className={`ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLE[m.status]}`}>
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
