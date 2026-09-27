import { defineConfig } from 'vite';
import { renderBody, renderHead } from './src/render.ts';

// Pages serves the site from /victor-site/, and so does `vite preview`; dev runs at the root.
export default defineConfig(({ command, isPreview }) => {
  const base = command === 'build' || isPreview ? '/victor-site/' : '/';
  return {
    base,
    plugins: [
      {
        name: 'prerender-content',
        transformIndexHtml(html) {
          return html.replace('<!--head-->', renderHead(base)).replace('<!--body-->', renderBody());
        },
      },
    ],
    build: { target: 'es2022', assetsInlineLimit: 0, chunkSizeWarningLimit: 1500 },
    server: { host: '127.0.0.1', port: 5173 },
    preview: { host: '127.0.0.1', port: 4173 },
  };
});
