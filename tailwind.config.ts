import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',     // Warm beige background
        ivory: '#FAF8F5',     // Lighter cream for gradients
        teal: '#3A7D7B',      // Main accent (from logo circle)
        gold: '#C9A227',      // Brand accent (from logo text)
        coral: '#E8A091',     // Soft accent (from logo dress/flowers)
        // Legacy aliases for gradual migration
        sage: '#3A7D7B',
        dustyrose: '#E8A091',
        taupe: '#C9A227',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
