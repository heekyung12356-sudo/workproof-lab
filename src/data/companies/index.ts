import type { Company } from './types';
import { NETGEAR } from './netgear';
import { TQCS } from './tqcs';

/* Company registry — add a target = add a file + one line here. */
export const COMPANIES: Company[] = [NETGEAR, TQCS];

export function getCompany(slug: string): Company | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}

export type { Company } from './types';
