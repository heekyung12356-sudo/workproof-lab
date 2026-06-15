import type { Scenario } from './types';

export const SCENARIO_C: Scenario = {
  id: 'system-outage',
  code: 'C',
  name: 'System Outage + Manual Workaround',
  tagline: 'The console is lagging, case history is stale, and the SLA board may be lying to you.',
  clock: 'Mon 14:05 KST',
  cardSummary: 'The ticketing system is delayed. Agents can’t see updated case history, customers send duplicate follow-ups, and the SLA dashboard may be inaccurate. Run a manual mode, communicate, reconcile, review.',
  glyph: '⚡',
  briefing: `14:05. The ticketing system is degraded.

• Agents can’t see updated case history — they may answer with stale info.
• Customers are sending duplicate follow-ups; the queue count is inflated.
• The SLA dashboard may be inaccurate — you can’t trust the numbers on screen.

Nothing is "down" hard, but working normally now risks wrong answers and double-handling. You’re the Team Lead.`,
  liveClocks: [{ label: 'Degraded-mode elapsed', startMin: 60 }],
  steps: [
    {
      id: 'mode', index: 1, kind: 'choice', title: 'Interim operating mode',
      scoresDimensions: ['risk', 'prioritization', 'calmness'],
      situation: 'Do you keep working at full speed, slow down, or switch modes? The core risk is agents replying with stale case history.',
      ruleAssist: 'Rule Assist: case-history freshness cannot be guaranteed; SLA timers may be unreliable during degradation.',
      memoPrompt: 'What’s the interim mode, and which risk are you prioritizing down?',
      options: [
        { id: 'a', candidatePick: true, label: 'Switch to a controlled manual mode: pause non-urgent replies, handle only verified-context cases, log actions in a shared sheet, and triage by real priority instead of the (untrusted) SLA board.', blurb: 'Slow to stay correct; log manually; triage by true priority, not the broken board.', scores: { risk: 92, prioritization: 88, calmness: 90 }, consequence: 'Prevents wrong answers and double-handling; you keep an audit trail for reconciliation later.' },
        { id: 'b', label: 'Keep working at full speed to protect SLA numbers.', blurb: 'Don’t let the queue grow.', scores: { risk: 35, prioritization: 45, calmness: 50 }, consequence: 'Optimizes a dashboard you can’t trust while shipping stale, possibly wrong answers.' },
        { id: 'c', label: 'Stop all work until IT restores the system.', blurb: 'Down tools entirely.', scores: { risk: 55, prioritization: 48, calmness: 55 }, consequence: 'Over-corrects; urgent/VIP cases still need handling under a careful manual process.' },
        { id: 'd', label: 'Let each agent decide how to proceed individually.', blurb: 'Delegate to each person’s judgment.', scores: { risk: 40, prioritization: 42, calmness: 45 }, consequence: 'Inconsistent handling during an incident creates exactly the chaos you must contain.' },
      ],
    },
    {
      id: 'notice', index: 2, kind: 'choice', title: 'Customer & team notice',
      scoresDimensions: ['communication', 'risk'],
      situation: 'Customers are double-messaging and may get inconsistent answers. What do you communicate, to whom?',
      ruleAssist: 'Rule Assist: duplicate follow-ups detected; a proactive notice reduces inbound volume.',
      memoPrompt: 'What do you tell customers and the team, and why now?',
      options: [
        { id: 'a', candidatePick: true, label: 'Post a brief proactive notice (we’re experiencing a temporary system delay; we’re on it; no need to resend) and brief the team on the manual process + which cases to prioritize.', blurb: 'Calm proactive notice to customers + clear internal brief.', scores: { communication: 92, risk: 80 }, consequence: 'Cuts duplicate inbound and aligns the team so answers stay consistent.' },
        { id: 'b', label: 'Say nothing externally to avoid alarming customers.', blurb: 'Keep it internal.', scores: { communication: 45, risk: 50 }, consequence: 'Silence drives more duplicate follow-ups and inconsistent replies.' },
        { id: 'c', label: 'Tell customers the system is "down" and you can’t help right now.', blurb: 'Blunt outage message.', scores: { communication: 40, risk: 42 }, consequence: 'Overstates the failure and abandons urgent cases that can still be worked manually.' },
        { id: 'd', label: 'Only brief the team; skip the customer notice.', blurb: 'Internal alignment only.', scores: { communication: 55, risk: 58 }, consequence: 'Better than nothing, but misses the proactive notice that reduces the duplicate flood.' },
      ],
    },
    {
      id: 'routing', index: 3, kind: 'routing', title: 'Reporting chain',
      scoresDimensions: ['reporting', 'escalation'],
      situation: 'A tooling degradation affecting SLA integrity and customer experience — who owns this and who needs to know?',
      ruleAssist: 'Rule Assist: system/tooling failures route to IT; SLA-integrity impact is an Ops Manager concern.',
      memoPrompt: 'Why these roles?',
      routingPrompt: 'Select every role you’d involve (choose all that apply):',
      routingCorrect: ['it', 'opsmgr'],
    },
    {
      id: 'reconcile', index: 4, kind: 'choice', title: 'Post-recovery reconciliation',
      scoresDimensions: ['recovery', 'documentation'],
      situation: 'The system is back. The manual log and the system are out of sync, and some SLA timestamps are suspect. What now?',
      ruleAssist: 'Rule Assist: manual-mode actions must be reconciled into the system; SLA exceptions need flagging.',
      memoPrompt: 'What’s your reconciliation + reporting plan?',
      options: [
        { id: 'a', candidatePick: true, label: 'Reconcile the manual log into the system, flag SLA exceptions caused by the outage (so they’re not counted as team misses), de-duplicate the doubled cases, and write a short post-incident review.', blurb: 'Sync the record, protect the team’s SLA from the outage, dedupe, and review.', scores: { recovery: 92, documentation: 88 }, consequence: 'Restores data integrity and fairly attributes the SLA impact to the incident, not the agents.' },
        { id: 'b', label: 'Resume normal operations; the gaps will sort themselves out.', blurb: 'Move on once it’s back.', scores: { recovery: 45, documentation: 48 }, consequence: 'Leaves a corrupted record and unfairly counts outage-caused breaches against the team.' },
        { id: 'c', label: 'Reconcile data but skip the post-incident review.', blurb: 'Fix data, skip the write-up.', scores: { recovery: 62, documentation: 55 }, consequence: 'Better, but without a review the same fragility recurs next outage.' },
        { id: 'd', label: 'Ask agents to redo today’s cases from scratch to be safe.', blurb: 'Full redo for certainty.', scores: { recovery: 40, documentation: 45 }, consequence: 'Wastes capacity and re-contacts customers unnecessarily; targeted reconciliation is enough.' },
      ],
    },
    {
      id: 'report', index: 5, kind: 'report', title: 'Post-incident review',
      scoresDimensions: ['documentation', 'recovery'],
      situation: 'Write a short post-incident review. Strong reviews capture: impact, the interim mode you ran, customer communication, reconciliation done, SLA exceptions flagged, and a prevention/next-step.',
      reportPrompt: 'Write the post-incident review:',
      reportRubricHints: ['outage', 'manual', 'sla', 'customer', 'reconcil', 'duplicate', 'prevent', 'next', 'impact'],
    },
  ],
};
