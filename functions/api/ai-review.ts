/* ===========================================================================
   Cloudflare Pages Function — POST /api/ai-review   (지시서 §5, §11)

   DeepSeek로 "작성된 보고서"만 자연어 리뷰한다. 점수에는 절대 관여하지 않는다
   (소스 오브 트루스는 클라이언트의 결정론적 로컬 엔진).

   - DEEPSEEK_API_KEY 가 설정되어 있으면 DeepSeek 호출 (JSON output mode).
   - 키가 없거나 호출 실패 시 → 로컬 폴백 리뷰 반환 (source: "local").
     => 채용담당자 앞에서 데모가 절대 깨지지 않는다.

   배포 시 Cloudflare Pages → Settings → Environment variables 에
   DEEPSEEK_API_KEY 를 추가하면 자동으로 활성화된다 (없어도 폴백으로 동작).
   =========================================================================== */

interface Env {
  DEEPSEEK_API_KEY?: string;
}

interface ReviewBody {
  selections?: Record<string, string>;
  reportText?: string;
  total?: number;
}

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function localReview(total: number, reportText: string): string {
  const hasReport = (reportText || '').trim().length > 0;
  const band =
    total >= 90
      ? 'You handled this like a seasoned ops lead — priorities, escalation, and recovery lined up.'
      : total >= 75
        ? 'Strong instincts. A couple of calls traded long-term risk for short-term comfort — tighten those.'
        : total >= 60
          ? 'You kept the lights on, but some calls under-weighted compliance exposure or proactive comms.'
          : 'This crisis bites. The misses are exactly the ones a real ops lead must avoid.';
  const reportNote = hasReport
    ? 'Your written report covers the situation; the strongest executive updates also name an owner, an ETA, and a "next update at" time.'
    : 'No written report was provided — in a real crisis, a 30-minute executive update is itself a deliverable.';
  return `${band}\n\n${reportNote}\n\nThe deterministic engine scored ${total}/100. The biggest differentiator in this scenario is routing the data-loss event as a mandatory Ops Manager report and reaching customers proactively.`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: ReviewBody = {};
  try {
    body = (await context.request.json()) as ReviewBody;
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const total = typeof body.total === 'number' ? body.total : 0;
  const reportText = (body.reportText || '').slice(0, 4000);
  const key = context.env.DEEPSEEK_API_KEY;

  // No key → local fallback (zero-cost default per §5).
  if (!key) {
    return json({ review: localReview(total, reportText), source: 'local' });
  }

  try {
    const prompt = `You are an experienced customer support operations manager reviewing a team lead's written situation report from a crisis simulation. The deterministic rubric already scored them ${total}/100 — DO NOT assign a score. Only review the WRITING of their report below: clarity, whether it names incidents/owners/impact/escalation/next-steps, and one concrete improvement. Be concise (max ~120 words), direct, and constructive.

Report:
"""
${reportText || '(no report submitted)'}
"""

Respond as JSON: {"review": "<your review text>"}`;

    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a concise, senior support operations manager. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 400,
      }),
    });

    if (!res.ok) throw new Error(`deepseek ${res.status}`);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? '';
    let review = '';
    try {
      review = (JSON.parse(content).review as string) || '';
    } catch {
      review = content; // model didn't return clean JSON — use raw text
    }
    if (!review.trim()) throw new Error('empty review');

    return json({ review: review.trim(), source: 'deepseek' });
  } catch {
    // Any failure → graceful local fallback. Demo never breaks (§13 Edge Cases).
    return json({ review: localReview(total, reportText), source: 'local' });
  }
};
