import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const SITE = process.env.PUBLIC_SITE_URL ?? 'https://www.example.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    assets: '_astro',
  },
  integrations: [tailwind(), sitemap()],
});
