import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: process.env.GITHUB_ACTIONS === 'true' ? 'https://ivan-kashuba-rd.github.io' : 'https://physchem-for-humanity.pages.dev',
  base: process.env.GITHUB_ACTIONS === 'true' ? '/physchem-for-humanity' : '/',
  integrations: [mdx(), react()],
  i18n: { locales: ['en', 'ru'], defaultLocale: 'en', routing: { prefixDefaultLocale: true } }
});
