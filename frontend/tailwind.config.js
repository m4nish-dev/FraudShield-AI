/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // ─── Font Families ────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      // ─── Type Scale (density-optimised) ───────────────────────────────
      fontSize: {
        xs:   ['11px', { lineHeight: '16px' }],
        sm:   ['13px', { lineHeight: '18px' }],
        base: ['14px', { lineHeight: '20px' }],
        md:   ['15px', { lineHeight: '22px' }],
        lg:   ['17px', { lineHeight: '24px' }],
        xl:   ['20px', { lineHeight: '28px' }],
        '2xl':['24px', { lineHeight: '32px' }],
        '3xl':['30px', { lineHeight: '38px' }],
        '4xl':['36px', { lineHeight: '44px' }],
      },

      // ─── Colors ────────────────────────────────────────────────────────
      colors: {
        // Neutral canvas / surface system
        canvas:   '#0A0A0B',
        surface:  '#111113',
        elevated: '#17171A',
        inset:    '#08080A',

        // Border system
        border: {
          subtle:  '#1F1F23',
          default: '#27272C',
          strong:  '#3A3A42',
        },

        // Text system
        text: {
          primary:   '#F4F4F5',
          secondary: '#A1A1AA',
          tertiary:  '#71717A',
          disabled:  '#52525B',
        },

        // Accent — cyan-blue intelligence brand color
        accent: {
          50:       '#F0F9FF',
          100:      '#E0F2FE',
          200:      '#BAE6FD',
          300:      '#7DD3FC',
          400:      '#38BDF8',
          500:      '#0EA5E9',
          600:      '#0284C7',
          700:      '#0369A1',
          800:      '#075985',
          900:      '#0C4A6E',
          DEFAULT:  '#38BDF8',
          muted:    '#0C4A6E',
        },

        // Risk semantic palette
        risk: {
          critical: '#F43F5E',
          'critical-bg':     'rgba(244,63,94,0.10)',
          'critical-border': 'rgba(244,63,94,0.25)',

          high:     '#FB923C',
          'high-bg':     'rgba(251,146,60,0.10)',
          'high-border': 'rgba(251,146,60,0.25)',

          medium:   '#FACC15',
          'medium-bg':     'rgba(250,204,21,0.10)',
          'medium-border': 'rgba(250,204,21,0.25)',

          low:      '#4ADE80',
          'low-bg':     'rgba(74,222,128,0.10)',
          'low-border': 'rgba(74,222,128,0.25)',

          safe:     '#22D3EE',
          'safe-bg':     'rgba(34,211,238,0.10)',
          'safe-border': 'rgba(34,211,238,0.25)',
        },
      },

      // ─── Spacing ───────────────────────────────────────────────────────
      spacing: {
        sidebar:          '240px',
        'sidebar-collapsed': '64px',
        topbar:           '56px',
      },

      // ─── Max Width ─────────────────────────────────────────────────────
      maxWidth: {
        content: '1600px',
      },

      // ─── Border Radius ─────────────────────────────────────────────────
      borderRadius: {
        sm:  '4px',
        md:  '6px',
        lg:  '8px',
        xl:  '12px',
        '2xl': '16px',
      },

      // ─── Box Shadow ────────────────────────────────────────────────────
      boxShadow: {
        card:     '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        elevated: '0 4px 16px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
        focus:    '0 0 0 3px rgba(56,189,248,0.25)',
        glow:     '0 0 20px rgba(56,189,248,0.15)',
      },

      // ─── Letter Spacing ────────────────────────────────────────────────
      letterSpacing: {
        tightest: '-0.03em',
        tighter:  '-0.02em',
        tight:    '-0.01em',
        snug:     '-0.005em',
        normal:   '0em',
        wide:     '0.02em',
        wider:    '0.05em',
        widest:   '0.1em',
      },

      // ─── Animations ────────────────────────────────────────────────────
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse_dot: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer:    'shimmer 2s linear infinite',
        pulse_dot:  'pulse_dot 2s ease-in-out infinite',
        fadeIn:     'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
