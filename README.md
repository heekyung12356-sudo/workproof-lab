# WorkProof Lab — OpsLeader

**A realistic operations leadership simulation for role-ready candidates.**

> Rehearse the work. Prove the judgment. Earn the opportunity.

A no-login, playable ops-crisis simulation built to prove job-ready operational
judgment for remote **Support Team Lead / Operations Manager** roles — staffing
shortage, VIP SLA risk, customer escalation, a junior agent's data mistake, and
executive reporting pressure. Built with Astro + React on Cloudflare Pages.

Implements `docs/지시서.md` v1.2 in full.

---

## ⚡ Before you ship: 3 fields to personalize

Open **`src/utils/constants.ts`** and edit the `IDENTITY` block — this is the
single source of truth for your name and links across the whole site (résumé,
outreach, footer, meta tags):

```ts
export const IDENTITY = {
  fullName: 'Heekyung',                                    // ← your name
  github:   'https://github.com/your-username',            // ← your GitHub
  linkedin: 'https://www.linkedin.com/in/your-handle',     // ← your LinkedIn
  email:    'heekyung12356@gmail.com',                     // already set
  liveUrl:  'https://workproof-lab.pages.dev',             // after deploy
  ...
};
```

(Optional) After deploy, paste your Cloudflare Web Analytics token into
`CF_ANALYTICS_TOKEN` in the same file to enable cookieless tracking (§19).

---

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → ./dist
npm run preview    # serve the built site
npx astro check    # type-check (0 errors expected)
```

> `npm run preview` serves the static site only. The `/api/ai-review` route runs
> in production on Cloudflare; locally it gracefully falls back to a local review,
> which is the intended behavior.

---

## What's inside (maps to the spec)

| Spec section | Implementation |
|---|---|
| §2 Hero + 3 CTAs | `src/pages/index.astro`, `src/utils/constants.ts` |
| §8 Scenario engine (state machine) | `src/data/scenarios/scenario01.ts`, `src/components/demo/OpsLeaderDemo.tsx` |
| §8.5 Ops authenticity (KPI/SLA/escalation) | `src/data/ops-spec.ts`, `src/data/team.ts`, `src/data/clients.ts`, `src/data/cases.ts` |
| §8.5 Causal Command Center | `src/engines/opsState.ts`, `src/components/demo/CommandCenter.tsx` |
| §9 Deterministic scoring rubric | `src/data/scoring.ts`, `src/engines/scoring.ts` |
| §10a Recruiter Result (dynamic) | `src/components/demo/ResultReport.tsx` + `src/components/ui/RadarChart.tsx` |
| §10b Architect's Commentary (trust artifact, PDF) | `src/data/commentary.ts`, `src/pages/how-id-handle-it.astro` |
| §13 Case Study | `src/pages/case-study.astro` |
| §14/§19 Resume bridge + outreach | `src/pages/resume.astro` |
| §5 AI-with-fallback | `functions/api/ai-review.ts` |
| §10 Session recovery (localStorage) | `OpsLeaderDemo.tsx` |
| §20 a11y / SEO / OG / JSON-LD / 404 | `src/layouts/Base.astro`, `src/pages/404.astro` |

### Design principles enforced (§17)
- No "Coming Soon", no dead buttons — every CTA works.
- No real company/customer names; KPIs use industry-standard definitions only.
- No self-awarded "92/100 Ready" badge as the hero artifact. The scoring engine
  grades **the player** (the recruiter); the candidate's evidence is the
  transparent reasoning + trade-offs in *How I'd Handle It*.
- Every on-screen number is computed from seed data, never decorative.

---

## Deploy to Cloudflare Pages (free)

1. Push this repo to GitHub (`workproof-lab`).
2. Cloudflare Dashboard → **Pages** → **Create a project** → connect the repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Deploy.** The root `/functions` directory deploys automatically — the AI
   review route is live at `/api/ai-review`.
5. (Optional) **Settings → Environment variables →** add `DEEPSEEK_API_KEY` to
   enable real DeepSeek review. Without it, the route returns a local fallback
   (zero cost, never breaks).
6. (Optional) **Web Analytics →** enable for your Pages domain, copy the token
   into `CF_ANALYTICS_TOKEN` in `src/utils/constants.ts`, and redeploy.
7. (Optional) Add a custom domain.

> Cloudflare account on file: `heekyung12356@gmail.com`
> (account id `3283e5d5e92bf1aa3ac13dbcbaf6ed48`; domains `securefirst.dev`, `hksolution.dev`).

---

## Stack

- **Astro 5** (static, zero-JS by default) + a single **React 19** island for the demo
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Cloudflare Pages** static hosting + **Pages Functions** for the optional AI route
- No chart library — radar chart is hand-rolled SVG (§12)

## Extending

- Add scenarios 02–04 (§20) as new files in `src/data/scenarios/` following the
  `DecisionStep` shape, and a scenario picker in the demo.
- Swap DeepSeek for Cloudflare Workers AI in `functions/api/ai-review.ts` if preferred.
