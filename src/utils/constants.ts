/* ===========================================================================
   WorkProof Lab — single source of truth for identity, links, and copy.

   ★ 채용 성공을 위해 아래 IDENTITY 값만 본인 정보로 바꾸면 전 사이트에 반영됩니다.
     (이력서/아웃리치/푸터/메타태그가 모두 이 파일을 참조합니다 — 지시서 §17 "하드코딩 흩뿌리기 금지")
   =========================================================================== */

export const IDENTITY = {
  /** 사이트와 이력서 브리지에 표시될 이름. 본인 이름으로 교체하세요. */
  fullName: 'Heekyung',
  /** 한 줄 포지셔닝(헤드라인). LinkedIn Headline과 동일하게 맞추면 좋습니다. */
  tagline: 'CS → Ops Leadership | I build the operational systems I’d run',
  email: 'heekyung12356@gmail.com',
  github: 'https://github.com/heekyung12356-sudo/workproof-lab',
  /** ★ 본인 LinkedIn URL로 교체하세요 (아직 미확인). */
  linkedin: 'https://www.linkedin.com/in/your-handle',
  /** 배포 후 실제 도메인. Cloudflare Pages 기본은 *.pages.dev. */
  liveUrl: 'https://workproof-lab.pages.dev',
} as const;

export const SITE = {
  name: 'WorkProof Lab',
  demoName: 'WorkProof Lab',
  subtitle: 'A tailored, playable simulation of the exact role — one per job posting.',
  subtitleKo: '지원하는 직무 그대로를 시뮬레이션으로 — 공고당 하나씩',
  description:
    'WorkProof Lab turns a specific job description into a working, playable simulation of that exact role. Recruiters can do the real task in 3 minutes and see job-ready judgment — proof, not claims.',
} as const;

/** 채용 타깃 직무 (랜딩 Trust Signals 뱃지) — 지시서 §0 */
export const TARGET_ROLES: string[] = [
  'Remote Customer Support Team Lead',
  'Support Operations Manager',
  'Customer Operations Manager',
  'BPO Operations Team Lead',
  'Trust & Safety Operations Lead',
  'Customer Success Operations Manager',
  'AI Operations Specialist',
  'Workflow Automation / Operations Analyst',
  'Support QA Lead',
  'Escalation Manager',
];

export const HERO = {
  // 지시서 §2 Hero Copy / Sub Copy
  lines: ['Rehearse the work.', 'Prove the judgment.', 'Earn the opportunity.'],
  sub:
    'WorkProof Lab is a realistic operations leadership simulation I designed and built. Step into the same crisis a support team lead faces — staffing shortage, VIP SLA risk, customer escalation, a junior agent’s mistake, executive reporting pressure — and make the calls yourself. Then see exactly how I’d handle it, and why.',
} as const;

/** 3개 진입점 CTA — 지시서 §2 */
export const CTAS = {
  play: { label: 'Try the Ops Crisis Yourself', href: '/demo/opsleader', note: 'No login. Play it in ~3 min.' },
  commentary: { label: "See How I'd Handle It", href: '/how-id-handle-it', note: 'My reasoning + trade-offs.' },
  caseStudy: { label: 'Read the System Case Study', href: '/case-study', note: 'How I designed it.' },
} as const;

/** localStorage 키 — 콘솔 세션 복구 */
export const STORAGE_KEY = 'workproof.console.v1';

/** Cloudflare Web Analytics 토큰. 배포 후 대시보드에서 발급받아 채우면 트래킹 활성화 (§19). */
export const CF_ANALYTICS_TOKEN = ''; // e.g. 'xxxxxxxxxxxxxxxxxxxxxxxx'
