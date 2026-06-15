import type { Scenario } from './types';

export const SCENARIO_A: Scenario = {
  id: 'absence-sla',
  code: 'A',
  name: 'Absence + VIP SLA Surge',
  tagline: 'Two no-shows, a VIP clock, and a junior’s data mistake — all before 10:00.',
  clock: 'Mon 09:15 KST',
  cardSummary: 'Two agents called in sick, VIP P1 SLA breaching in ~2h, and a deleted record on a regulated-data client. Reallocate, escalate, communicate, recover.',
  glyph: '⚠',
  briefing: `09:15. Two T1 agents (Lena, Tomás) are no-call no-shows. Yuki is in a compliance-training block until 11:00.

• VIP-A (Northwind) — P1 production outage. VIP P1 resolution SLA is 2h; the clock shows ~2h left.
• VIP-B (Helio) — a junior (Jae) deleted a critical config record this morning. P1 with data loss on a regulated-data client.
• Your Regional Manager wants a situation update by 10:00.

You are the Team Lead on shift. Make the calls — and record why.`,
  liveClocks: [
    { label: 'VIP-A · Northwind P1 outage', startMin: 120 },
    { label: 'VIP-B · Helio P1 data loss', startMin: 95 },
  ],
  steps: [
    {
      id: 'staffing', index: 1, kind: 'choice', title: 'Staffing reallocation',
      scoresDimensions: ['staffing', 'prioritization'],
      situation: 'Available: You, Mina (Senior, VIP — but over capacity & burnout risk), Daniel (Senior, technical), Priya (Senior, billing), Aisha (de-escalation), Jae (made the VIP-B mistake), two new hires (Ravi, Sam). Marco (technical) is mid-P2 for VIP-B. Yuki is in training. How do you deploy against the two VIP P1s?',
      ruleAssist: 'Rule Assist: VIP-A P1 needs deepest technical skill. Mina is at 105% capacity (burnout flag). Yuki recall is gated to genuine P1 emergencies.',
      memoPrompt: 'Why this allocation? Which constraint drove it?',
      options: [
        { id: 'a', candidatePick: true, label: 'Daniel → VIP-A outage; keep Jae on VIP-B recovery with you supervising; pull Marco to assist Jae; recall Yuki to backfill the queue.', blurb: 'Best technical on the outage; supervise the junior on his own incident; recall training only because both are P1.', scores: { staffing: 92, prioritization: 89 }, consequence: 'Strong skill-to-severity fit; protects Mina from overload; Marco’s P2 pauses (a known, documented cost).' },
        { id: 'b', label: 'Mina → VIP-A (she’s your best); Jae solo on VIP-B; leave the queue as-is.', blurb: 'Lean on your top performer.', scores: { staffing: 55, prioritization: 58 }, consequence: 'Mina is already over capacity with a burnout flag; a 3-mo junior solo on a data-loss P1 risks a second incident.' },
        { id: 'c', label: 'Spread everyone one-per-case; you float between both P1s.', blurb: 'Maximize coverage breadth.', scores: { staffing: 40, prioritization: 38 }, consequence: 'Coverage looks full but nobody owns either P1; floating dilutes accountability under a hard clock.' },
        { id: 'd', label: 'All seniors on VIP-A (biggest account); VIP-B waits in queue.', blurb: 'Concentrate force on the largest client.', scores: { staffing: 46, prioritization: 42 }, consequence: 'Over-indexes on revenue; a data-loss P1 is a compliance trigger and cannot simply wait.' },
      ],
    },
    {
      id: 'escalation', index: 2, kind: 'choice', title: 'Escalation',
      scoresDimensions: ['escalation', 'risk'],
      situation: 'VIP-B is data loss on a regulated-data client. The matrix: data loss / compliance breach → Ops Manager with a mandatory report. VIP-A is a VIP P1 nearing its clock → Team Lead owns it.',
      ruleAssist: 'Rule Assist: Data-loss flag detected on WI-3101 → mandatory Ops Manager report trigger.',
      memoPrompt: 'What evidence/trigger supports escalating (or not)?',
      options: [
        { id: 'a', candidatePick: true, label: 'Escalate VIP-B to Ops Manager now (mandatory report); own VIP-A yourself; note VIP-B as a compliance item for the 10:00 update.', blurb: 'Route by the matrix; notify the compliance event fast.', scores: { escalation: 94, risk: 92 }, consequence: 'Exactly maps to the matrix; compliance exposure surfaced in minutes, not buried.' },
        { id: 'b', label: 'Handle VIP-B quietly; escalate VIP-A (biggest client) to Ops Manager.', blurb: 'Escalate by account size; contain the mistake.', scores: { escalation: 40, risk: 28 }, consequence: 'Inverts the matrix; hiding a data-loss/compliance event is the costliest possible miss.' },
        { id: 'c', label: 'Escalate both straight to the Director.', blurb: 'Over-escalate to be safe.', scores: { escalation: 52, risk: 55 }, consequence: 'Director isn’t the first stop for either; over-escalation burns senior attention.' },
        { id: 'd', label: 'Escalate nothing until you have full facts.', blurb: 'Wait for completeness.', scores: { escalation: 34, risk: 30 }, consequence: 'A mandatory-report event shouldn’t wait for tidy facts; notify now, refine later.' },
      ],
    },
    {
      id: 'routing', index: 3, kind: 'routing', title: 'Reporting chain',
      scoresDimensions: ['reporting', 'escalation'],
      situation: 'Beyond the immediate escalation, who else needs to be in the loop right now — given a compliance event, two absences below minimum staffing, and renewal-sensitive VIPs?',
      ruleAssist: 'Rule Assist: absences below minimum staffing usually involve WFM; renewal-sensitive VIP usually involves CSM.',
      memoPrompt: 'Why these roles, and not the others?',
      routingPrompt: 'Select every role you’d loop in now (choose all that apply):',
      routingCorrect: ['opsmgr', 'wfm', 'csm'],
    },
    {
      id: 'communication', index: 4, kind: 'choice', title: 'Customer communication',
      scoresDimensions: ['communication', 'risk'],
      situation: 'VIP-B’s IT lead will notice the deleted config soon. VIP-A’s Director is waiting on the outage. What do you tell the customers, and when?',
      ruleAssist: 'Rule Assist: Response Playbook available — "internal-error + named owner + ETA" template.',
      memoPrompt: 'What exactly would you tell each customer at this stage?',
      options: [
        { id: 'a', candidatePick: true, label: 'Proactively notify both: VIP-B gets an honest "internal error, recovery underway, here’s the ETA + named owner"; VIP-A gets a status + realistic ETA inside the SLA window.', blurb: 'Proactive, honest, owner-named — before they chase you.', scores: { communication: 93, risk: 80 }, consequence: 'Proactive honesty protects trust in a renewal window; named owner + ETA beats vague reassurance.' },
        { id: 'b', label: 'Tell VIP-A it’s on track; wait to tell VIP-B until data is fully recovered.', blurb: 'Delay bad news until you can pair it with a fix.', scores: { communication: 47, risk: 40 }, consequence: 'If VIP-B finds the deletion first, the delay reads as concealment.' },
        { id: 'c', label: 'Send both a generic "high volume, thanks for your patience" note.', blurb: 'Buy time with a holding template.', scores: { communication: 38, risk: 45 }, consequence: 'Generic templates to VIP P1s signal you don’t grasp severity.' },
        { id: 'd', label: 'Say nothing until both are resolved.', blurb: 'Avoid over-promising.', scores: { communication: 32, risk: 38 }, consequence: 'Silence on two VIP P1s is the fastest way to lose a renewal.' },
      ],
    },
    {
      id: 'report', index: 5, kind: 'report', title: 'Situation report (by 10:00)',
      scoresDimensions: ['documentation', 'reporting'],
      situation: 'Your Regional Manager asked for an update by 10:00. Write a tight executive report. Strong updates name incidents, status, owners, customer impact, escalations made, and next steps with timing.',
      memoPrompt: '',
      reportPrompt: 'Write your 10:00 situation report (a few sentences — clarity beats length):',
      reportRubricHints: ['incident', 'sla', 'vip', 'escalat', 'owner', 'next', 'eta', 'recover', 'prevent', 'customer'],
    },
  ],
};
