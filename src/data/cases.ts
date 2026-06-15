/* ===========================================================================
   Operations Queue seed — 시나리오 01 시점의 대기/진행 케이스.
   slaRemainingMin 은 SLA_MATRIX(ops-spec)의 resolution 타깃과 일관되게 설정됨.
   =========================================================================== */
import type { Priority } from './ops-spec';

export interface OpsCase {
  id: string;
  clientId: string;
  clientLabel: string;
  tier: 'VIP' | 'Standard';
  priority: Priority;
  subject: string;
  skillNeeded: 'billing' | 'technical' | 'deescalation';
  /** resolution SLA 잔여 시간(분). 0 이하 = 이미 위반. */
  slaRemainingMin: number;
  status: 'queued' | 'in_progress';
  assignee?: string;
  flag?: 'data_loss' | 'vip_clock' | 'new_logo';
}

export const CASES: OpsCase[] = [
  {
    id: 'case-3100',
    clientId: 'cli-a',
    clientLabel: 'Northwind Logistics (VIP-A)',
    tier: 'VIP',
    priority: 'P1',
    subject: 'Production order-sync outage blocking shipments',
    skillNeeded: 'technical',
    slaRemainingMin: 120, // VIP P1 resolution = 2h (ops-spec)
    status: 'queued',
    flag: 'vip_clock',
  },
  {
    id: 'case-3101',
    clientId: 'cli-b',
    clientLabel: 'Helio Health (VIP-B)',
    tier: 'VIP',
    priority: 'P1',
    subject: 'Critical config record deleted by agent — data recovery needed',
    skillNeeded: 'technical',
    slaRemainingMin: 95,
    status: 'in_progress',
    assignee: 'a-sam',
    flag: 'data_loss',
  },
  {
    id: 'case-3104',
    clientId: 'cli-b',
    clientLabel: 'Helio Health (VIP-B)',
    tier: 'VIP',
    priority: 'P2',
    subject: 'Webhook integration intermittently dropping events',
    skillNeeded: 'technical',
    slaRemainingMin: 210,
    status: 'in_progress',
    assignee: 'a-marco',
  },
  {
    id: 'case-3108',
    clientId: 'cli-c',
    clientLabel: 'Brightleaf Retail',
    tier: 'Standard',
    priority: 'P3',
    subject: 'Invoice discrepancy on last billing cycle',
    skillNeeded: 'billing',
    slaRemainingMin: 300,
    status: 'queued',
  },
  {
    id: 'case-3109',
    clientId: 'cli-c',
    clientLabel: 'Brightleaf Retail',
    tier: 'Standard',
    priority: 'P3',
    subject: 'Aging: user cannot reset SSO password',
    skillNeeded: 'technical',
    slaRemainingMin: 140,
    status: 'queued',
  },
  {
    id: 'case-3112',
    clientId: 'cli-d',
    clientLabel: 'Orbit Studios',
    tier: 'Standard',
    priority: 'P3',
    subject: 'Onboarding question — first-week new logo',
    skillNeeded: 'deescalation',
    slaRemainingMin: 380,
    status: 'queued',
    flag: 'new_logo',
  },
];

/** 큐 깊이 = queued 케이스 수. Command Center에 표시. */
export const QUEUE_DEPTH = CASES.filter((c) => c.status === 'queued').length;
