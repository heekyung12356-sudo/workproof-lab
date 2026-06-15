import type { Company } from './types';

/* tQCS Limited — Associate Consultant (Project Management / Business Development).
   Unofficial candidate demo tailored to the public job description + tQCS's real
   offering (Hong Kong embedded software consultancy; APAC partner for Mender OTA,
   KUESA/Qt 3D, Slint, GLAS.ai; in-vehicle networking / TSN; automotive·industrial·
   defense). Not affiliated with tQCS; all clients/data are fictional. */

export const TQCS: Company = {
  slug: 'tqcs',
  visible: true,
  name: 'tQCS',
  roleTitle: 'Associate Consultant (PM / Business Development)',
  tagline: 'A real consulting engagement — coordinate the project, position the right partner technology (Mender OTA), and translate it into business value for the client.',
  accent: 'iris',
  wordmark: 'tQCS · Embedded Advisory (HK)',
  consoleName: 'Engagement Console',
  org: 'tQCS · Hong Kong · APAC',
  about:
    'Associate Consultant support across project coordination, technical consulting, and business development for tQCS — a Hong Kong–based embedded software consultancy and APAC solution partner (Mender for OTA updates, KUESA/Qt and Slint for UI, GLAS.ai, time-sensitive in-vehicle networking) serving automotive, industrial, medical and defense clients. This demo simulates a live engagement: keep the project on track, position and evaluate the partner technology on the client’s real constraints, and translate it for a non-technical buyer — programming mastery not required, learning agility and clear communication are.',
  source: 'Public job description (Associate Consultant, PM/BD) + tqcs.io',
  hook: 'I built a working consulting-engagement simulation around a Mender OTA rollout for an automotive client — project coordination, fit-to-constraints evaluation, and translating it for a non-technical buyer — so you can see how I think, not just what I claim.',
  requirements: [
    { req: 'Coordinate consulting/integration projects; track milestones (JIRA/Git/Gerrit)', proof: 'Step 1 is a slipping-milestone call inside a JIRA-style engagement board.' },
    { req: 'Evaluate embedded architectures; research emerging tech', proof: 'Step 2 positions Mender’s OTA capabilities against the client’s real constraints.' },
    { req: 'Quickly understand unfamiliar technologies (C/C++/Rust, OTA, IVN, SDV)', proof: 'The task rewards reasoning from constraints, not memorized expertise.' },
    { req: 'Translate complex tech into business implications', proof: 'Step 3 explains the recommendation to a non-technical procurement lead.' },
    { req: 'Prepare proposals, presentations, solution docs', proof: 'Step 5 writes the recommendation one-pager the senior consultant takes to the client.' },
    { req: 'Support partner ecosystem & business development', proof: 'The engagement is framed as positioning a partner solution (Mender) — BD in practice.' },
    { req: 'Work independently in a remote, international environment', proof: 'You make coordination calls async across distributed teams (HK/Korea/Vietnam).' },
    { req: 'English + Korean communication', proof: 'Client comms are framed bilingually; the writing reads clean in English.' },
  ],
  dimensions: [
    { key: 'coordination', label: 'Project Coordination', weight: 20, criteria: 'Surfacing blockers, sequencing, keeping milestones honest.' },
    { key: 'learning', label: 'Technical Learning Agility', weight: 20, criteria: 'Reasoning about unfamiliar tech from constraints.' },
    { key: 'translation', label: 'Tech → Business Translation', weight: 20, criteria: 'Making implications clear to non-technical buyers.' },
    { key: 'analysis', label: 'Research & Analysis', weight: 14, criteria: 'Structured fit-to-requirements evaluation.' },
    { key: 'proposal', label: 'Proposal Quality', weight: 14, criteria: 'Clear, decision-ready recommendation.' },
    { key: 'stakeholder', label: 'Stakeholder Management', weight: 12, criteria: 'Right people, right info, right time.' },
  ],
  kpis: [
    { label: 'Milestones on track', value: '4/6', sub: 'AutoCo OTA engagement', tone: 'iris' },
    { label: 'Deliverables due', value: '2', sub: 'this week', tone: 'fog' },
    { label: 'Open risks', value: '3', sub: '1 high', tone: 'fog' },
    { label: 'Partner', value: 'Mender', sub: 'OTA (APAC)', tone: 'iris' },
    { label: 'Client NPS', value: '—', sub: 'set by your handling', tone: 'iris' },
    { label: 'Proposal SLA', value: '48h', sub: 'to recommendation', tone: 'fog' },
  ],
  queueTitle: 'Engagement Tasks (JIRA-style)',
  queueNote: 'Assist surfaces research starting points — you judge and decide.',
  queue: [
    { id: 'ENG-204', primary: 'Mender OTA rollout one-pager for AutoCo (SDV fleet)', secondary: 'Deliverable · due in 2 days', tag: 'HIGH', tagTone: 'rose', right: 'blocked', signal: 'Assist: blocked on a client connectivity/cadence decision' },
    { id: 'ENG-198', primary: 'OTA update-strategy fit: full vs delta + A/B rollback', secondary: 'Research · Mender capabilities', tag: 'MED', tagTone: 'amber', right: 'in progress', signal: 'Assist: gather constraints before evaluating' },
    { id: 'ENG-211', primary: 'Kickoff notes + RACI for IndustrialCo HMI (Qt/KUESA)', secondary: 'Coordination', tag: 'MED', tagTone: 'amber', right: 'due Fri', signal: '' },
    { id: 'ENG-220', primary: 'Partner intro deck — Slint UI for resource-limited HMI', secondary: 'Business development', tag: 'LOW', tagTone: 'fog', right: 'next week', signal: '' },
    { id: 'ENG-187', primary: 'In-vehicle networking (TSN) discovery memo', secondary: 'Research', tag: 'LOW', tagTone: 'fog', right: 'backlog', signal: '' },
  ],
  panelTitle: 'AutoCo OTA engagement — milestones',
  panel: [
    { primary: 'M1 Discovery & constraints', progress: 100, status: 'done', statusTone: 'mint' },
    { primary: 'M2 Mender fit & update strategy', progress: 70, status: 'in progress', statusTone: 'iris' },
    { primary: 'M3 Recommendation one-pager', progress: 20, status: 'at risk', statusTone: 'rose' },
    { primary: 'M4 Client review & decision', progress: 0, status: 'pending', statusTone: 'fog' },
    { primary: 'M5 Integration & PoC plan', progress: 0, status: 'pending', statusTone: 'fog' },
  ],
  scenario: {
    id: 'mender-ota-engagement',
    name: 'Automotive OTA rollout — Mender fit & strategy',
    tagline: 'AutoCo wants an OTA update strategy for a safety-critical embedded fleet. tQCS is the APAC Mender partner. A milestone is slipping and an engineer is blocked.',
    clock: 'AutoCo · Recommendation due in 48h',
    briefing: `Client: AutoCo, a global automotive maker, exploring an OTA (over-the-air) update strategy for an embedded fleet (software-defined vehicle context). Safety-critical, intermittent connectivity, robust rollback is non-negotiable, and updates must reach peripheral ECUs/TCUs — not just the main gateway.

tQCS is the APAC solution partner for Mender, so this engagement is also a business-development motion: position Mender well, honestly, against the client’s constraints.

Your senior consultant is traveling and asks you to move it forward:
• Milestone M3 (the recommendation one-pager, due in 48h) is at risk.
• An engineer is blocked waiting on a client decision about connectivity/update cadence.
• You are NOT expected to be an embedded expert — coordinate, learn fast, evaluate on the merits, and translate it for the client.

Make the calls. Record your reasoning.`,
    liveClocks: [{ label: 'Recommendation deadline', startMin: 240 }],
    steps: [
      {
        id: 'coordination', index: 1, kind: 'choice', title: 'Unblock the milestone',
        scoresDimensions: ['coordination'],
        situation: 'M3 is at risk because an engineer is blocked on a client connectivity/update-cadence decision, and the senior consultant is traveling. What do you do first?',
        assist: 'Assist: the blocker is one client decision (assume intermittent connectivity + scheduled update windows?) — the rest of the analysis can proceed in parallel.',
        memoPrompt: 'How do you keep M3 alive, and what did you decide to do in parallel?',
        options: [
          { id: 'a', candidatePick: true, label: 'Send the client one crisp decision request (with a sensible default + deadline), log the dependency in JIRA so the team sees it, and let the engineer proceed on the un-blocked 80% using the default assumption so M3 isn’t hostage to one reply.', blurb: 'Drive the decision, unblock in parallel with a default, make the dependency visible.', scores: { coordination: 93 }, consequence: 'Turns an open-ended block into a time-boxed decision while keeping the analysis moving — classic remote-async coordination.', commentary: { why: 'A blocker that’s really one decision shouldn’t freeze a deliverable. I make the decision easy for the client (clear ask + recommended default + deadline), record the dependency in JIRA, and continue on everything that doesn’t depend on the answer. Momentum is the consultant’s job.', tradeoff: 'Proceeding on a default risks light rework if the client picks the other option — acceptable versus missing M3, and I flag it as an explicit assumption.' } },
          { id: 'b', label: 'Wait for the senior consultant to return and decide.', blurb: 'Escalate up and pause.', scores: { coordination: 45 }, consequence: 'Stalls a 48h deliverable on someone traveling; the engagement loses momentum the client notices.' },
          { id: 'c', label: 'Tell the engineer to pick any assumption and keep going; sort it later.', blurb: 'Just keep moving.', scores: { coordination: 58 }, consequence: 'Momentum is good, but an undocumented assumption on a safety-critical client invites rework and confusion.' },
          { id: 'd', label: 'Ask the client to extend the M3 deadline.', blurb: 'Reset expectations.', scores: { coordination: 40 }, consequence: 'Slipping the first real deliverable over a one-line decision signals weak coordination early in the relationship.' },
        ],
      },
      {
        id: 'evaluation', index: 2, kind: 'choice', title: 'Evaluate the OTA strategy (Mender fit)',
        scoresDimensions: ['learning', 'analysis'],
        situation: 'Position Mender honestly against AutoCo’s constraints: safety-critical, intermittent connectivity, guaranteed rollback, and updates that must also reach peripheral ECUs/TCUs. You’re not an OTA expert — reason from the constraints and Mender’s actual capabilities.',
        assist: 'Assist: Mender’s relevant features — robust failsafe rollback, efficient/targeted (delta-style) updates with less data per update, state scripts for custom install control, and partial/proxy deployment to peripheral devices (MCU/TCU/ECU) via a microservices API.',
        memoPrompt: 'Which constraint maps to which Mender capability — and where are the gaps/assumptions?',
        options: [
          { id: 'a', candidatePick: true, label: 'Map each constraint to a capability: rollback → Mender’s failsafe A/B rollback; intermittent links → efficient/delta-style targeted updates (less data per update); peripheral ECUs → Mender’s proxy/partial deployment to MCU/TCU/ECU; safety/audit → controlled, scripted install + signed artifacts — and name the assumptions to verify with engineering.', blurb: 'Constraint → Mender capability, with gaps named — honest BD, not overselling.', scores: { learning: 93, analysis: 92 }, consequence: 'Shows you can position a partner solution to real requirements and reason from first principles — the role’s core skill.', commentary: { why: 'As Mender’s APAC partner I want to position it well, but credibly. I map each non-negotiable to a concrete Mender capability (failsafe rollback, delta-style efficiency for poor links, proxy deployment to ECUs) and explicitly name what still needs validation. Honest fit beats hype — it’s what earns the next engagement.', tradeoff: 'I don’t claim Mender is a fit for everything; flagging gaps risks a weaker-looking pitch but protects the relationship and our credibility.' } },
          { id: 'b', label: 'Recommend Mender for everything because it’s our partner product.', blurb: 'Lead with the partnership.', scores: { learning: 50, analysis: 48 }, consequence: 'Partner-first instead of fit-first; if it doesn’t match the constraints, it burns client trust and the partnership.' },
          { id: 'c', label: 'Defer entirely to the engineer’s preference.', blurb: 'Let engineering decide.', scores: { learning: 55, analysis: 52 }, consequence: 'Consult them, yes — but the consultant must reason about and explain the choice, not just relay it.' },
          { id: 'd', label: 'Ask the client which OTA tool they want.', blurb: 'Let the client choose.', scores: { learning: 35, analysis: 38 }, consequence: 'They hired advisory because they don’t know; this abdicates the value you’re there to add.' },
        ],
      },
      {
        id: 'translation', index: 3, kind: 'choice', title: 'Translate for the business',
        scoresDimensions: ['translation'],
        situation: 'AutoCo’s procurement lead (non-technical, owns budget) asks: "Why does this matter and what are we actually buying?" How do you explain it?',
        assist: 'Assist: tie each technical choice to cost, risk, and time — the three things a buyer optimizes.',
        memoPrompt: 'How do you frame the recommendation in business terms?',
        options: [
          { id: 'a', candidatePick: true, label: '"You can ship fixes and features to vehicles in the field instead of a workshop recall (lower cost), and if an update misbehaves it automatically rolls back — so a bad update can’t brick a car (lower risk). Standing it up is about [X] of integration (time)." Offer the same in Korean.', blurb: 'Translate each choice into cost, risk, and time — no jargon.', scores: { translation: 93 }, consequence: 'A buyer decides on cost/risk/time, not protocols. Tying rollback to "a bad update can’t brick a car" makes the value visceral.', commentary: { why: 'The procurement lead optimizes cost, risk, and time — so I translate each technical capability into exactly those. "Failsafe A/B rollback" becomes "a bad update auto-reverts, so it can’t brick a vehicle." Same fact, in the language that unlocks budget.', tradeoff: 'I simplify aggressively, which can make engineers wince — so I keep the technical one-pager attached for those who need it.' } },
          { id: 'b', label: 'Walk them through the architecture: A/B partitions, delta encoding, state scripts, proxy ECU deployment.', blurb: 'Give them the real architecture.', scores: { translation: 45 }, consequence: 'Accurate but unusable for a budget decision; it stalls rather than enables the buy.' },
          { id: 'c', label: 'Tell them to trust the technical team’s recommendation.', blurb: 'Appeal to authority.', scores: { translation: 40 }, consequence: 'Skips the consultant’s entire value: making the decision legible to the person who signs.' },
          { id: 'd', label: 'Send the full technical one-pager and let them read it.', blurb: 'Hand over the doc.', scores: { translation: 42 }, consequence: 'No translation; a non-technical buyer can’t extract the cost/risk/time decision from a tech doc.' },
        ],
      },
      {
        id: 'stakeholders', index: 4, kind: 'routing', title: 'Stakeholder routing',
        scoresDimensions: ['stakeholder'],
        situation: 'To lock the recommendation and the connectivity decision, who do you involve before M3 ships?',
        assist: 'Assist: you need the client’s decision, an engineering sanity-check, the partner (Mender) for a feasibility point, and your senior consultant’s sign-off — not the whole org.',
        memoPrompt: 'Why these people, and not the others?',
        routingPrompt: 'Select everyone you’d involve before shipping M3 (choose all that apply):',
        routingTargets: [
          { id: 'client_proc', label: 'Client procurement lead', scope: 'Owns the budget decision & the connectivity assumption' },
          { id: 'eng_lead', label: 'Engineering lead (internal)', scope: 'Sanity-checks the technical reasoning' },
          { id: 'senior_consultant', label: 'Senior consultant', scope: 'Sign-off before it goes to the client' },
          { id: 'mender_partner', label: 'Mender partner contact', scope: 'Confirms a feasibility/licensing point for the pitch' },
          { id: 'whole_client_team', label: 'The client’s entire team', scope: 'Mass CC for visibility' },
          { id: 'legal', label: 'Legal', scope: 'No contract/IP trigger at this stage' },
        ],
        routingCorrect: ['client_proc', 'eng_lead', 'senior_consultant', 'mender_partner'],
      },
      {
        id: 'proposal', index: 5, kind: 'report', title: 'Recommendation one-pager',
        scoresDimensions: ['proposal'],
        situation: 'Write the M3 recommendation. Strong one-pagers state: the client’s goal/constraints, the recommended approach (and why Mender fits, honestly), the business case (cost/risk/time), key assumptions, and the decision you need from the client + by when.',
        reportPrompt: 'Write your recommendation one-pager:',
        reportRubricHints: ['ota', 'mender', 'rollback', 'risk', 'cost', 'recommend', 'assumption', 'decision', 'connectivity', 'client'],
      },
    ],
  },
};
