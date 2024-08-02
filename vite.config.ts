import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';
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
      viteImagemin({
        svgo: {
          plugins: [{ removeViewBox: false }, { removeEmptyAttrs: false }],
        },
        webp: { quality: 75 },
      }),
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