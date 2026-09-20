import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://maglaa.github.io',
  base: '/mgl-blog',
  
  integrations: [
    sitemap(),
  ],
  
  build: {
    format: 'directory',
  },
  
  outDir: './dist',
  
  server: {
    port: 5173,
    host: true,
  },
});

