import { WORK_ITEMS, DAILY_VOLUME, VIP_COUNT } from '../../data/cases';
import { TEAM, STAFFING, availableHeadcount } from '../../data/team';
import { deriveKpis, BASELINE } from '../../engines/opsState';
import SlaClock from './SlaClock';

interface Props {
  scenarioId: string;
  selections: Record<string, string>;
  crisisActive: boolean;
  onGoto: (view: 'queue' | 'team' | 'crisis') => void;
}

function Kpi({ label, sub, value, base, suffix = '', goodHigh = true }: {
  label: string; sub: string; value: number; base: number; suffix?: string; goodHigh?: boolean;
}) {
  const delta = Math.round((value - base) * 10) / 10;
  const improved = goodHigh ? delta > 0 : delta < 0;
  const tone = delta === 0 ? 'text-fog-500' : improved ? 'text-mint' : 'text-rose';
  const arrow = delta === 0 ? '·' : delta > 0 ? '▲' : '▼';
  return (
    <div className="rounded-xl border border-line bg-ink-900/50 p-3">
      <div className="text-[11px] font-medium text-fog-300">{label}</div>
      <div className="text-[10px] text-fog-600">{sub}</div>
      <div className="mt-1 font-mono text-xl font-bold text-fog-100 tabular-nums">{value}{suffix}</div>
      <div className={`text-[10px] tabular-nums ${tone}`}>{arrow} {delta === 0 ? 'steady' : `${Math.abs(delta)}${suffix}`}</div>
    </div>
  );
}

const DOT: Record<string, string> = {
  rose: 'bg-rose',
  amber: 'bg-amber',
  sky: 'bg-sky',
  mint: 'bg-mint',
};
const RISKS = [
  { tone: 'rose', text: '2 VIP P1 incidents open — one is a data-loss / compliance trigger.' },
  { tone: 'amber', text: 'Below minimum staffing: 2 no-shows + 1 in training.' },
  { tone: 'amber', text: 'Senior (Mina) over capacity with a burnout flag.' },
  { tone: 'sky', text: 'Refund request above agent authority awaiting approval.' },
];

export default function CommandCenter({ scenarioId, selections, crisisActive, onGoto }: Props) {
  const kpis = deriveKpis(scenarioId, selections);
  const avail = availableHeadcount();
  const queued = WORK_ITEMS.filter((w) => w.status === 'queued');
  const vipOpen = WORK_ITEMS.filter((w) => w.tier === 'VIP').length;

  return (
    <div className="space-y-5">
      {/* headline stat row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-rose/30 bg-rose/5 p-3">
          <div className="text-[11px] uppercase tracking-wide text-rose">SLA at risk</div>
          <SlaClock label="VIP-A · breach in" startMin={120} />
        </div>
        <div className="rounded-xl border border-line bg-ink-900/50 p-3">
          <div className="text-[11px] uppercase tracking-wide text-fog-500">Daily volume</div>
          <div className="font-mono text-2xl font-bold text-fog-100">{DAILY_VOLUME}</div>
          <div className="text-[10px] text-fog-600">work items / day</div>
        </div>
        <div className="rounded-xl border border-line bg-ink-900/50 p-3">
          <div className="text-[11px] uppercase tracking-wide text-fog-500">VIP accounts</div>
          <div className="font-mono text-2xl font-bold text-fog-100">{VIP_COUNT}</div>
          <div className="text-[10px] text-fog-600">{vipOpen} with open items</div>
        </div>
        <div className="rounded-xl border border-line bg-ink-900/50 p-3">
          <div className="text-[11px] uppercase tracking-wide text-fog-500">Available staff</div>
          <div className="font-mono text-2xl font-bold text-fog-100">{avail}<span className="text-base text-fog-600">/{STAFFING.headcount}</span></div>
          <div className="text-[10px] text-fog-600">{STAFFING.absent} absent · {STAFFING.training} training</div>
        </div>
      </div>

      {/* KPI grid (our brand terms) */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">
          Live signals <span className="font-normal normal-case text-fog-600">— move causally with your calls</span>
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi label="SLA Attainment" sub="Service Promise kept" value={kpis.slaAttainment} base={BASELINE.slaAttainment} suffix="%" />
          <Kpi label="Experience Signal" sub="CSAT" value={kpis.experience} base={BASELINE.experience} suffix="%" />
          <Kpi label="Queue Depth" sub="Operations Queue" value={kpis.queueDepth} base={BASELINE.queueDepth} goodHigh={false} />
          <Kpi label="ASA" sub="speed of answer" value={Math.round(kpis.asaSeconds / 6) / 10} base={Math.round(BASELINE.asaSeconds / 6) / 10} suffix="m" goodHigh={false} />
          <Kpi label="FCR" sub="first-contact resolution" value={kpis.fcr} base={BASELINE.fcr} suffix="%" />
          <Kpi label="AHT" sub="avg handle time" value={kpis.ahtMin} base={BASELINE.ahtMin} suffix="m" goodHigh={false} />
          <Kpi label="Abandonment" sub="left before served" value={kpis.abandonment} base={BASELINE.abandonment} suffix="%" goodHigh={false} />
          <Kpi label="Occupancy" sub="active vs paid time" value={kpis.occupancy} base={BASELINE.occupancy} suffix="%" goodHigh={false} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Today's operational risks */}
        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">Today’s operational risks</h3>
          <ul className="space-y-2">
            {RISKS.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-fog-300">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[r.tone]}`} />
                {r.text}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onGoto('crisis')}
            className="mt-4 w-full rounded-lg bg-rose px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90"
          >
            {crisisActive ? 'Resume the live crisis →' : 'Enter the Crisis Room →'}
          </button>
        </div>

        {/* Queue + team preview */}
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-ink-900/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-500">Top of queue</h3>
              <button onClick={() => onGoto('queue')} className="text-[11px] text-sky hover:underline">Open queue →</button>
            </div>
            <ul className="space-y-1.5">
              {queued.slice(0, 3).map((w) => (
                <li key={w.id} className="flex items-center gap-2 text-[13px]">
                  <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${w.priority === 'P1' ? 'bg-rose/15 text-rose' : w.priority === 'P2' ? 'bg-amber/15 text-amber' : 'bg-ink-700 text-fog-400'}`}>{w.priority}</span>
                  <span className={`truncate ${w.tier === 'VIP' ? 'font-semibold text-fog-100' : 'text-fog-300'}`}>{w.clientLabel}</span>
                  <span className="ml-auto font-mono text-[11px] text-fog-500">{w.deadlineMin}m</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-ink-900/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-500">Team snapshot</h3>
              <button onClick={() => onGoto('team')} className="text-[11px] text-sky hover:underline">Open board →</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TEAM.map((m) => (
                <span
                  key={m.id}
                  title={`${m.name} · ${m.status}`}
                  className={`h-2.5 w-2.5 rounded-full ${m.status === 'available' ? 'bg-mint' : m.status === 'busy' ? 'bg-amber' : m.status === 'training' ? 'bg-iris' : 'bg-rose'}`}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-3 text-[10px] text-fog-600">
              <span><span className="text-mint">●</span> available</span>
              <span><span className="text-amber">●</span> busy</span>
              <span><span className="text-iris">●</span> training</span>
              <span><span className="text-rose">●</span> absent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
