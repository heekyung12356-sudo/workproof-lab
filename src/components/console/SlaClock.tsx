import { useEffect, useState } from 'react';

function fmt(totalSec: number) {
  const s = Math.max(0, totalSec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h)}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function SlaClock({
  label,
  startMin,
  countUp = false,
}: {
  label: string;
  startMin: number;
  countUp?: boolean;
}) {
  const [sec, setSec] = useState(startMin * 60);
  useEffect(() => {
    const id = setInterval(
      () => setSec((s) => (countUp ? s + 1 : Math.max(0, s - 1))),
      1000
    );
    return () => clearInterval(id);
  }, [countUp]);

  const min = sec / 60;
  const tone = countUp
    ? 'text-sky border-sky/40'
    : min <= 15
      ? 'text-rose border-rose/50'
      : min <= 30
        ? 'text-amber border-amber/50'
        : 'text-mint border-mint/50';

  return (
    <div className={`rounded-lg border ${tone} bg-ink-900/60 px-3 py-2`}>
      <div className="text-[10px] uppercase tracking-wide text-fog-500">{label}</div>
      <div className="font-mono text-xl font-bold tabular-nums">{fmt(sec)}</div>
    </div>
  );
}
