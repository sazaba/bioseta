import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Con esto, cuando escribas 'font-sans', usará Montserrat
        sans: ["var(--font-montserrat)", "sans-serif"],
        // Con esto, cuando escribas 'font-serif', usará Cormorant
        serif: ["var(--font-cormorant)", "serif"],
        // Para Cinzel (si lo usas en el futuro)
        mono: ["var(--font-cinzel)", "monospace"], 
      },
      // ... tus colores y otras configs
    },
  },
  plugins: [],
};
export default config;