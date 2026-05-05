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
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
