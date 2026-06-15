/* Static accent class maps (Tailwind JIT-safe — no dynamic class names). */
import type { AccentKey } from '../data/companies/types';

export const ACCENT: Record<AccentKey, {
  text: string; border: string; bg: string; soft: string; btn: string; dot: string;
}> = {
  sky:  { text: 'text-sky',  border: 'border-sky/50',  bg: 'bg-sky/10',  soft: 'bg-sky/5',  btn: 'bg-sky',  dot: 'bg-sky' },
  mint: { text: 'text-mint', border: 'border-mint/50', bg: 'bg-mint/10', soft: 'bg-mint/5', btn: 'bg-mint', dot: 'bg-mint' },
  iris: { text: 'text-iris', border: 'border-iris/50', bg: 'bg-iris/10', soft: 'bg-iris/5', btn: 'bg-iris', dot: 'bg-iris' },
  amber:{ text: 'text-amber',border: 'border-amber/50',bg: 'bg-amber/10',soft: 'bg-amber/5',btn: 'bg-amber',dot: 'bg-amber' },
  rose: { text: 'text-rose', border: 'border-rose/50', bg: 'bg-rose/10', soft: 'bg-rose/5', btn: 'bg-rose', dot: 'bg-rose' },
};

export const TONE_TEXT: Record<string, string> = {
  sky: 'text-sky', mint: 'text-mint', iris: 'text-iris', amber: 'text-amber', rose: 'text-rose', fog: 'text-fog-300',
};
export const TONE_CHIP: Record<string, string> = {
  sky: 'bg-sky/15 text-sky', mint: 'bg-mint/15 text-mint', iris: 'bg-iris/15 text-iris',
  amber: 'bg-amber/15 text-amber', rose: 'bg-rose/15 text-rose', fog: 'bg-ink-700 text-fog-400',
};
