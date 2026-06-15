/* ===========================================================================
   WorkProof Lab — own brand terminology for the virtual ops console "CommandDesk".
   대화내역 기준: 공개 SaaS(Zendesk/Salesforce 등)의 "복제"가 아니라, 여러 운영 툴에
   공통으로 반복되는 업무 구조를 추출해 우리 용어/UI로 재설계한다. (법적·브랜드 안전)
   =========================================================================== */

export const CONSOLE = {
  name: 'CommandDesk',
  by: 'WorkProof Lab',
  org: 'APAC Customer Operations',
  tz: 'Asia/Seoul (KST)',
} as const;

/** 일반 SaaS 개념 → 우리 브랜드 용어 (Case Study의 glossary에 노출). */
export const GLOSSARY: { generic: string; ours: string }[] = [
  { generic: 'Ticket', ours: 'Work Item / Case' },
  { generic: 'Queue', ours: 'Operations Queue' },
  { generic: 'Agent', ours: 'Team Member' },
  { generic: 'SLA', ours: 'Service Promise / Response Deadline' },
  { generic: 'Escalation', ours: 'Leadership Alert' },
  { generic: 'Internal Note', ours: 'Operator Note' },
  { generic: 'Customer Reply', ours: 'Client Update' },
  { generic: 'Dashboard', ours: 'Command Center' },
  { generic: 'Workflow', ours: 'Resolution Path' },
  { generic: 'CSAT', ours: 'Experience Signal' },
  { generic: 'QA Score', ours: 'Quality Signal' },
  { generic: 'Macro / Template', ours: 'Response Playbook' },
  { generic: 'Automation', ours: 'Rule Assist' },
  { generic: 'Report', ours: 'WorkProof Report' },
];
