import type { Scenario } from './types';

export const SCENARIO_D: Scenario = {
  id: 'leave-conflict',
  code: 'D',
  name: 'Leave Approval Conflict',
  tagline: 'Three leave requests, one peak day, and not enough coverage. Someone hears "no" — fairly.',
  clock: 'Mon 16:20 KST',
  cardSummary: 'Three agents request leave for the same peak-volume day: a high performer, a struggling agent, and an urgent family-leave case. Coverage would fall below minimum. Decide, cover, and explain it fairly.',
  glyph: '◷',
  briefing: `16:20. Three agents have requested leave for the same upcoming peak-volume day:

• Mina — high performer (also a burnout-risk flag).
• Jae — currently struggling on quality.
• Aisha — urgent family leave.

If you approve all three, coverage drops below the minimum staffing line on your busiest day. This is where fairness, people management, and staffing collide.`,
  liveClocks: [],
  steps: [
    {
      id: 'decision', index: 1, kind: 'choice', title: 'Leave decision',
      scoresDimensions: ['fairness', 'people', 'staffing'],
      situation: 'You can’t approve all three without breaching minimum coverage. What’s your decision framework?',
      ruleAssist: 'Rule Assist: minimum staffing line breaches on the requested day if 3 approvals stand. Urgent family leave is typically protected.',
      memoPrompt: 'What principle ranks the requests, and why is it defensible?',
      options: [
        { id: 'a', candidatePick: true, label: 'Approve Aisha (urgent family — protected); approve Mina (burnout risk makes rest a real need) but arrange coverage; ask Jae to move to an adjacent day, explained directly and with a coaching upside, not as punishment.', blurb: 'Protect the urgent + the burnout risk; reschedule the third with a clear, kind rationale.', scores: { fairness: 92, people: 90, staffing: 88 }, consequence: 'Defensible by principle (urgency, wellbeing, coverage) rather than by who’s "best" — and keeps coverage.' },
        { id: 'b', label: 'Approve by seniority/performance: Mina yes, then first-come for the rest.', blurb: 'Reward the top performers first.', scores: { fairness: 50, people: 48, staffing: 60 }, consequence: 'Performance-ranking leave feels punitive and ignores an urgent family need; corrodes trust.' },
        { id: 'c', label: 'Deny all three to keep full coverage; "fair is fair."', blurb: 'No exceptions, maximum coverage.', scores: { fairness: 45, people: 40, staffing: 70 }, consequence: 'Blanket denial of an urgent family request is the kind of "fairness" that loses people.' },
        { id: 'd', label: 'Approve all three and just deal with the understaffing.', blurb: 'Say yes to everyone.', scores: { fairness: 55, people: 60, staffing: 30 }, consequence: 'Avoiding the hard call breaches minimum coverage and pushes the cost onto whoever works that day.' },
      ],
    },
    {
      id: 'fairness-comms', index: 2, kind: 'choice', title: 'Explaining it to the team',
      scoresDimensions: ['communication', 'fairness', 'calmness'],
      situation: 'Jae’s request is the one being rescheduled. How do you communicate the decision so it lands as fair, not arbitrary?',
      ruleAssist: 'Rule Assist: decisions perceived as arbitrary drive attrition more than the decision itself.',
      memoPrompt: 'How do you frame it to Jae and the team?',
      options: [
        { id: 'a', candidatePick: true, label: 'Tell Jae directly and privately first: explain the principle (urgency + coverage), offer the adjacent day, and confirm it’s not about their recent quality dip. Then state the leave principle openly to the team.', blurb: 'Direct + private first, principle-based, decouple it from performance, then transparency for all.', scores: { communication: 92, fairness: 90, calmness: 90 }, consequence: 'A consistent, openly-stated principle makes a "no" feel fair and prevents rumor.' },
        { id: 'b', label: 'Announce all approvals/denials in the team channel at once.', blurb: 'One transparent announcement.', scores: { communication: 55, fairness: 58, calmness: 60 }, consequence: 'Transparency is good, but the person told "no" deserves a direct conversation first.' },
        { id: 'c', label: 'Just update the schedule; people will see it.', blurb: 'Let the roster speak.', scores: { communication: 35, fairness: 38, calmness: 50 }, consequence: 'Silent denial reads as arbitrary and disrespectful; it’s how trust erodes.' },
        { id: 'd', label: 'Tell Jae the denial is because of their recent performance.', blurb: 'Be blunt about the quality dip.', scores: { communication: 30, fairness: 32, calmness: 40 }, consequence: 'Tying leave to performance is punitive and likely unfair; it conflates two separate issues.' },
      ],
    },
    {
      id: 'routing', index: 3, kind: 'routing', title: 'Reporting chain',
      scoresDimensions: ['reporting'],
      situation: 'A leave/coverage decision with a wellbeing dimension — who do you involve to make it stick and stay compliant?',
      ruleAssist: 'Rule Assist: leave & coverage → WFM for schedule; people/leave policy & family leave → HR.',
      memoPrompt: 'Why these roles?',
      routingPrompt: 'Select every role you’d involve (choose all that apply):',
      routingCorrect: ['wfm', 'hr'],
    },
    {
      id: 'coverage', index: 4, kind: 'choice', title: 'Coverage plan',
      scoresDimensions: ['staffing', 'recovery'],
      situation: 'Two of three are off on the peak day. How do you cover without burning out whoever remains?',
      ruleAssist: 'Rule Assist: Mina is a burnout risk — do not backfill peak load onto her.',
      memoPrompt: 'What’s the coverage plan, and how do you avoid creating a new burnout?',
      options: [
        { id: 'a', candidatePick: true, label: 'Stagger shifts to extend coverage, pre-route low-risk volume to the new hires with senior backup, ask for one voluntary swap, and pre-brief customers on any reduced-hours windows.', blurb: 'Spread load structurally + voluntary swaps + proactive customer expectation-setting.', scores: { staffing: 91, recovery: 86 }, consequence: 'Covers the day without dumping it on one person; sets expectations before SLAs slip.' },
        { id: 'b', label: 'Pile the extra load onto Mina — she’s your best.', blurb: 'Lean on the top performer.', scores: { staffing: 40, recovery: 42 }, consequence: 'Directly worsens the burnout risk you just approved leave to relieve.' },
        { id: 'c', label: 'Mandate overtime for everyone working that day.', blurb: 'Force coverage with OT.', scores: { staffing: 50, recovery: 48 }, consequence: 'Mandated OT on a peak day breeds resentment and quality dips; use it only as a last resort.' },
        { id: 'd', label: 'Hope volume is lower than forecast and wing it.', blurb: 'No specific plan.', scores: { staffing: 30, recovery: 35 }, consequence: 'No plan is a plan to breach SLAs on your busiest day.' },
      ],
    },
  ],
};
