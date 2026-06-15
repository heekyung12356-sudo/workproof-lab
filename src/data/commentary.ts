/* ===========================================================================
   Architect's Commentary content — 지시서 §10b (핵심 신뢰 산출물)
   각 의사결정 분기에서 "어떻게/왜" 판단했고 "무엇을 포기했는지"를 투명 공개.
   점수 배지가 아니라 사고 과정이 주인공. STAR 매핑은 §19.
   =========================================================================== */

export interface CommentaryBlock {
  step: number;
  title: string;
  /** 내가 내린 판단 (시나리오 candidatePick과 일치) */
  call: string;
  /** 근거: 어떤 KPI/SLA/리스크를 우선했는가 */
  why: string;
  /** 무엇을 포기했는가 (가장 중요) */
  tradeoff: string;
  /** 검토 후 버린 대안 */
  rejected: { option: string; reason: string }[];
  /** 실제 조직에서는 어떻게 굴러가는가 */
  realOps: string;
  /** 면접 STAR 한 줄 (§19) */
  star: string;
}

export const COMMENTARY: CommentaryBlock[] = [
  {
    step: 1,
    title: 'Staffing reallocation',
    call:
      'Move Marco (strongest technical) off the VIP-B P2 onto VIP-A’s P1 outage, recall Yuki from training to backfill the queue, and keep Sam on VIP-B recovery with me supervising.',
    why:
      'Two simultaneous P1s justify breaking my own rule about protecting training time. The VIP-A outage is a production-down P1 with a hard 2h resolution SLA — that needs my best technical skill (Marco, technical 5), not my best billing person. Recalling Yuki is defensible precisely because shrinkage rules bend for genuine P1 emergencies, and the queue would otherwise abandon Standard customers entirely. Keeping Sam on the case he broke — supervised — turns a mistake into a coached recovery instead of a hand-off that erodes his confidence.',
    tradeoff:
      'I paused Marco’s VIP-B P2, which will age toward its own SLA, and I spent training capital by pulling Yuki out early. I accepted a slower P2 and a one-off training interruption in exchange for protecting the two P1 clocks. If the P2 breaches later, that’s a cost I chose knowingly — and I’d flag it in the report rather than let it surface as a surprise.',
    rejected: [
      {
        option: 'Put Priya (billing specialist) on the outage to avoid context-switching Marco.',
        reason:
          'Priya is billing-strongest (5) but only technical 4; an outage rewards depth. Avoiding a context switch isn’t worth a weaker fit on the highest-stakes clock.',
      },
      {
        option: 'Leave the junior (Sam) solo on the data-loss P1 to fix his own mistake.',
        reason:
          'A 3-month hire alone on a regulated-data recovery is how a mistake becomes a second incident. Supervision is non-negotiable here.',
      },
      {
        option: 'All hands on VIP-A because it’s the biggest account.',
        reason:
          'Revenue-weighting ignores that VIP-B is a compliance event. You can’t let a data-loss P1 sit in queue to chase the larger logo.',
      },
    ],
    realOps:
      'On a real remote team this is a 90-second WFM call: check the realtime board, confirm available = headcount − (absent + training), and match skill to severity. The recall-from-training decision would be logged so the WFM/ops manager can see why adherence dipped.',
    star:
      'S/T: Two P1s, two no-shows, one agent in training. A: Matched my deepest technical skill to the production outage and recalled training only because both fires were P1, supervising the junior on his own incident. R: Both P1 clocks owned by the right people; I accepted a slower P2 and documented the trade.',
  },
  {
    step: 2,
    title: 'Escalation',
    call:
      'Escalate the VIP-B data-loss event to the Ops Manager immediately as a mandatory report, keep the VIP-A outage at Team-Lead level where it belongs, and flag VIP-B as a compliance item in the upcoming 30-minute report.',
    why:
      'The escalation matrix is explicit: data loss / compliance breach routes to the Ops Manager with a mandatory report. That’s not a judgment call — it’s a defined trigger, and the value of a leader here is recognizing it instantly. The VIP-A outage, by contrast, is a VIP P1 nearing its clock, which the matrix assigns to the Team Lead — me. Escalating it upward would be noise.',
    tradeoff:
      'I accepted looking less self-sufficient by raising a hand early on VIP-B, before I had a tidy root-cause. I traded the comfort of "I’ve got it handled" for speed of notification on a compliance event — because the cost of a late compliance disclosure dwarfs the cost of an early, slightly-incomplete one.',
    rejected: [
      {
        option: 'Handle VIP-B quietly to avoid alarming leadership.',
        reason:
          'Concealing a data-loss/compliance event is the single most expensive mistake available here. It converts a recoverable incident into a trust and possibly legal problem.',
      },
      {
        option: 'Escalate everything straight to the Director to be safe.',
        reason:
          'The Director isn’t the first stop for either event. Over-escalation burns senior attention and signals you don’t know the matrix.',
      },
      {
        option: 'Wait until I have full facts, then include it in the 30-minute report.',
        reason:
          'A mandatory-report trigger shouldn’t wait for completeness. Notify now, refine facts in parallel.',
      },
    ],
    realOps:
      'In a mature org this is a paged Sev/incident channel: the data-loss tag auto-routes to the ops manager and a compliance/security stakeholder, and the timestamp of notification itself becomes part of the audit trail.',
    star:
      'S/T: A junior deleted a regulated-data config — a defined compliance trigger. A: Notified the Ops Manager immediately per the matrix while keeping the outage at my level. R: Compliance exposure surfaced in minutes with a clean notification timestamp, not buried in a later summary.',
  },
  {
    step: 3,
    title: 'Customer communication',
    call:
      'Proactively notify both VIPs. VIP-B gets an honest note — "we identified an internal error, recovery is underway, here’s the ETA and the named owner." VIP-A gets a status plus a realistic ETA inside the SLA window.',
    why:
      'Trust during a renewal-sensitive period is built by being the first to tell the customer bad news, with an owner and an ETA attached. VIP-A is six weeks from a renewal review; VIP-B handles regulated data. For both, a proactive, specific, ownership-taking message protects the relationship far more than a perfect-but-late fix.',
    tradeoff:
      'I gave up optionality. By committing to an ETA and admitting an internal error in writing, I removed my own wiggle room and created a promise I now have to keep. I accepted that exposure deliberately — vague reassurance protects me, but specific honesty protects the customer relationship, and the relationship is the asset.',
    rejected: [
      {
        option: 'Delay telling VIP-B until the data is fully recovered so it comes with good news.',
        reason:
          'If the customer notices the deletion first, the delay reads as concealment — strictly worse than an early honest note.',
      },
      {
        option: 'Send a generic high-volume holding message to both.',
        reason:
          'A templated note to a VIP P1 signals you don’t grasp the severity. No owner, no ETA, no ownership.',
      },
      {
        option: 'Stay silent until both are resolved to avoid over-promising.',
        reason:
          'Silence on two live VIP P1s is the fastest path to a lost renewal.',
      },
    ],
    realOps:
      'Real teams keep pre-approved comms templates with blanks for owner + ETA so a lead can send an honest, on-brand update in under two minutes without waiting on marketing or legal for routine incidents.',
    star:
      'S/T: Two VIPs about to be impacted, one renewal-sensitive, one compliance-sensitive. A: Sent proactive, owner-named, ETA-bearing updates before they chased me. R: Customers heard the truth from me first; I traded my own optionality for their trust.',
  },
  {
    step: 4,
    title: 'Recovery & prevention',
    call:
      'Restore VIP-B from the last backup and verify integrity, offer VIP-A an SLA credit per policy if it breached, add a confirm-before-delete guardrail on production records, and give Sam a 1:1 coaching note — not blame.',
    why:
      'A real recovery closes three loops: the data (restore + integrity check), the SLA (credit per policy, not improvised goodwill), and recurrence (a system guardrail so the same gap can’t fire tomorrow). The coaching framing matters: the root cause is a missing guardrail, not a bad person — punishing a 3-month hire destroys the psychological safety that keeps people reporting their own mistakes.',
    tradeoff:
      'The integrity check costs time I’m tempted to skip while the clock runs, and the guardrail adds friction to a workflow the team uses every day. I accepted slower recovery and a slightly heavier delete flow in exchange for not shipping corrupted data and not repeating the incident. I chose the durable fix over the fast one.',
    rejected: [
      {
        option: 'Restore and move on; revisit prevention later.',
        reason: '"Later" prevention rarely happens, and the same gap re-fires. The cheapest time to fix it is now.',
      },
      {
        option: 'Formally discipline Sam to signal seriousness.',
        reason:
          'Blame-first kills the reporting culture you depend on. The fix is a guardrail, not a punished junior.',
      },
      {
        option: 'Offer a large goodwill refund and skip the integrity check to save time.',
        reason:
          'Skipping verification can ship corrupted data; over-compensating without a fix sets a precedent and hides the real problem.',
      },
    ],
    realOps:
      'This becomes a lightweight post-incident review: a restore runbook with a mandatory integrity step, a one-line product/eng ticket for the confirm-before-delete guardrail, and a coaching note in the agent’s 1:1 doc — blameless by default.',
    star:
      'S/T: Deleted regulated data, a possible SLA breach, and a recurrence risk. A: Restored with integrity verification, applied SLA credit per policy, shipped a guardrail, and coached the junior. R: All three loops closed; the team got safer and the junior stayed.',
  },
  {
    step: 5,
    title: 'Executive situation report',
    call:
      'A tight executive update: the two incidents and their status, who owns each, customer impact, the escalation already made, and next steps with timing — clarity over length.',
    why:
      'An ops manager reading this in 30 seconds needs to know: what’s on fire, who’s on it, what the customer feels, what I’ve already escalated, and what happens next and when. A good report removes the need for follow-up questions. It also demonstrates that I escalated the compliance event before being asked — which is the detail leadership actually cares about.',
    tradeoff:
      'I kept it short and resisted the urge to over-explain my reasoning. I traded thoroughness for scanability, accepting that some context lives in the incident channel rather than the summary — because a report no one finishes reading isn’t a report.',
    rejected: [
      {
        option: 'A long narrative covering every detail.',
        reason: 'Executives skim. Length buries the three facts they need and signals poor prioritization.',
      },
      {
        option: 'Wait until both incidents resolve to send one clean report.',
        reason: 'The deadline was 30 minutes precisely because leadership needs the picture during the crisis, not after.',
      },
    ],
    realOps:
      'Most teams have a one-screen incident-update format (Incident / Impact / Owner / ETA / Escalation / Next update at <time>). Filling that in fast is a core team-lead skill, and the "next update at" line sets expectations so leadership stops asking.',
    star:
      'S/T: 30-minute deadline for an executive update mid-crisis. A: Sent a one-screen report — incidents, owners, impact, escalation, next steps + timing. R: Leadership had the full picture fast, with no follow-up questions and a clear next-update time.',
  },
];

export const COMMENTARY_CLOSING = {
  heading: 'How I designed this — and why it’s evidence, not a self-grade',
  body:
    'I’m not showing you a score I gave myself. I’m showing you the reasoning behind each call and, more importantly, what I chose to give up to make it. Operations leadership is the discipline of trading one cost for a smaller one under a clock — so the trade-offs are the evidence. If you want to see how I turned this judgment into a system (data model, scenario state machine, deterministic rubric, AI-with-fallback), the case study walks through every design decision.',
};
