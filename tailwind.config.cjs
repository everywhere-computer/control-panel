module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: ['alert-success', 'alert-error', 'alert-info', 'alert-warning'],
  plugins: [require('daisyui')],
  darkMode: ['class', '[data-theme="dark"]'],
  daisyui: {
    styled: true,
    themes: [
      {
        dark: {
          primary: '#171717',
          secondary: '#30aadd',
          accent: '#00ffc6',
          neutral: '#171717',
          info: '#93c5fd',
          success: '#BBF7D0',
          warning: '#fdba74',
          error: '#DC2626',
          'base-content': '#E1E2EA', // Base text content color
          'base-100': '#313245', // Base background color
          '--rounded-box': '16px',
          '--rounded-btn': '4px',
          '--rounded-badge': '2px',
          '--tab-radius': '2px',
          '--btn-text-case': 'normal-case',
          '--navbar-padding': '16px'
        },
        light: {
          primary: '#FAFAFA',
          secondary: '#30aadd',
          accent: '#00ffc6',
          neutral: '#171717',
          info: '#bfdbfe',
          success: '#BBF7D0',
          warning: '#fed7aa',
          error: '#DC2626',
          'base-content': '#313245', // Base text content color
          'base-100': '#E1E2EA', // Base background color
          '--rounded-box': '16px',
          '--rounded-btn': '4px',
          '--rounded-badge': '2px',
          '--tab-radius': '2px',
          '--btn-text-case': 'normal-case',
          '--navbar-padding': '16px'
        }
      }
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: 'dark'
  },
  theme: {
    extend: {
      animation: {
        rotateAnimation: 'rotateAnimation 30s linear infinite',
        marquee: 'marquee 20s linear infinite'
      },
      aspectRatio: {
        '22/23': '22 / 23'
      },
      colors: {
        'odd-gray': {
          0: '#F3F3F7',
          100: '#E1E2EA',
          150: '#C8CADA',
          200: '#AAADC4',
          300: '#74789D',
          400: '#484A65',
          500: '#313245',
          600: '#27283A'
        },
        'odd-blue': {
          100: '#F1EDFD',
          200: '#D5C3FD',
          300: '#B79AFC',
          400: '#9372FB',
          500: '#6649F8'
        },
        'odd-pink': {
          100: '#FEF6F8',
          200: '#FFCFD5',
          300: '#FFA8B2',
          400: '#FA7F91',
          500: '#F15072'
        },
        'odd-green': {
          100: '#E1F0EB',
          200: '#B1D9CA',
          300: '#82C1A8',
          400: '#52A985',
          500: '#0F9162'
        },
        'odd-red': {
          100: '#F0E1E5',
          200: '#E2B2BD',
          300: '#D28392',
          400: '#BE5366',
          500: '#BE5366'
        },
        'odd-yellow': {
          100: '#F0EDE1',
          200: '#EDE1BE',
          300: '#E8D49A',
          400: '#E3CA78',
          500: '#DFC334'
        }
      },
      fontFamily: {
        mono: ['OverpassMono'],
        sans: ['Overpass'],
        serif: ['Literata']
      },
      fontSize: {
        'btn-sm': ['16px', { lineHeight: '17px' }],
        btn: ['20px', { lineHeight: '22px' }],
        'code-sm': ['12.44px', { fontWeight: '400', lineHeight: '16px' }],
        'code-m': ['14px', { fontWeight: '400', lineHeight: '20px' }],
        'code-l': ['15.75px', { fontWeight: '400', lineHeight: '20px' }],
        'code-xl': ['17.72px', { fontWeight: '400', lineHeight: '24px' }],
        'input-sm': ['14.22px', { fontWeight: '400', lineHeight: '20px' }],
        'input-m': ['16px', { fontWeight: '400', lineHeight: '20px' }],
        'input-l': ['18px', { fontWeight: '400', lineHeight: '24px' }],
        'label-sm': ['14.22px', { fontWeight: '550', lineHeight: '16px' }],
        'label-m': ['16px', { fontWeight: '550', lineHeight: '16px' }],
        'label-l': ['18px', { fontWeight: '550', lineHeight: '16px' }],
        'body-xs': ['12.64px', { fontWeight: '400', lineHeight: '16px' }],
        'body-sm': ['16px', { fontWeight: '400', lineHeight: '24px' }],
        'body-m': ['16px', { fontWeight: '400', lineHeight: '20px' }],
        'body-lg': ['18px', { fontWeight: '400', lineHeight: '24px' }],
        'heading-xs': [
          '16px',
          {
            fontWeight: '500',
            lineHeight: '20px',
            letterSpacing: '0.64px',
            textTransform: 'uppercase'
          }
        ],
        'heading-sm': [
          '18px',
          {
            fontWeight: '600',
            lineHeight: '20px',
            letterSpacing: '-0.36px'
          }
        ],
        'heading-m': [
          '20.25px',
          { fontWeight: '700', lineHeight: '24px', letterSpacing: '-0.405px' }
        ],
        'heading-lg': [
          '22.78px',
          { fontWeight: '700', lineHeight: '28px', letterSpacing: '-0.456px' }
        ],
        'heading-xl': [
          '25.63px',
          { fontWeight: '600', lineHeight: '32px', letterSpacing: '-0.513px' }
        ],
        'heading-2xl': [
          '28.83px',
          { fontWeight: '500', lineHeight: '32px', letterSpacing: '-0.577px' }
        ]
      },
      keyframes: {
        rotateAnimation: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        marquee: {
          '0%': { transform: 'translateX(102%)' },
          '100%': { transform: 'translateX(-100vw)' }
        }
      },
      width: {
        narrowModal: '327px',
        wideModal: '471px'
      },
      zIndex: {
        max: '1000' // High enough to appear above the modal(999)
      }
    }
  }
}
