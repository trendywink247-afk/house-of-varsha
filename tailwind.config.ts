import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // EDITORIAL FASHION PALETTE - Soft, Calm Luxury
        // Primary backgrounds
        'warm-white': '#FAFAF8',
        'soft-cream': '#F5F3EF',
        'warm-beige': '#EDE9E3',
        'sand': '#E5E0D8',
        
        // Text colors - Soft charcoal family
        'charcoal': '#2C2C2C',
        'soft-black': '#1A1A1A',
        'warm-gray': '#6B6560',
        'muted-gray': '#9A9590',
        'light-gray': '#C5C0BA',
        
        // Accent colors - Muted, elegant
        'blush': '#D4A5A5',
        'blush-light': '#E8C4C4',
        'clay': '#B8957A',
        'clay-light': '#D4B8A0',
        'sage': '#A8B5A0',
        'warm-gold': '#C9B18A',
        
        // Semantic mappings for consistency
        'bg-primary': '#FAFAF8',
        'bg-secondary': '#F5F3EF',
        'bg-tertiary': '#EDE9E3',
        
        'text-primary': '#1A1A1A',
        'text-secondary': '#2C2C2C',
        'text-muted': '#6B6560',
        'text-subtle': '#9A9590',
        
        'accent-primary': '#D4A5A5',
        'accent-secondary': '#C9B18A',
        'accent-warm': '#B8957A',
        
        // Legacy compatibility (keeping for smooth transition)
        cream: '#FAFAF8',
        'cream-dark': '#F5F3EF',
        burgundy: '#8B4A4A',
        'burgundy-light': '#A06060',
        gold: '#C9B18A',
        'gold-light': '#D4C4A8',
        
        // Shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.1em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '42': '10.5rem',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'dramatic': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'soft': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'reveal-up': {
          '0%': { clipPath: 'inset(100% 0 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slide-in-left 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-up': 'reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'marquee': 'marquee 30s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
      },
      aspectRatio: {
        'portrait': '3 / 4',
        'landscape': '4 / 3',
        'editorial': '2 / 3',
        'square': '1 / 1',
        'cinematic': '21 / 9',
        'golden': '1.618 / 1',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
export default config
