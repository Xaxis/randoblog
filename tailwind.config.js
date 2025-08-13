/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Theme-aware color system
      colors: {
        // Base colors that adapt to theme
        'bg': {
          'primary': 'var(--bg-primary)',
          'secondary': 'var(--bg-secondary)',
          'tertiary': 'var(--bg-tertiary)',
        },

        // Text colors that adapt to theme
        'text': {
          'primary': 'var(--text-primary)',
          'secondary': 'var(--text-secondary)',
          'muted': 'var(--text-muted)',
        },

        // Accent colors
        'accent': {
          'primary': 'var(--accent-primary)',
          'secondary': 'var(--accent-secondary)',
          'purple': '#8b5cf6',
          'cyan': '#06b6d4',
        },

        // Border color
        'border': 'var(--border-color)',

        // Legacy dark colors for specific use
        'dark': {
          900: '#0a0a0f',
          800: '#1a1a2e',
          700: '#2a2a3e',
          600: '#3a3a4e',
          500: '#4a4a5e',
          400: '#6a6a7e',
          300: '#8a8a9e',
          200: '#aaaaae',
          100: '#cacacc',
        },
      },

      // Modern font stack with retro feel
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', '"Fira Code"', '"SF Mono"', 'Consolas', 'monospace'],
        'display': ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },

      // Modern shadows with subtle glow effects
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },

      // Subtle animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
