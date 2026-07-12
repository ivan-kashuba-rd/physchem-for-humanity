import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://physchem-for-humanity.pages.dev',
  integrations: [mdx(), react()],
  i18n: { locales: ['en', 'ru'], defaultLocale: 'en', routing: { prefixDefaultLocale: true } }
});
