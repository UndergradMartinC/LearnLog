// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://learn-log-frontend.vercel.app',
  security: {
    checkOrigin: true,
    allowedDomains: [
      { hostname: 'learn-log-frontend.vercel.app', protocol: 'https' },
    ],
  },
});
