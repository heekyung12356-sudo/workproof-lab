import type { Scenario } from './types';

export const SCENARIO_B: Scenario = {
  id: 'agent-error',
  code: 'B',
  name: 'Agent Error + Angry VIP',
  tagline: 'A junior sent wrong refund info to a VIP. The customer is threatening to escalate — and the agent is scared.',
  clock: 'Mon 11:30 KST',
  cardSummary: 'Jae (agent) sent incorrect refund information to a VIP customer who is now threatening escalation. Jae is anxious about being penalized. Contain, coach, route, prevent.',
  glyph: '✶',
  briefing: `11:30. Jae (an agent, strong speed but a quality dip lately) sent incorrect refund information to a VIP customer.

• The VIP is angry and threatening to escalate to their account exec.
• Jae is anxious and asking, privately, whether they’ll be penalized.
• The refund amount in question is above an agent’s authority.

You’re the Team Lead. Two things are true at once: a customer relationship to protect, and a team member to lead — without making either worse.`,
  liveClocks: [{ label: 'VIP response window', startMin: 30 }],
  steps: [
    {
      id: 'containment', index: 1, kind: 'choice', title: 'Customer containment',
      scoresDimensions: ['communication', 'risk'],
      situation: 'The VIP just replied: "This is the wrong information AGAIN. Who is responsible?" You have minutes before they escalate externally. What’s your first move with the customer?',
      ruleAssist: 'Rule Assist: refund amount exceeds agent authority — any committed number needs Team Lead approval.',
      memoPrompt: 'What would you say to the customer right now, and why that framing?',
      options: [
        { id: 'a', candidatePick: true, label: 'You personally reply: own it ("I’m the team lead, this is on us, not on you"), correct the information, give the accurate refund position you can authorize, and a clear next step + time.', blurb: 'Take ownership at the lead level, correct the facts, commit only what you can authorize.', scores: { communication: 93, risk: 85 }, consequence: 'Ownership + accurate, authorized info de-escalates fastest and stops the external escalation.' },
        { id: 'b', label: 'Have Jae apologize and fix it themselves to "own their mistake."', blurb: 'Make the agent face the customer.', scores: { communication: 50, risk: 45 }, consequence: 'A shaken junior re-contacting an angry VIP risks a third error; this is a lead-level recovery.' },
        { id: 'c', label: 'Reply that you’re "investigating" and will follow up later.', blurb: 'Buy time before committing.', scores: { communication: 42, risk: 48 }, consequence: 'Vague delay to an already-angry VIP invites the escalation you’re trying to avoid.' },
        { id: 'd', label: 'Immediately offer a large goodwill refund to make it go away.', blurb: 'Throw money at it fast.', scores: { communication: 40, risk: 35 }, consequence: 'Over-compensating without verifying the correct figure sets a precedent and may exceed policy.' },
      ],
    },
    {
      id: 'people', index: 2, kind: 'choice', title: 'Leading the agent',
      scoresDimensions: ['people', 'fairness', 'calmness'],
      situation: 'Jae is visibly anxious in a DM: "Am I getting written up?" You need the team to keep reporting their own mistakes. How do you handle Jae right now?',
      ruleAssist: 'Rule Assist: Quality Signal for Jae dropped after a recent error — flagged for coaching, not discipline.',
      memoPrompt: 'How do you handle Jae, and what outcome are you protecting?',
      options: [
        { id: 'a', candidatePick: true, label: 'Privately: "You’re not in trouble — thank you for flagging it. Let’s fix the customer first, then I’ll show you the check that catches this." Coach now, document as a coaching note.', blurb: 'Psychological safety first; fix, then coach; record as coaching not discipline.', scores: { people: 93, fairness: 88, calmness: 92 }, consequence: 'Keeps the reporting culture intact and turns the error into a durable lesson.' },
        { id: 'b', label: 'Tell Jae mistakes have consequences and you’ll "discuss it formally later."', blurb: 'Signal seriousness with the threat of formal action.', scores: { people: 45, fairness: 50, calmness: 55 }, consequence: 'Fear-first teaches people to hide errors — the opposite of what you need.' },
        { id: 'c', label: 'Address it in the team channel so everyone learns from it.', blurb: 'Public lesson for the whole team.', scores: { people: 35, fairness: 38, calmness: 50 }, consequence: 'Public call-outs humiliate; share the *lesson* later, never the person’s name in the moment.' },
        { id: 'd', label: 'Say nothing to Jae for now; just fix the customer.', blurb: 'Avoid the conversation entirely.', scores: { people: 55, fairness: 58, calmness: 60 }, consequence: 'Silence leaves the anxiety (and the skill gap) unaddressed; a quick reassurance + plan is better.' },
      ],
    },
    {
      id: 'routing', index: 3, kind: 'routing', title: 'Reporting chain',
      scoresDimensions: ['reporting', 'escalation'],
      situation: 'Given an angry VIP, a refund above agent authority, and a quality dip, who do you loop in?',
      ruleAssist: 'Rule Assist: refund > agent authority → Team Lead approval; VIP relationship risk → CSM; quality dip → QA coaching.',
      memoPrompt: 'Why these roles?',
      routingPrompt: 'Select every role you’d involve (choose all that apply):',
      routingCorrect: ['csm', 'qa'],
    },
    {
      id: 'prevention', index: 4, kind: 'choice', title: 'Prevention',
      scoresDimensions: ['recovery', 'documentation', 'people'],
      situation: 'The customer is calmed and the refund is corrected. How do you make sure this class of error doesn’t recur?',
      ruleAssist: 'Rule Assist: Response Playbook for refunds lacks an authority-limit check.',
      memoPrompt: 'What changes, and what risk remains unresolved?',
      options: [
        { id: 'a', candidatePick: true, label: 'Add an authority-limit check to the refund Playbook, give Jae a short coaching block on refund policy, and log a blameless coaching note.', blurb: 'Fix the system + coach the person + document blamelessly.', scores: { recovery: 92, documentation: 85, people: 90 }, consequence: 'Closes the gap at the system level so it can’t depend on memory; retains the agent.' },
        { id: 'b', label: 'Tell Jae to "double-check everything" from now on.', blurb: 'Rely on the agent being more careful.', scores: { recovery: 48, documentation: 50, people: 55 }, consequence: '"Be more careful" isn’t a control; the same error recurs under pressure.' },
        { id: 'c', label: 'Move Jae off all refund cases permanently.', blurb: 'Remove the agent from the risk area.', scores: { recovery: 50, documentation: 55, people: 40 }, consequence: 'Shrinks the person instead of fixing the process; demoralizing and unscalable.' },
        { id: 'd', label: 'Note it and move on; you’re out of time.', blurb: 'Defer prevention.', scores: { recovery: 35, documentation: 40, people: 50 }, consequence: 'Deferred prevention rarely happens; the gap stays open.' },
      ],
    },
    {
      id: 'report', index: 5, kind: 'report', title: 'Incident note',
      scoresDimensions: ['documentation'],
      situation: 'Log a short incident + coaching note for the record. Strong notes capture: what happened, customer impact, how it was resolved, the prevention change, and the (blameless) coaching action.',
      reportPrompt: 'Write the incident + coaching note:',
      reportRubricHints: ['vip', 'refund', 'resolv', 'coach', 'playbook', 'prevent', 'customer', 'authority', 'note'],
    },
  ],
};
