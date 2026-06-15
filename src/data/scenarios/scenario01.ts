/* ===========================================================================
   Scenario 01 — Absence + VIP SLA Crisis  (지시서 §8)
   Step-based state machine. Each option carries a deterministic, defensible
   per-dimension score (0–100) so the rubric is reproducible (지시서 §9).
   모든 수치는 §8.5 도메인 스펙(SLA 티어/에스컬레이션 매트릭스)과 일관.
   =========================================================================== */
import type { Dimension } from '../scoring';

export interface DecisionOption {
  id: string;
  label: string;
  blurb: string;
  /** 이 선택이 채점하는 차원별 점수 (0–100). 비어있는 차원엔 영향 없음. */
  scores: Partial<Record<Dimension, number>>;
  /** Recruiter Result의 "vs other reasonable choice" 패널에 쓰이는 한 줄 평. */
  consequence: string;
  /** 후보자가 실제로 택한 선택지인가 (Architect's Commentary와 매핑). */
  candidatePick?: boolean;
}

export interface DecisionStep {
  id: string;
  index: number;
  /** 'choice' = 선택지, 'report' = 자유 서술(문서화 휴리스틱 채점) */
  kind: 'choice' | 'report';
  title: string;
  /** 단계 진입 시 갱신되는 상황 브리핑 */
  situation: string;
  /** 이 단계가 주로 채점하는 차원 (UI 표시용) */
  scoresDimensions: Dimension[];
  options?: DecisionOption[];
  /** report 단계용 프롬프트 + 채점에 기대하는 키워드 */
  reportPrompt?: string;
  reportRubricHints?: string[];
}

export const SCENARIO_01 = {
  id: 'opsleader-01',
  name: 'Absence + VIP SLA Crisis',
  tagline: 'Monday, 09:00 KST. Two no-shows, a VIP clock, and a junior agent’s mistake.',
  briefing: `Monday morning. Two T1 agents (Lena, Tomás) are no-call no-shows. One agent (Yuki) is in a compliance-training block until 11:00.

Live pressure:
• VIP-A (Northwind Logistics) has a P1 production outage — VIP P1 resolution SLA is 2h, and the clock shows ~2h left.
• A junior agent (Sam, 3 months) accidentally deleted a critical config record for VIP-B (Helio Health) — a P1 with data loss.
• Your Ops Manager wants a situation report within 30 minutes.

You are the Team Lead on shift. Make the calls.`,
  steps: [
    /* ----------------------------- STEP 1 ------------------------------- */
    {
      id: 'staffing',
      index: 1,
      kind: 'choice',
      title: 'Staffing reallocation',
      scoresDimensions: ['staffing', 'prioritization'],
      situation:
        'Available now: You (Lead), Priya (T2, billing/specialist), Aisha (T1, good tone), Sam (junior, made the VIP-B mistake). Marco (T2, best technical) is mid-P2 for VIP-B. Yuki is in training (recallable in a true emergency). How do you deploy people against the two VIP P1s?',
      options: [
        {
          id: 's-a',
          label: 'Move Marco off the P2 onto VIP-A’s P1 outage; pull Yuki out of training to backfill the queue; keep Sam on VIP-B recovery with you supervising.',
          blurb: 'Put your strongest technical on the highest-revenue clock; recall training only because both crises are P1.',
          scores: { staffing: 92, prioritization: 88 },
          consequence: 'Best technical fit to the outage; recall is justified by dual P1s. Slight risk: Marco’s P2 pauses.',
          candidatePick: true,
        },
        {
          id: 's-b',
          label: 'Keep Marco on the P2; put Priya on VIP-A’s outage; leave Sam alone on VIP-B to fix his own mistake.',
          blurb: 'Avoid context-switching Marco, lean on Priya for the outage.',
          scores: { staffing: 58, prioritization: 60 },
          consequence: 'Priya is billing-strongest, not technical — weaker fit for an outage. Leaving a 3-mo junior solo on a data-loss P1 is risky.',
        },
        {
          id: 's-c',
          label: 'Spread everyone thin: one person per open case, you float between both VIP P1s.',
          blurb: 'Maximize coverage breadth.',
          scores: { staffing: 40, prioritization: 38 },
          consequence: 'Coverage looks full but no one owns either P1. Floating leads dilute accountability under a hard clock.',
        },
        {
          id: 's-d',
          label: 'All hands on VIP-A’s outage (biggest account); let VIP-B’s data loss wait in queue.',
          blurb: 'Concentrate force on the largest client.',
          scores: { staffing: 46, prioritization: 44 },
          consequence: 'Over-indexes on revenue. A data-loss P1 is also a compliance trigger — it cannot simply wait.',
        },
      ],
    },
    /* ----------------------------- STEP 2 ------------------------------- */
    {
      id: 'escalation',
      index: 2,
      kind: 'choice',
      title: 'Escalation',
      scoresDimensions: ['escalation', 'prioritization'],
      situation:
        'The VIP-B incident is data loss on a regulated-data client. Per the escalation matrix: data loss / compliance breach → Ops Manager with a mandatory report. The VIP-A outage is a VIP P1 nearing its clock → Team Lead owns it. What do you escalate, and to whom — before the 30-minute report deadline?',
      options: [
        {
          id: 'e-a',
          label: 'Escalate VIP-B data loss to Ops Manager now (mandatory report); own VIP-A at Team Lead level; flag VIP-B as a compliance item in the upcoming report.',
          blurb: 'Route by the matrix: data loss is a mandatory Ops Manager report; the outage stays with you.',
          scores: { escalation: 94, prioritization: 86 },
          consequence: 'Exactly maps to the escalation matrix. Compliance exposure is surfaced early, not buried.',
          candidatePick: true,
        },
        {
          id: 'e-b',
          label: 'Escalate the VIP-A outage to Ops Manager (it’s the biggest client); handle VIP-B quietly to avoid alarming leadership.',
          blurb: 'Escalate by account size; contain the mistake internally.',
          scores: { escalation: 42, prioritization: 50 },
          consequence: 'Inverts the matrix. Hiding a data-loss/compliance event is the costliest possible miss.',
        },
        {
          id: 'e-c',
          label: 'Escalate both to the Director immediately to be safe.',
          blurb: 'Over-escalate everything.',
          scores: { escalation: 55, prioritization: 48 },
          consequence: 'Director isn’t the first stop for either. Over-escalation erodes trust and burns leadership attention.',
        },
        {
          id: 'e-d',
          label: 'Escalate nothing yet — gather full facts first, then include everything in the 30-minute report.',
          blurb: 'Wait for complete information before escalating.',
          scores: { escalation: 35, prioritization: 40 },
          consequence: 'A mandatory-report compliance event should not wait for tidy facts. Speed of notification matters here.',
        },
      ],
    },
    /* ----------------------------- STEP 3 ------------------------------- */
    {
      id: 'communication',
      index: 3,
      kind: 'choice',
      title: 'Customer communication',
      scoresDimensions: ['communication'],
      situation:
        'VIP-B’s IT lead (Marcus) will notice the deleted config soon. VIP-A’s Director (Dana) is waiting on the outage. You can’t fix both instantly. What do you tell the customers, and when?',
      options: [
        {
          id: 'c-a',
          label: 'Proactively notify both: VIP-B gets an honest "we identified an internal error, recovery underway, here’s the ETA + a named owner"; VIP-A gets a status + realistic ETA within the SLA window.',
          blurb: 'Lead with proactive, honest, owner-named updates before they chase you.',
          scores: { communication: 93 },
          consequence: 'Proactive honesty protects trust during a renewal-sensitive period. Named owner + ETA beats vague reassurance.',
          candidatePick: true,
        },
        {
          id: 'c-b',
          label: 'Tell VIP-A everything is on track; wait to tell VIP-B until the data is fully recovered so you have good news.',
          blurb: 'Delay the bad news until you can pair it with a fix.',
          scores: { communication: 48 },
          consequence: 'If VIP-B discovers the deletion first, the delay reads as concealment — far worse than an early honest note.',
        },
        {
          id: 'c-c',
          label: 'Send both a generic "we’re experiencing high volume, thanks for your patience" holding message.',
          blurb: 'Buy time with a templated holding note.',
          scores: { communication: 40 },
          consequence: 'Generic templates to VIP P1s signal you don’t grasp the severity. No ownership, no ETA.',
        },
        {
          id: 'c-d',
          label: 'Say nothing until you have full resolution on both — avoid over-promising.',
          blurb: 'Stay silent to avoid committing to a wrong ETA.',
          scores: { communication: 33 },
          consequence: 'Silence on two VIP P1s during a live crisis is the fastest way to lose a renewal.',
        },
      ],
    },
    /* ----------------------------- STEP 4 ------------------------------- */
    {
      id: 'recovery',
      index: 4,
      kind: 'choice',
      title: 'Recovery & prevention plan',
      scoresDimensions: ['recovery', 'documentation'],
      situation:
        'Both fires are being worked. Now plan the recovery: technical recovery for VIP-B’s deleted config, SLA remediation for any breach, and prevention so this doesn’t recur. What’s your plan?',
      options: [
        {
          id: 'r-a',
          label: 'Restore VIP-B from the last backup + verify integrity; if VIP-A breached, offer an SLA credit per policy; add a guardrail (confirm-before-delete on prod records) + a 1:1 coaching note for Sam (not blame).',
          blurb: 'Recover, remediate, and prevent — plus coach the junior, not punish.',
          scores: { recovery: 92, documentation: 80 },
          consequence: 'Closes the loop on all three: data, SLA, and recurrence. Coaching framing retains the junior.',
          candidatePick: true,
        },
        {
          id: 'r-b',
          label: 'Restore the data and move on; revisit prevention later when things calm down.',
          blurb: 'Fix the immediate damage, defer prevention.',
          scores: { recovery: 60, documentation: 55 },
          consequence: 'Data is restored but the same gap can fire again tomorrow. "Later" prevention rarely happens.',
        },
        {
          id: 'r-c',
          label: 'Restore the data and formally discipline Sam to make the seriousness clear.',
          blurb: 'Recover + hold the junior accountable with discipline.',
          scores: { recovery: 50, documentation: 52 },
          consequence: 'Blame-first kills psychological safety; the real fix is a system guardrail, not punishing a 3-mo hire.',
        },
        {
          id: 'r-d',
          label: 'Offer VIP-B a large goodwill refund to smooth it over; skip the backup-integrity check to save time.',
          blurb: 'Buy goodwill fast, skip verification.',
          scores: { recovery: 38, documentation: 45 },
          consequence: 'Skipping integrity verification can ship corrupted data. Over-compensating without a fix sets a bad precedent.',
        },
      ],
    },
    /* ----------------------------- STEP 5 ------------------------------- */
    {
      id: 'report',
      index: 5,
      kind: 'report',
      title: 'Executive situation report',
      scoresDimensions: ['documentation'],
      situation:
        'Your Ops Manager asked for a situation report within 30 minutes. Write a tight executive update. Strong reports name the incidents, current status, owners, customer impact, escalations made, and next steps with timing.',
      reportPrompt:
        'Write your 30-minute situation report to the Ops Manager. (A few sentences is enough — clarity beats length.)',
      reportRubricHints: [
        'incident',
        'sla',
        'vip',
        'escalat',
        'owner',
        'next',
        'eta',
        'recover',
        'prevent',
        'customer',
      ],
    },
  ] as DecisionStep[],
};

export type Scenario = typeof SCENARIO_01;
