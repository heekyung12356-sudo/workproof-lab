import { TEAM, STAFFING, availableHeadcount, type TeamMember } from '../../data/team';

const STATUS: Record<string, string> = {
  available: 'text-mint border-mint/40 bg-mint/10',
  busy: 'text-amber border-amber/40 bg-amber/10',
  training: 'text-iris border-iris/40 bg-iris/10',
  absent: 'text-rose border-rose/40 bg-rose/10',
  leave: 'text-rose border-rose/40 bg-rose/10',
};
const BURN: Record<string, string> = { low: 'bg-mint', med: 'bg-amber', high: 'bg-rose' };

function LoadBar({ load, capacity }: { load: number; capacity: number }) {
  const pct = Math.min(100, Math.round((load / capacity) * 100));
  const over = load > capacity;
  return (
    <div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
        <div className={`h-full rounded-full ${over ? 'bg-rose' : pct > 80 ? 'bg-amber' : 'bg-mint'}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-0.5 text-[10px] text-fog-600">{load}/{capacity}{over ? ' · over' : ''}</div>
    </div>
  );
}

function Card({ m }: { m: TeamMember }) {
  return (
    <div className="rounded-xl border border-line bg-ink-900/50 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-fog-100">{m.name}</span>
            {m.vipCapable && <span className="rounded bg-sky/15 px-1 text-[9px] font-bold text-sky">VIP</span>}
            {m.isNew && <span className="rounded bg-iris/15 px-1 text-[9px] font-bold text-iris">NEW</span>}
          </div>
          <div className="text-[11px] text-fog-500">{m.role} · {m.tenureMonths}mo · {m.timezone}</div>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS[m.status]}`}>{m.status}</span>
      </div>

      <div className="mt-2"><LoadBar load={m.load} capacity={m.capacity} /></div>

      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
        <div className="text-fog-500">Quality <span className="font-mono font-semibold text-fog-200">{m.quality}%</span></div>
        <div className="text-fog-500">AHT <span className="font-mono font-semibold text-fog-200">{m.ahtMin}m</span></div>
        <div className="flex items-center gap-1 text-fog-500">
          Burnout <span className={`h-2 w-2 rounded-full ${BURN[m.burnout]}`} /> <span className="text-fog-400">{m.burnout}</span>
        </div>
        <div className="text-fog-500">Skills <span className="font-mono text-fog-400">b{m.skills.billing}/t{m.skills.technical}/d{m.skills.deescalation}</span></div>
      </div>

      <div className="mt-2 text-[11px] text-fog-400">★ {m.strength}</div>
      {m.riskFlag && <div className="mt-0.5 text-[11px] text-rose">⚠ {m.riskFlag}</div>}
    </div>
  );
}

export default function TeamBoard() {
  const avail = availableHeadcount();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-ink-900/40 px-4 py-3 text-[12px] text-fog-400">
        <span className="font-semibold text-fog-200">{avail}/{STAFFING.headcount} available</span>
        <span>· {STAFFING.absent} absent</span>
        <span>· {STAFFING.training} training</span>
        <span>· {STAFFING.busy} busy</span>
        <span className="ml-auto text-fog-600">Available = headcount − (absent + leave + training)</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((m) => <Card key={m.id} m={m} />)}
      </div>
    </div>
  );
}
