import type { Company } from './types';

/* tQCS Limited — Associate Consultant (Project Management / Business Development).
   Unofficial candidate demo tailored to the public job description.
   Not affiliated with tQCS; all clients/data are fictional. */

export const TQCS: Company = {
  slug: 'tqcs',
  visible: true,
  name: 'tQCS',
  roleTitle: 'Associate Consultant (PM / Business Development)',
  tagline: 'A real consulting engagement — coordinate the project, learn an unfamiliar technology fast, and translate it into business implications for the client.',
  accent: 'iris',
  wordmark: 'tQCS Engagement',
  consoleName: 'Engagement Console',
  org: 'tQCS · Embedded Software Advisory',
  about:
    'Associate Consultant support across project coordination, technical consulting, and business development for embedded/industrial software clients (automotive, industrial, mission-critical). This demo simulates a live engagement: keep the project on track, evaluate an unfamiliar technology on its merits, and translate the implications for a non-technical stakeholder — programming mastery not required, learning agility and clear communication are.',
  source: 'Public job description (Associate Consultant, PM/BD)',
  hook: 'I built a working consulting-engagement simulation around an OTA/embedded strategy — project coordination, technology evaluation, and translating it for a non-technical buyer — so you can see how I think, not just what I claim.',
  requirements: [
    { req: 'Coordinate consulting/integration projects; track milestones (JIRA/Git/Gerrit)', proof: 'Step 1 is a slipping-milestone call inside a JIRA-style board.' },
    { req: 'Evaluate embedded architectures; research emerging tech', proof: 'Step 2 evaluates an OTA/messaging architecture on the client’s real constraints.' },
    { req: 'Quickly understand unfamiliar technologies', proof: 'The task rewards reasoning from constraints, not memorized expertise.' },
    { req: 'Translate complex tech into business implications', proof: 'Step 3 explains the recommendation to a non-technical procurement lead.' },
    { req: 'Prepare proposals, presentations, solution docs', proof: 'Step 5 writes the one-page recommendation the senior consultant takes to the client.' },
    { req: 'Work independently in a remote, international environment', proof: 'You make the coordination calls async, across distributed teams.' },
    { req: 'Leverage AI tools to accelerate research', proof: 'Assist surfaces research starting points; you judge and decide.' },
    { req: 'English + Korean communication', proof: 'Client comms are framed bilingually; the writing reads clean in English.' },
  ],
  dimensions: [
    { key: 'coordination', label: 'Project Coordination', weight: 20, criteria: 'Surfacing blockers, sequencing, keeping milestones honest.' },
    { key: 'learning', label: 'Technical Learning Agility', weight: 20, criteria: 'Reasoning about unfamiliar tech from constraints.' },
    { key: 'translation', label: 'Tech → Business Translation', weight: 20, criteria: 'Making implications clear to non-technical buyers.' },
    { key: 'analysis', label: 'Research & Analysis', weight: 14, criteria: 'Structured evaluation against requirements.' },
    { key: 'proposal', label: 'Proposal Quality', weight: 14, criteria: 'Clear, decision-ready recommendation.' },
    { key: 'stakeholder', label: 'Stakeholder Management', weight: 12, criteria: 'Right people, right info, right time.' },
  ],
  kpis: [
    { label: 'Milestones on track', value: '4/6', sub: 'OTA engagement', tone: 'iris' },
    { label: 'Deliverables due', value: '2', sub: 'this week', tone: 'fog' },
    { label: 'Open risks', value: '3', sub: '1 high', tone: 'fog' },
    { label: 'Partner meetings', value: '2', sub: 'scheduled', tone: 'fog' },
    { label: 'Client NPS', value: '—', sub: 'set by your handling', tone: 'iris' },
    { label: 'Proposal SLA', value: '48h', sub: 'to recommendation', tone: 'fog' },
  ],
  queueTitle: 'Engagement Tasks (JIRA-style)',
  queueNote: 'Assist surfaces research starting points — you judge and decide.',
  queue: [
    { id: 'ENG-204', primary: 'OTA strategy one-pager for AutoCo (SDV fleet)', secondary: 'Deliverable · due in 2 days', tag: 'HIGH', tagTone: 'rose', right: 'blocked', signal: 'Assist: blocked on a client connectivity decision' },
    { id: 'ENG-198', primary: 'Compare messaging layer: NATS vs MQTT', secondary: 'Research · architecture', tag: 'MED', tagTone: 'amber', right: 'in progress', signal: 'Assist: gather constraints before comparing' },
    { id: 'ENG-211', primary: 'Kickoff notes + RACI for IndustrialCo pilot', secondary: 'Coordination', tag: 'MED', tagTone: 'amber', right: 'due Fri', signal: '' },
    { id: 'ENG-220', primary: 'Partner intro deck — simulation tooling (QEMU/Renode)', secondary: 'Business development', tag: 'LOW', tagTone: 'fog', right: 'next week', signal: '' },
    { id: 'ENG-187', primary: 'Telemetry/data-platform options memo', secondary: 'Research', tag: 'LOW', tagTone: 'fog', right: 'backlog', signal: '' },
  ],
  panelTitle: 'AutoCo OTA engagement — milestones',
  panel: [
    { primary: 'M1 Discovery & constraints', progress: 100, status: 'done', statusTone: 'mint' },
    { primary: 'M2 Architecture options', progress: 70, status: 'in progress', statusTone: 'iris' },
    { primary: 'M3 Recommendation one-pager', progress: 20, status: 'at risk', statusTone: 'rose' },
    { primary: 'M4 Client review & decision', progress: 0, status: 'pending', statusTone: 'fog' },
    { primary: 'M5 Integration plan', progress: 0, status: 'pending', statusTone: 'fog' },
  ],
  scenario: {
    id: 'ota-engagement',
    name: 'Automotive OTA strategy engagement',
    tagline: 'AutoCo wants an OTA update strategy for a safety-critical embedded fleet. A milestone is slipping and an engineer is blocked.',
    clock: 'AutoCo · Recommendation due in 48h',
    briefing: `Client: AutoCo, a global automotive maker, exploring an OTA (over-the-air) software-update strategy for an embedded fleet (software-defined vehicle context). Safety-critical, intermittent connectivity, rollback is non-negotiable.

Your senior consultant asks you to move the engagement forward while she’s traveling:
• Milestone M3 (the recommendation one-pager, due in 48h) is at risk.
• An engineer is blocked waiting on a client decision about connectivity assumptions.
• You are NOT expected to be an embedded expert — you’re expected to coordinate, learn fast, evaluate on the merits, and translate it for the client.

Make the calls. Record your reasoning.`,
    liveClocks: [{ label: 'Recommendation deadline', startMin: 240 }],
    steps: [
      {
        id: 'coordination', index: 1, kind: 'choice', title: 'Unblock the milestone',
        scoresDimensions: ['coordination'],
        situation: 'M3 is at risk because an engineer is blocked on a client connectivity decision, and the senior consultant is traveling. What do you do first?',
        assist: 'Assist: the blocker is a single yes/no from the client (assume intermittent connectivity?) — the rest of the analysis can proceed in parallel.',
        memoPrompt: 'How do you keep M3 alive, and what did you decide to do in parallel?',
        options: [
          { id: 'a', candidatePick: true, label: 'Send the client one crisp decision request (with a sensible default + deadline), update JIRA so the team sees the dependency, and let the engineer proceed on the un-blocked 80% using the default assumption so M3 isn’t held hostage to one reply.', blurb: 'Drive the decision, unblock in parallel with a default, make the dependency visible.', scores: { coordination: 93 }, consequence: 'Turns an open-ended block into a time-boxed decision while keeping the analysis moving — classic remote-async coordination.', commentary: { why: 'A blocker that’s really a single decision shouldn’t freeze a deliverable. I make the decision easy for the client (clear ask + recommended default + deadline), record the dependency in JIRA for visibility, and let work continue on the parts that don’t depend on the answer. Momentum is the consultant’s job.', tradeoff: 'Proceeding on a default risks light rework if the client picks the other option — acceptable versus missing M3 entirely, and I flag it as an assumption.' } },
          { id: 'b', label: 'Wait for the senior consultant to return and decide the connectivity question.', blurb: 'Escalate up and pause.', scores: { coordination: 45 }, consequence: 'Stalls a 48h deliverable on someone who’s traveling; the engagement loses momentum the client notices.' },
          { id: 'c', label: 'Tell the engineer to pick whatever assumption and keep going; sort it out later.', blurb: 'Just keep moving.', scores: { coordination: 58 }, consequence: 'Momentum is good, but an undocumented assumption on a safety-critical client invites rework and confusion.' },
          { id: 'd', label: 'Push the deadline; ask the client for more time on M3.', blurb: 'Reset expectations.', scores: { coordination: 40 }, consequence: 'Slipping the first real deliverable over a one-line decision signals weak coordination early in the relationship.' },
        ],
      },
      {
        id: 'evaluation', index: 2, kind: 'choice', title: 'Technology evaluation',
        scoresDimensions: ['learning', 'analysis'],
        situation: 'The client must choose a messaging/update backbone. Constraints: safety-critical, intermittent connectivity, guaranteed rollback, auditability. You’re not an OTA expert — reason from the constraints.',
        assist: 'Assist: candidate pieces include MQTT vs NATS (transport), delta updates, A/B partitions for rollback, signed artifacts. Map each to a constraint.',
        memoPrompt: 'What’s your evaluation logic — which constraint drives which choice?',
        options: [
          { id: 'a', candidatePick: true, label: 'Evaluate by constraint, not by hype: require atomic A/B-partition updates + signed artifacts (rollback & safety), delta updates (intermittent links), and store-and-forward messaging that tolerates disconnects (MQTT with QoS, or NATS with JetStream) — and write down the assumptions you’re testing.', blurb: 'Map each requirement to a mechanism; pick transport on store-and-forward + QoS, not brand.', scores: { learning: 93, analysis: 92 }, consequence: 'Shows you can reason about unfamiliar tech from first principles and requirements — exactly the role’s core skill.', commentary: { why: 'I don’t need to be an OTA veteran to evaluate well — I map each non-negotiable to a mechanism: rollback → A/B partitions + signed images; intermittent links → delta updates + store-and-forward (QoS/JetStream); safety/audit → signed, traceable artifacts. Then I name the assumptions so experts can check my reasoning.', tradeoff: 'I deliberately don’t crown a single "winner" transport without the connectivity decision — I present the trade space rather than over-claim certainty I don’t have.' } },
          { id: 'b', label: 'Recommend the most popular stack (MQTT everywhere) because it’s widely used.', blurb: 'Go with the well-known option.', scores: { learning: 50, analysis: 48 }, consequence: 'Popularity isn’t a fit argument; it skips rollback/safety, the client’s actual non-negotiables.' },
          { id: 'c', label: 'Defer entirely to the engineer’s preference.', blurb: 'Let engineering decide.', scores: { learning: 55, analysis: 52 }, consequence: 'Reasonable to consult them, but the consultant must be able to reason about and explain the choice, not just relay it.' },
          { id: 'd', label: 'Ask the client which technology they want to use.', blurb: 'Let the client choose the tech.', scores: { learning: 35, analysis: 38 }, consequence: 'They hired advisory precisely because they don’t know; this abdicates the value you’re there to add.' },
        ],
      },
      {
        id: 'translation', index: 3, kind: 'choice', title: 'Translate for the business',
        scoresDimensions: ['translation'],
        situation: 'The client’s procurement lead (non-technical, decision-maker on budget) asks: "Why does this matter and what are we actually buying?" How do you explain it?',
        assist: 'Assist: tie each technical choice to cost, risk, and time — the three things a buyer optimizes.',
        memoPrompt: 'How do you frame the recommendation in business terms?',
        options: [
          { id: 'a', candidatePick: true, label: '"This lets you ship fixes to vehicles without a recall-style visit (lower cost), and if an update misbehaves it automatically reverts — so a bad update can’t brick a car (lower risk). It needs about [X] of integration work (time)." Offer the same in Korean.', blurb: 'Translate each choice into cost, risk, and time — no jargon.', scores: { translation: 93 }, consequence: 'A buyer decides on cost/risk/time, not protocols. Tying rollback to "a bad update can’t brick a car" makes the value visceral.', commentary: { why: 'The procurement lead optimizes cost, risk, and time — so I translate each technical decision into exactly those. "A/B partitions + signed images" becomes "a bad update auto-reverts, so it can’t brick a vehicle." That’s the same fact in the language that unlocks the budget.', tradeoff: 'I simplify aggressively, which can make engineers wince — so I keep the technical one-pager attached for the people who need it.' } },
          { id: 'b', label: 'Walk them through the architecture: MQTT QoS levels, A/B partitions, delta encoding, artifact signing.', blurb: 'Give them the real architecture.', scores: { translation: 45 }, consequence: 'Accurate but unusable for a budget decision; it stalls rather than enables the buy.' },
          { id: 'c', label: 'Tell them to trust the technical team’s recommendation.', blurb: 'Appeal to authority.', scores: { translation: 40 }, consequence: 'Skips the consultant’s entire value: making the decision legible to the person who signs.' },
          { id: 'd', label: 'Send the full technical one-pager and let them read it.', blurb: 'Hand over the doc.', scores: { translation: 42 }, consequence: 'No translation; a non-technical buyer can’t extract the cost/risk/time decision from a tech doc.' },
        ],
      },
      {
        id: 'stakeholders', index: 4, kind: 'routing', title: 'Stakeholder routing',
        scoresDimensions: ['stakeholder'],
        situation: 'To lock the recommendation and the connectivity decision, who do you involve before M3 ships?',
        assist: 'Assist: you need the client’s decision, an engineering sanity-check, and your senior consultant’s sign-off — not the whole org.',
        memoPrompt: 'Why these people, and not the others?',
        routingPrompt: 'Select everyone you’d involve before shipping M3 (choose all that apply):',
        routingTargets: [
          { id: 'client_proc', label: 'Client procurement lead', scope: 'Owns the budget decision & the connectivity assumption' },
          { id: 'eng_lead', label: 'Engineering lead (internal)', scope: 'Sanity-checks the technical reasoning' },
          { id: 'senior_consultant', label: 'Senior consultant', scope: 'Sign-off before it goes to the client' },
          { id: 'partner_vendor', label: 'OTA partner/vendor', scope: 'Only if a specific product is being recommended' },
          { id: 'whole_client_team', label: 'The client’s entire team', scope: 'Mass CC for visibility' },
          { id: 'legal', label: 'Legal', scope: 'No contract/IP trigger at this stage' },
        ],
        routingCorrect: ['client_proc', 'eng_lead', 'senior_consultant'],
      },
      {
        id: 'proposal', index: 5, kind: 'report', title: 'Recommendation one-pager',
        scoresDimensions: ['proposal'],
        situation: 'Write the M3 recommendation. Strong one-pagers state: the client’s goal/constraints, the recommended approach, why (in business terms: cost/risk/time), key assumptions, and the decision you need from the client + by when.',
        reportPrompt: 'Write your recommendation one-pager:',
        reportRubricHints: ['ota', 'rollback', 'risk', 'cost', 'recommend', 'assumption', 'decision', 'connectivity', 'next', 'client'],
      },
    ],
  },
};
