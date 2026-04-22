/** @type {import('tailwindcss').Config} */
// Tailwind v4: dark mode is defined in src/index.css via @custom-variant dark.
// The key below is kept for tooling/compat only and is not the source of truth for v4.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [],
}
