/* ===========================================================================
   Architect's Commentary — the core trust artifact (핵심 신뢰 산출물).
   Flagship crisis A (Absence + VIP SLA Surge). 각 분기에서 "어떻게/왜" 판단했고
   "무엇을 포기했는지"를 투명 공개. 점수 배지가 아니라 사고 과정이 주인공.
   =========================================================================== */

export interface CommentaryBlock {
  step: number;
  title: string;
  call: string;
  why: string;
  tradeoff: string;
  rejected: { option: string; reason: string }[];
  realOps: string;
  star: string;
}

export const COMMENTARY: CommentaryBlock[] = [
  {
    step: 1,
    title: 'Staffing reallocation',
    call:
      'Put Daniel (deepest available technical) on VIP-A’s outage, keep Jae on VIP-B recovery with me supervising, pull Marco off his P2 to assist Jae, and recall Yuki from training to backfill the queue.',
    why:
      'Two simultaneous P1s justify breaking my own rule about protecting training time. The VIP-A outage is production-down with a hard 2h SLA — that needs depth (Daniel, technical 5), not my best billing person. I deliberately do NOT throw Mina at it: she’s already over capacity with a burnout flag, and spending her here creates tomorrow’s problem. Keeping Jae on the case he broke — supervised — turns a mistake into a coached recovery instead of a hand-off that erodes his confidence.',
    tradeoff:
      'I paused Marco’s VIP-B P2, which will age toward its own SLA, and I spent training capital by recalling Yuki. I accepted a slower P2 and a one-off training interruption to protect the two P1 clocks. If the P2 breaches later, that’s a cost I chose knowingly — and I flag it in the report rather than let it surface as a surprise.',
    rejected: [
      { option: 'Put Mina on the outage because she’s the best.', reason: 'She’s at 105% capacity with a burnout flag; loading her protects today and breaks next week.' },
      { option: 'Leave Jae (3-month hire) solo on the data-loss P1.', reason: 'A junior alone on a regulated-data recovery is how one mistake becomes two.' },
      { option: 'All seniors on VIP-A because it’s the biggest account.', reason: 'Revenue-weighting ignores that VIP-B is a compliance event that can’t wait in queue.' },
    ],
    realOps:
      'On a real remote team this is a 90-second WFM call: check the live board, confirm available = headcount − (absent + leave + training), match skill to severity, and protect anyone already over capacity. The training recall gets logged so WFM sees why adherence dipped.',
    star:
      'S/T: Two P1s, two no-shows, one agent in training, a top performer near burnout. A: Matched my deepest technical to the outage, supervised the junior on his own incident, and protected the burnout-risk senior. R: Both clocks owned by the right people; I accepted a slower P2 and documented the trade.',
  },
  {
    step: 2,
    title: 'Escalation',
    call:
      'Escalate the VIP-B data-loss event to the Ops Manager immediately as a mandatory report, keep the VIP-A outage at Team-Lead level where it belongs, and flag VIP-B as a compliance item in the 10:00 update.',
    why:
      'The escalation matrix is explicit: data loss / compliance breach → Ops Manager with a mandatory report. That’s not a judgment call — it’s a defined trigger, and the value of a leader here is recognizing it instantly. The VIP-A outage is a VIP P1 the matrix assigns to the Team Lead — me. Escalating it upward would just be noise.',
    tradeoff:
      'I accepted looking less self-sufficient by raising a hand early on VIP-B, before I had a tidy root cause. I traded the comfort of "I’ve got it handled" for speed of notification — because a late compliance disclosure costs far more than an early, slightly-incomplete one.',
    rejected: [
      { option: 'Handle VIP-B quietly to avoid alarming leadership.', reason: 'Concealing a data-loss/compliance event is the single most expensive mistake available.' },
      { option: 'Escalate everything straight to the Director.', reason: 'The Director isn’t the first stop for either; over-escalation burns senior attention.' },
      { option: 'Wait for full facts, then include it later.', reason: 'A mandatory-report trigger shouldn’t wait for completeness — notify now, refine in parallel.' },
    ],
    realOps:
      'In a mature org the data-loss tag auto-routes to the ops manager and a compliance stakeholder, and the timestamp of notification itself becomes part of the audit trail.',
    star:
      'S/T: A junior deleted a regulated-data config — a defined compliance trigger. A: Notified the Ops Manager immediately per the matrix while keeping the outage at my level. R: Compliance exposure surfaced in minutes with a clean notification timestamp.',
  },
  {
    step: 3,
    title: 'Reporting chain',
    call:
      'Loop in the Ops Manager (mandatory compliance report), Workforce Management (we’re below minimum staffing from the two no-shows), and the Client Success Manager (both VIPs are renewal-sensitive).',
    why:
      'Each role maps to a real, distinct exposure: WFM owns coverage and shrinkage, CSM owns the customer relationship and renewal risk, and the Ops Manager owns the compliance event. Routing precisely — not to everyone, not to no one — is what keeps an incident contained and the right people informed without flooding leadership.',
    tradeoff:
      'I chose breadth of notification over keeping it tight. Pulling in three roles risks looking like I can’t contain it myself; I accepted that because each of them owns a lever I don’t, and silence on any one of them is a gap I’d have to explain later.',
    rejected: [
      { option: 'Only tell the Ops Manager.', reason: 'Misses WFM (staffing) and CSM (renewal) — both are live exposures right now.' },
      { option: 'Tell everyone including HR, QA, IT.', reason: 'No HR/QA/IT trigger is active; over-routing trains people to ignore your alerts.' },
    ],
    realOps:
      'Most teams have a routing matrix exactly like this; the skill is matching the issue to the role’s scope rather than mass-CC’ing leadership.',
    star:
      'S/T: A compliance event plus understaffing plus renewal-sensitive VIPs. A: Routed Ops Manager + WFM + CSM, each to the lever they own. R: The right people had what they needed without noise.',
  },
  {
    step: 4,
    title: 'Customer communication',
    call:
      'Proactively notify both VIPs. VIP-B gets an honest note — "we identified an internal error, recovery is underway, here’s the ETA and the named owner." VIP-A gets a status plus a realistic ETA inside the SLA window.',
    why:
      'Trust during a renewal-sensitive period is built by being the first to tell the customer bad news, with an owner and an ETA attached. A proactive, specific, ownership-taking message protects the relationship far more than a perfect-but-late fix.',
    tradeoff:
      'I gave up optionality. By committing to an ETA and admitting an internal error in writing, I removed my own wiggle room and created a promise I now have to keep. I accepted that exposure deliberately — vague reassurance protects me, but specific honesty protects the relationship, and the relationship is the asset.',
    rejected: [
      { option: 'Delay telling VIP-B until the data is fully recovered.', reason: 'If they notice first, the delay reads as concealment — strictly worse.' },
      { option: 'Send a generic high-volume holding message.', reason: 'A templated note to a VIP P1 signals you don’t grasp the severity.' },
      { option: 'Stay silent until both are resolved.', reason: 'Silence on two live VIP P1s is the fastest path to a lost renewal.' },
    ],
    realOps:
      'Real teams keep pre-approved comms templates with blanks for owner + ETA so a lead can send an honest, on-brand update in under two minutes.',
    star:
      'S/T: Two VIPs about to be impacted, one renewal-sensitive, one compliance-sensitive. A: Sent proactive, owner-named, ETA-bearing updates before they chased me. R: Customers heard the truth from me first; I traded my optionality for their trust.',
  },
  {
    step: 5,
    title: 'Situation report (by 10:00)',
    call:
      'A tight executive update: the two incidents and their status, who owns each, customer impact, the escalation already made, and next steps with timing — clarity over length.',
    why:
      'An ops manager reading this in 30 seconds needs five things: what’s on fire, who’s on it, what the customer feels, what I’ve already escalated, and what happens next and when. A good report removes the need for follow-up questions and shows I escalated the compliance event before being asked.',
    tradeoff:
      'I kept it short and resisted over-explaining my reasoning. I traded thoroughness for scanability — some context lives in the incident channel, not the summary — because a report no one finishes reading isn’t a report.',
    rejected: [
      { option: 'A long narrative covering every detail.', reason: 'Executives skim; length buries the three facts they need.' },
      { option: 'Wait until both incidents resolve to send one clean report.', reason: 'The deadline is mid-crisis precisely because leadership needs the picture now.' },
    ],
    realOps:
      'Most teams use a one-screen format (Incident / Impact / Owner / ETA / Escalation / Next update at <time>). The "next update at" line sets expectations so leadership stops asking.',
    star:
      'S/T: A 10:00 deadline for an executive update mid-crisis. A: Sent a one-screen report — incidents, owners, impact, escalation, next steps + timing. R: Leadership had the full picture fast, with no follow-up questions.',
  },
];

export const COMMENTARY_CLOSING = {
  heading: 'How I designed this — and why it’s evidence, not a self-grade',
  body:
    'I’m not showing you a score I gave myself. I’m showing you the reasoning behind each call and, more importantly, what I chose to give up to make it. Operations leadership is the discipline of trading one cost for a smaller one under a clock — so the trade-offs are the evidence. The same judgment pattern repeats across the other crises in the console (an agent’s error, a system outage, a leave conflict); the tools differ between companies, but these decisions don’t. If you want to see how I turned this into a system — the data model, the scenario state machine, the deterministic rubric, the reporting chain, AI-with-fallback — the case study walks through every design decision.',
};
