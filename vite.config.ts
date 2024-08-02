import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import postcssConfig from './postcss.config.ts';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import compression from 'vite-plugin-compression';
import fg from 'fast-glob';

export default defineConfig(({ command }) => {
  return {
    define: {
      ...{
        [command === 'serve' ? 'global' : '_global']: {},
      },
    },
    base: './',
    plugins: [
      ViteImageOptimizer({
        svgo: {
          plugins: [
            { removeViewBox: false },
            { removeEmptyAttrs: false },
            { removeAttrs: { attrs: '(id)' } }
          ],
        },
        webp: {
          quality: 80,
        },
      } as any),
      injectHTML(),
      FullReload(['./src/**/*.{html,css,js,ts}']),
      compression({
        verbose: true,
        disable: false,
        deleteOriginFile: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ],
    css: {
      postcss: postcssConfig,
    },
    build: {
      minify: false,
      rollupOptions: {
        input: fg
          .sync(['./*.html', './src/**/*.html'])
          .reduce((entries, file) => {
            const name = file.slice(
              file.lastIndexOf('/') + 1,
              file.lastIndexOf('.'),
            );
            entries[name] = file;
            return entries;
          }, {}),
        output: {
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  };
});