/* ===========================================================================
   Client seed — 가명. 실제 회사명/고객명 사용 금지 (지시서 §17).
   tier 는 SLA 매트릭스(ops-spec)와 매핑된다.
   =========================================================================== */
import type { ClientTier } from './ops-spec';

export interface Client {
  id: string;
  name: string;
  tier: ClientTier;
  /** Monthly recurring revenue band — relative weight, not a real figure. */
  arrBand: 'Enterprise' | 'Growth' | 'SMB';
  contact: string;
  history: string;
}

export const CLIENTS: Client[] = [
  {
    id: 'cli-a',
    name: 'Northwind Logistics (VIP-A)',
    tier: 'VIP',
    arrBand: 'Enterprise',
    contact: 'Dana — Director of Ops',
    history: 'Renewal review in 6 weeks. Two prior P1s resolved on time. Low patience for surprises.',
  },
  {
    id: 'cli-b',
    name: 'Helio Health (VIP-B)',
    tier: 'VIP',
    arrBand: 'Enterprise',
    contact: 'Marcus — IT Lead',
    history: 'Handles regulated patient-adjacent data. Junior agent deleted a config record this morning.',
  },
  {
    id: 'cli-c',
    name: 'Brightleaf Retail',
    tier: 'Standard',
    arrBand: 'Growth',
    contact: 'Support inbox',
    history: 'Three open P3s. Patient but two are aging toward SLA.',
  },
  {
    id: 'cli-d',
    name: 'Orbit Studios',
    tier: 'Standard',
    arrBand: 'SMB',
    contact: 'Support inbox',
    history: 'New logo, first month. First impression matters.',
  },
];
