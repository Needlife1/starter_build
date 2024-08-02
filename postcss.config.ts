import autoprefixer from 'autoprefixer';
import purgecss from '@fullhuman/postcss-purgecss';

const purgeCssPlugin = purgecss({
  content: ['./src/**/*.{html,ts,js,jsx,tsx}'],
  safelist: ['safe-class'], // если есть классы, которые не должны быть удалены
});

export default {
  plugins: [purgeCssPlugin, autoprefixer()],
};