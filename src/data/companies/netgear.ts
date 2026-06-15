import type { Company } from './types';

/* NETGEAR — Level 2 Technical Support Engineer.
   Unofficial candidate demo tailored to the public job description.
   Not affiliated with NETGEAR; all customers/data are fictional. */

export const NETGEAR: Company = {
  slug: 'netgear',
  visible: true,
  name: 'NETGEAR',
  roleTitle: 'Level 2 Technical Support Engineer',
  tagline: 'A real enterprise support shift — diagnose wired/wireless issues, manage the queue, and know exactly when to escalate to L3.',
  accent: 'sky',
  wordmark: 'NETGEAR Enterprise Support',
  consoleName: 'Enterprise Support Desk',
  org: 'NETGEAR Enterprise Support · L2',
  about:
    'Front-line L2 support for NETGEAR business networking — switches, wireless access points, business routers, NAS, NETGEAR Insight, and Exium. This demo simulates a real escalated case: structured troubleshooting, customer communication across technical levels (KO/EN), and a clean L2↔L3 escalation decision.',
  source: 'Public job description (Level 2 Technical Support Engineer)',
  hook: 'I built a working L2 support-desk simulation of a NETGEAR enterprise case — structured troubleshooting, an L3 escalation decision, and customer comms — so you can see how I work before we ever talk.',
  requirements: [
    { req: 'Diagnose moderately complex wired & wireless networking issues', proof: 'The live case is a real wireless-instability + PoE problem you isolate step by step.' },
    { req: 'Apply structured troubleshooting methodology', proof: 'Step 2 scores method (isolate variables, read Insight logs) over guess-and-change.' },
    { req: 'Escalate complex issues to L3 when required', proof: 'Step 4 is a dedicated L2↔L3 escalation decision — what to escalate, with what evidence.' },
    { req: 'Manage a queue of support tickets, timely & accurate', proof: 'Step 1 is queue triage across switches/APs/routers/NAS/Insight under SLA.' },
    { req: 'Communicate clearly with varying technical levels', proof: 'Step 3 is explaining to a non-technical, Korean-speaking site manager.' },
    { req: 'Document troubleshooting steps, findings & resolutions', proof: 'Step 5 writes the case/KB note that L3 and the next engineer rely on.' },
    { req: 'Korean fluency + professional English', proof: 'Customer comms are framed bilingually; the writing is recruiter-readable in English.' },
    { req: 'Networking fundamentals (protocols, topologies)', proof: 'Diagnosis options reward correct reasoning about PoE budget, VLAN, firmware, RF.' },
  ],
  dimensions: [
    { key: 'methodology', label: 'Troubleshooting Methodology', weight: 24, criteria: 'Isolating variables vs. guess-and-change.' },
    { key: 'fundamentals', label: 'Networking Fundamentals', weight: 20, criteria: 'Correct reasoning about PoE/VLAN/RF/firmware.' },
    { key: 'prioritization', label: 'Case Prioritization', weight: 14, criteria: 'Working the right ticket first under SLA.' },
    { key: 'communication', label: 'Customer Communication', weight: 18, criteria: 'Clear, empathetic, level-appropriate (KO/EN).' },
    { key: 'escalation', label: 'Escalation Judgment (L2↔L3)', weight: 14, criteria: 'Escalating the right thing, with evidence.' },
    { key: 'documentation', label: 'Documentation Quality', weight: 10, criteria: 'Reproducible case/KB notes.' },
  ],
  kpis: [
    { label: 'CSAT', value: '—', sub: 'set by your handling', tone: 'sky' },
    { label: 'FCR', value: '68%', sub: 'first-contact resolution', tone: 'fog' },
    { label: 'Avg Resolution', value: '3.4h', sub: 'L2 target ≤ 4h', tone: 'fog' },
    { label: 'Backlog', value: '14', sub: 'open L2 cases', tone: 'fog' },
    { label: 'Escalation rate', value: '11%', sub: 'to L3', tone: 'fog' },
    { label: 'Reopen rate', value: '4%', sub: 'quality signal', tone: 'fog' },
  ],
  queueTitle: 'Support Queue',
  queueNote: 'Tooling Assist flags likely causes — you decide.',
  queue: [
    { id: 'NG-5021', primary: 'Retail HQ — APs flapping + PoE reboots', secondary: 'WAX / Insight · wireless', tag: 'P2', tagTone: 'amber', right: 'SLA 03:40', signal: 'Assist: correlates with last firmware push' },
    { id: 'NG-5018', primary: 'Logistics — VLAN trunk drops on 48-port switch', secondary: 'Smart switch · wired', tag: 'P2', tagTone: 'amber', right: 'SLA 05:10', signal: 'Assist: possible native-VLAN mismatch' },
    { id: 'NG-5030', primary: 'Clinic — NAS volume degraded (RAID)', secondary: 'ReadyNAS · storage', tag: 'P1', tagTone: 'rose', right: 'SLA 01:25', signal: 'Assist: 1 disk SMART pre-fail' },
    { id: 'NG-5025', primary: 'Cafe chain — guest WiFi captive portal fails', secondary: 'Insight · wireless', tag: 'P3', tagTone: 'fog', right: 'SLA 22:00', signal: 'Assist: cloud config drift' },
    { id: 'NG-5031', primary: 'SMB — business router VPN drops nightly', secondary: 'Router · wired', tag: 'P3', tagTone: 'fog', right: 'SLA 19:30', signal: 'Assist: ISP MTU / rekey window' },
  ],
  panelTitle: 'Knowledge Base (recent fixes)',
  panel: [
    { primary: 'PoE budget exceeded → APs reboot under load', secondary: 'KB-2231 · switch power planning' },
    { primary: 'Firmware x.y.z regression: AP client steering', secondary: 'KB-2240 · known issue, L3 owns fix' },
    { primary: 'Native-VLAN mismatch breaks trunk', secondary: 'KB-1980 · wired' },
    { primary: 'Insight cloud config drift after bulk change', secondary: 'KB-2102 · cloud' },
  ],
  scenario: {
    id: 'wireless-instability',
    name: 'Enterprise wireless instability + PoE reboots',
    tagline: 'Retail HQ: APs keep dropping clients and some PoE APs randomly reboot — right after a firmware change.',
    clock: 'Case NG-5021 · P2 · SLA 03:40',
    briefing: `Customer: a mid-size retail chain HQ (≈18 NETGEAR APs on PoE switches, managed via NETGEAR Insight).

Reported: since a recent change, wireless clients intermittently disconnect across several APs, and 2–3 PoE APs randomly reboot during busy hours. Insight shows those APs "flapping" (going offline/online).

On the line: a non-technical site manager (Korean-speaking), frustrated — "the WiFi keeps dying and you changed something."

You're the L2 engineer. Work the case: triage, diagnose methodically, communicate, and decide the L2↔L3 line. Record your reasoning at each step.`,
    liveClocks: [{ label: 'NG-5021 · resolution SLA', startMin: 220 }],
    steps: [
      {
        id: 'triage', index: 1, kind: 'choice', title: 'Queue triage',
        scoresDimensions: ['prioritization'],
        situation: 'Your queue: NG-5021 (this retail wireless P2, SLA 3:40), NG-5018 (VLAN trunk P2, 5:10), NG-5030 (NAS RAID P1, SMART pre-fail, 1:25), plus two P3s. The customer for 5021 is already on the line. What do you work first?',
        assist: 'Assist: NG-5030 shows a disk in SMART pre-fail — data-loss risk if the array degrades further.',
        memoPrompt: 'Why this order? What drove the priority call?',
        options: [
          { id: 'a', candidatePick: true, label: 'Stabilize the NAS P1 first (kick off a backup / flag the pre-fail disk, ~10 min), set the caller’s expectation, then own 5021 as the focused case.', blurb: 'Protect against data loss first, then give 5021 your full attention.', scores: { prioritization: 92 }, consequence: 'A SMART pre-fail with a tight SLA is a data-loss risk — a few minutes now prevents an irreversible P1. The caller gets a clear ETA.', commentary: { why: 'Severity, not who’s loudest, sets order. A degrading RAID is irreversible; wireless instability is recoverable. I protect the irreversible risk first, then commit fully to the customer on the line.', tradeoff: 'The 5021 caller waits a few minutes — so I set an explicit expectation rather than going silent.' } },
          { id: 'b', label: 'Stay on 5021 because the customer is already on the line; come back to the NAS after.', blurb: 'Whoever’s on the phone wins.', scores: { prioritization: 55 }, consequence: 'Recency/voice bias. Letting a SMART pre-fail array sit risks irreversible data loss while you chase a recoverable WiFi issue.' },
          { id: 'c', label: 'Work strictly by SLA timer: NAS (1:25) then 5021 (3:40) then the rest.', blurb: 'Follow the clock.', scores: { prioritization: 74 }, consequence: 'Reasonable and defensible — though "stabilize then return" handles the live caller better than going fully heads-down.' },
          { id: 'd', label: 'Knock out the two quick P3s first to shrink the backlog number.', blurb: 'Clear easy wins.', scores: { prioritization: 28 }, consequence: 'Optimizes the backlog count while a P1 data-loss risk and a P2 with a live customer age.' },
        ],
      },
      {
        id: 'diagnosis', index: 2, kind: 'choice', title: 'Structured diagnosis',
        scoresDimensions: ['methodology', 'fundamentals'],
        situation: 'Back on 5021. Symptoms: client disconnects + specific PoE APs rebooting, starting after a recent change. Insight shows those APs flapping. How do you diagnose?',
        assist: 'Assist: the rebooting APs are the highest-PoE-draw models; a firmware push also landed in the same window.',
        memoPrompt: 'What’s your hypothesis and how do you isolate it before changing anything?',
        options: [
          { id: 'a', candidatePick: true, label: 'Isolate methodically: pull Insight event logs + timestamps, separate the two symptoms (reboots vs. client drops), check the switch PoE budget vs. connected AP power draw, and correlate against the firmware/change timeline before touching config.', blurb: 'Gather evidence, separate symptoms, check power budget + change correlation first.', scores: { methodology: 94, fundamentals: 90 }, consequence: 'Reboots on the highest-draw APs scream PoE-budget; client drops may be a separate firmware/RF issue. Isolating first avoids fixing the wrong thing.', commentary: { why: 'Two symptoms can have two causes. PoE reboots on the highest-draw APs point at an exceeded power budget; intermittent client drops point at firmware client-steering or RF. I confirm each with Insight logs and the switch’s PoE allocation before changing anything — method beats a lucky guess and is reproducible for L3.', tradeoff: 'It’s slower than immediately rebooting/“try firmware rollback,” but it produces evidence that resolves the case once, not three times.' } },
          { id: 'b', label: 'Roll back the firmware immediately — it started after the firmware push.', blurb: 'Undo the recent change.', scores: { methodology: 55, fundamentals: 58 }, consequence: 'Plausible for the client drops, but ignores the PoE-budget signal behind the reboots; you may "fix" one symptom and leave the other.' },
          { id: 'c', label: 'Factory-reset and re-provision the flapping APs from Insight.', blurb: 'Clean slate the APs.', scores: { methodology: 38, fundamentals: 40 }, consequence: 'A big disruptive action before diagnosis; if it’s a PoE-budget issue, reset APs will just reboot again.' },
          { id: 'd', label: 'Ask the customer to reboot the switch and "see if it helps."', blurb: 'Power-cycle and wait.', scores: { methodology: 30, fundamentals: 35 }, consequence: 'Guess-and-check on an enterprise customer; no evidence captured, likely a repeat call.' },
        ],
      },
      {
        id: 'comms', index: 3, kind: 'choice', title: 'Customer communication',
        scoresDimensions: ['communication'],
        situation: 'The non-technical, Korean-speaking site manager wants to know what’s happening and when WiFi will be stable. How do you communicate?',
        assist: 'Assist: Response Playbook has a bilingual "plain-language status + ETA" template.',
        memoPrompt: 'What exactly do you tell the customer, in what tone?',
        options: [
          { id: 'a', candidatePick: true, label: 'Plain-language + empathetic: "Some access points are drawing more power than the switch can supply, which makes them restart — that’s the cause we’re confirming now. WiFi will stay usable; I’ll have a fix plan within the hour and update you at [time]." Offer it in Korean.', blurb: 'Acknowledge, explain in plain terms, give a concrete next update + time.', scores: { communication: 93 }, consequence: 'Non-technical customers need cause + ETA + a named next update, not jargon. Bilingual delivery meets the role’s KO/EN requirement.', commentary: { why: 'A frustrated, non-technical customer needs three things: that you understand the impact, a cause in plain language, and a specific time you’ll come back. Jargon (PoE budget, client steering) would erode trust; a clear analogy plus an ETA builds it.', tradeoff: 'Committing to a "fix plan within the hour" puts me on the hook — so I only promise the update time, not a guaranteed fix time.' } },
          { id: 'b', label: 'Send the technical detail: PoE budget overage, firmware regression, VLAN — so they have full information.', blurb: 'Full transparency, technical.', scores: { communication: 48 }, consequence: 'Accurate but overwhelming for a non-technical contact; it reads as deflection, not help.' },
          { id: 'c', label: 'Reassure them it’s "being looked into" and you’ll follow up.', blurb: 'Soft, vague.', scores: { communication: 42 }, consequence: 'No cause, no ETA — exactly the vagueness that frustrated them in the first place.' },
          { id: 'd', label: 'Tell them it’s caused by their recent change/firmware and they should be careful next time.', blurb: 'Assign cause to the customer.', scores: { communication: 30 }, consequence: 'Blaming the customer mid-incident damages the relationship even if technically related.' },
        ],
      },
      {
        id: 'escalation', index: 4, kind: 'routing', title: 'L2 ↔ L3 escalation decision',
        scoresDimensions: ['escalation'],
        situation: 'You’ve confirmed: (1) PoE budget is exceeded on that switch (an L2-fixable design/config issue), and (2) the client-steering drops match a known firmware regression that L3/engineering owns. What do you do?',
        assist: 'Assist: KB-2240 marks the client-steering firmware regression as a known issue owned by L3.',
        memoPrompt: 'What stays at L2, what goes to L3, and what evidence do you attach?',
        routingPrompt: 'Select the correct actions (choose all that apply):',
        routingTargets: [
          { id: 'fix_poe_l2', label: 'Resolve PoE budget at L2', scope: 'Rebalance AP load / enable PoE limits / plan power — within L2 scope' },
          { id: 'escalate_l3', label: 'Escalate firmware regression to L3', scope: 'Known client-steering defect engineering owns' },
          { id: 'attach_evidence', label: 'Attach Insight logs + timeline to the L3 case', scope: 'Reproducible evidence so L3 doesn’t restart triage' },
          { id: 'escalate_all', label: 'Escalate the whole case to L3', scope: 'Hand the entire ticket up' },
          { id: 'close_now', label: 'Close the case as resolved now', scope: 'Mark done before the firmware fix exists' },
          { id: 'customer_workaround', label: 'Give the customer an interim workaround', scope: 'e.g., pin stable firmware / disable the affected feature' },
        ],
        routingCorrect: ['fix_poe_l2', 'escalate_l3', 'attach_evidence', 'customer_workaround'],
      },
      {
        id: 'doc', index: 5, kind: 'report', title: 'Case / KB documentation',
        scoresDimensions: ['documentation'],
        situation: 'Write the case note. Strong notes capture: symptoms, what you isolated, root cause(s), what you fixed at L2, what went to L3 (with evidence), the customer workaround, and the resolution/next step.',
        reportPrompt: 'Write your case documentation:',
        reportRubricHints: ['poe', 'firmware', 'insight', 'isolat', 'escalat', 'l3', 'workaround', 'customer', 'resolution', 'evidence'],
      },
    ],
  },
};
