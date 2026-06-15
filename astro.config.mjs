// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// 1차 범위: DB 없는 정적 사이트 + 로컬 룰 기반 평가.
// DeepSeek 호출 같은 서버리스 엔드포인트는 루트 /functions (Cloudflare Pages Functions)에서 처리.
// 따라서 Astro 자체는 output:'static' 만으로 충분하며 Cloudflare 어댑터가 불필요하다.
// (지시서 §11 기술 정확성 주의 참조)
export default defineConfig({
  output: 'static',
  site: 'https://workproof-lab.pages.dev',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
