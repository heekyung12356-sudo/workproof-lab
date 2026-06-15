import { useEffect, useState } from 'react';

function fmt(s: number) {
  s = Math.max(0, s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function SlaClock({ label, startMin, countUp = false }: { label: string; startMin: number; countUp?: boolean }) {
  const [s, setS] = useState(startMin * 60);
  useEffect(() => {
    const id = setInterval(() => setS((v) => (countUp ? v + 1 : Math.max(0, v - 1))), 1000);
    return () => clearInterval(id);
  }, [countUp]);
  const min = s / 60;
  const tone = countUp ? 'text-sky border-sky/40' : min <= 15 ? 'text-rose border-rose/50' : min <= 45 ? 'text-amber border-amber/50' : 'text-mint border-mint/50';
  return (
    <div className={`rounded-lg border ${tone} bg-ink-900/60 px-3 py-2`}>
      <div className="text-[10px] uppercase tracking-wide text-fog-500">{label}</div>
      <div className="font-mono text-xl font-bold tabular-nums">{fmt(s)}</div>
    </div>
  );
}
