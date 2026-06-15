import type { DecisionStep } from '../../data/scenarios/scenario01';

interface Props {
  step: DecisionStep;
  totalSteps: number;
  selection?: string;
  memo: string;
  reportText: string;
  onSelect: (optionId: string) => void;
  onMemo: (text: string) => void;
  onReport: (text: string) => void;
  onCommit: () => void;
  committed: boolean;
  /** 이미 확정된 이전 단계들의 요약 (수정 불가) */
  locked: { title: string; choiceLabel: string }[];
}

export default function DecisionWorkspace({
  step,
  totalSteps,
  selection,
  memo,
  reportText,
  onSelect,
  onMemo,
  onReport,
  onCommit,
  committed,
  locked,
}: Props) {
  const canCommit =
    step.kind === 'choice' ? Boolean(selection) : reportText.trim().length > 0;

  return (
    <section aria-label="Decision Workspace" className="space-y-4">
      {/* progress */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < step.index - 1 ? 'bg-mint' : i === step.index - 1 ? 'bg-sky' : 'bg-ink-700'
            }`}
          />
        ))}
      </div>

      {/* locked previous decisions */}
      {locked.length > 0 && (
        <details className="rounded-lg border border-line bg-ink-900/40 px-3 py-2 text-sm">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-fog-500">
            Locked decisions ({locked.length}) — cannot be changed
          </summary>
          <ul className="mt-2 space-y-1.5">
            {locked.map((l, i) => (
              <li key={i} className="text-[13px] text-fog-400">
                <span className="font-semibold text-fog-300">{l.title}:</span> {l.choiceLabel}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="rounded-xl border border-line bg-ink-850/70 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-sky/15 px-2 py-0.5 font-mono text-[11px] font-bold text-sky">
            STEP {step.index}/{totalSteps}
          </span>
          <h2 className="text-base font-semibold text-fog-100">{step.title}</h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-fog-300">{step.situation}</p>

        {step.kind === 'choice' ? (
          <fieldset className="space-y-2" disabled={committed}>
            <legend className="sr-only">Choose your call for {step.title}</legend>
            {step.options!.map((opt) => {
              const active = selection === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`block cursor-pointer rounded-lg border p-3 transition-colors ${
                    active
                      ? 'border-sky bg-sky/10'
                      : 'border-line bg-ink-900/40 hover:border-fog-600'
                  } ${committed ? 'cursor-default opacity-90' : ''}`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name={step.id}
                      value={opt.id}
                      checked={active}
                      onChange={() => onSelect(opt.id)}
                      className="mt-1 accent-sky"
                    />
                    <div>
                      <div className="text-[13px] font-medium text-fog-100">{opt.label}</div>
                      <div className="mt-0.5 text-[12px] text-fog-500">{opt.blurb}</div>
                    </div>
                  </div>
                </label>
              );
            })}
            <div className="pt-1">
              <label htmlFor={`memo-${step.id}`} className="mb-1 block text-[11px] uppercase tracking-wide text-fog-500">
                Your reasoning (optional — recorded with your decision)
              </label>
              <textarea
                id={`memo-${step.id}`}
                value={memo}
                onChange={(e) => onMemo(e.target.value)}
                disabled={committed}
                rows={2}
                placeholder="Why this call? What did you weigh?"
                className="w-full resize-y rounded-lg border border-line bg-ink-900/60 p-2 text-sm text-fog-200 placeholder:text-fog-600 disabled:opacity-70"
              />
            </div>
          </fieldset>
        ) : (
          <div>
            <label htmlFor="report" className="mb-1 block text-[11px] uppercase tracking-wide text-fog-500">
              {step.reportPrompt}
            </label>
            <textarea
              id="report"
              value={reportText}
              onChange={(e) => onReport(e.target.value)}
              disabled={committed}
              rows={6}
              placeholder="Incidents, current status, owners, customer impact, escalations made, next steps + timing…"
              className="w-full resize-y rounded-lg border border-line bg-ink-900/60 p-2 text-sm text-fog-200 placeholder:text-fog-600 disabled:opacity-70"
            />
            <p className="mt-1 text-[11px] text-fog-600">
              Scored on clarity + coverage (incidents, SLA, owners, escalations, next steps). Not sent anywhere — evaluated locally.
            </p>
          </div>
        )}

        {!committed && (
          <button
            onClick={onCommit}
            disabled={!canCommit}
            className="mt-4 w-full rounded-lg bg-sky px-4 py-2.5 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step.index < totalSteps ? 'Lock in this call →' : 'Submit & see the result →'}
          </button>
        )}
      </div>
    </section>
  );
}
