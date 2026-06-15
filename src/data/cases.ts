/* ===========================================================================
   Operations Queue seed — "Work Items" (our term for tickets).
   각 항목은 Rule Assist(우리 용어의 automation) 신호 + 제안 액션을 갖는다.
   AI는 신호/검토 포인트를 제안하고, 최종 판단은 사용자(리더)가 한다.
   deadlineMin 은 SLA_MATRIX 와 일관.
   =========================================================================== */
import type { Priority } from './ops-spec';

export type Complexity = 'Low' | 'Med' | 'High';

export interface WorkItem {
  id: string;
  clientLabel: string;
  tier: 'VIP' | 'Standard';
  priority: Priority;
  subject: string;
  impact: string;
  complexity: Complexity;
  skillNeeded: 'billing' | 'technical' | 'deescalation';
  /** Response Deadline remaining, minutes (≤0 = breached). */
  deadlineMin: number;
  status: 'queued' | 'in_progress';
  assignee?: string; // team member id
  /** Rule Assist signal */
  riskSignal: string;
  /** Rule Assist suggested action (a suggestion, not a decision) */
  suggestedAction: string;
  flag?: 'data_loss' | 'vip_clock' | 'duplicate' | 'new_logo' | 'amount_mismatch';
}

export const WORK_ITEMS: WorkItem[] = [
  {
    id: 'WI-3100', clientLabel: 'Northwind Logistics (VIP-A)', tier: 'VIP', priority: 'P1',
    subject: 'Production order-sync outage blocking shipments',
    impact: 'Shipments halted; renewal in 6 weeks', complexity: 'High', skillNeeded: 'technical',
    deadlineMin: 120, status: 'queued', flag: 'vip_clock',
    riskSignal: 'VIP P1 · breach in ~2h · renewal-sensitive',
    suggestedAction: 'Assign deepest technical skill; send proactive client update',
  },
  {
    id: 'WI-3101', clientLabel: 'Helio Health (VIP-B)', tier: 'VIP', priority: 'P1',
    subject: 'Critical config record deleted by agent — recovery needed',
    impact: 'Regulated data; possible compliance exposure', complexity: 'High', skillNeeded: 'technical',
    deadlineMin: 95, status: 'in_progress', assignee: 'jae', flag: 'data_loss',
    riskSignal: 'DATA LOSS · compliance trigger · mandatory report',
    suggestedAction: 'Escalate to Ops Manager (mandatory); supervise recovery',
  },
  {
    id: 'WI-3104', clientLabel: 'Helio Health (VIP-B)', tier: 'VIP', priority: 'P2',
    subject: 'Webhook integration intermittently dropping events',
    impact: 'Partial data sync gaps', complexity: 'Med', skillNeeded: 'technical',
    deadlineMin: 210, status: 'in_progress', assignee: 'marco',
    riskSignal: 'VIP P2 · aging',
    suggestedAction: 'Keep current owner unless reassigned for P1',
  },
  {
    id: 'WI-3108', clientLabel: 'Brightleaf Retail', tier: 'Standard', priority: 'P3',
    subject: 'Invoice discrepancy on last billing cycle',
    impact: 'Billing trust', complexity: 'Low', skillNeeded: 'billing',
    deadlineMin: 300, status: 'queued', flag: 'amount_mismatch',
    riskSignal: 'Amount mismatch vs prior cycle',
    suggestedAction: 'Verify against history before any credit',
  },
  {
    id: 'WI-3109', clientLabel: 'Brightleaf Retail', tier: 'Standard', priority: 'P3',
    subject: 'User cannot reset SSO password (aging)',
    impact: 'User locked out', complexity: 'Low', skillNeeded: 'technical',
    deadlineMin: 140, status: 'queued',
    riskSignal: 'Aging toward SLA',
    suggestedAction: 'Good fit for a new hire on templated steps',
  },
  {
    id: 'WI-3112', clientLabel: 'Orbit Studios', tier: 'Standard', priority: 'P3',
    subject: 'Onboarding question — first-week new logo',
    impact: 'First impression', complexity: 'Low', skillNeeded: 'deescalation',
    deadlineMin: 380, status: 'queued', flag: 'new_logo',
    riskSignal: 'New logo · first week',
    suggestedAction: 'Warm tone; assign de-escalation strength',
  },
  {
    id: 'WI-3115', clientLabel: 'Brightleaf Retail', tier: 'Standard', priority: 'P3',
    subject: 'Duplicate follow-up: "any update?" (x3)',
    impact: 'Customer frustration', complexity: 'Low', skillNeeded: 'deescalation',
    deadlineMin: 90, status: 'queued', flag: 'duplicate',
    riskSignal: 'Possible duplicate of WI-3109',
    suggestedAction: 'Merge with WI-3109; single owner replies once',
  },
  {
    id: 'WI-3120', clientLabel: 'Vertex Manufacturing', tier: 'Standard', priority: 'P2',
    subject: 'Refund request above agent authority ($1,400)',
    impact: 'Refund authority exceeded', complexity: 'Med', skillNeeded: 'billing',
    deadlineMin: 160, status: 'queued',
    riskSignal: 'Exceeds agent refund authority',
    suggestedAction: 'Route approval to Team Lead per policy',
  },
];

export const QUEUE_DEPTH = WORK_ITEMS.filter((w) => w.status === 'queued').length;
/** 대화내역의 "하루 티켓 480건" 운영 규모 — Command Center에 표시. */
export const DAILY_VOLUME = 480;
export const VIP_COUNT = 7;
