import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                // 'font-sans' ishlatilganda Rubik ishga tushadi
                sans: ['var(--font-rubik)', 'sans-serif']
            }
        }
    },
    plugins: []
};
export default config;
