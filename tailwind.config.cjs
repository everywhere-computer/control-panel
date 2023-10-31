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
          primary: '#8D74F7',
          'primary-focus': '#BAA6FF',
          'primary-content': '#FBFAFF',
          secondary: '#FA5A7C',
          'secondary-focus': '#C2304E',
          'secondary-content': '#FFFAFB',
          accent: '#13BDB3',
          'accent-focus': '#0A8C84',
          'accent-content': '#EDFFFE',
          neutral: '#232538',
          'neutral-accent': '#32334A',
          'neutral-content': '#F5F5FC',
          'base-100': '#232538',
          'base-200': '#32334A',
          'base-300': '#40425E',
          'base-content': '#DFDFF0',
          info: '#2863D8',
          'info-content': '#F2F6FF',
          success: '#139C6E',
          'success-content': '#F5FFFC',
          warning: '#EBC428',
          'warning-content': '#402B06',
          error: '#BA2F41',
          'error-content': '#FFF2F2',
          '--rounded-box': '2px',
          '--rounded-btn': '2px',
          '--rounded-badge': '2px',
          '--tab-radius': '2px',
          '--btn-text-case': 'normal-case',
          '--navbar-padding': '16px'
        },
        light: {
          primary: '#6A50EB',
          'primary-focus': '#4C34C2',
          'primary-content': '#FBFAFF',
          secondary: '#FA5A7C',
          'secondary-focus': '#C2304E',
          'secondary-content': '#FFFAFB',
          accent: '#13BDB3',
          'accent-focus': '#0A8C84',
          'accent-content': '#EDFFFE',
          neutral: '#F5F5FC',
          'neutral-accent': '#DFDFF0',
          'neutral-content': '#F5F5FC',
          'base-100': '#F5F5FC',
          'base-200': '#DFDFF0',
          'base-300': '#DADAED',
          'base-content': '#32334A',
          info: '#2863D8',
          'info-content': '#F2F6FF',
          success: '#139C6E',
          'success-content': '#F5FFFC',
          warning: '#EBC428',
          'warning-content': '#402B06',
          error: '#BA2F41',
          'error-content': '#FFF2F2',
          '--rounded-box': '2px',
          '--rounded-btn': '2px',
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
        'odd-blue': {
          0: '#F2F6FF',
          50: '#E1E9FC',
          100: '#CFDCFC',
          150: '#B4C8FA',
          200: '#93B1FA',
          300: '#598AEB',
          400: '#2863D8',
          500: '#1244A6',
          600: '#0D2F73',
          700: '#0A2357',
          800: '#07193D',
          900: '#040E24'
        },
        'odd-gray': {
          0: '#F5F5FC',
          50: '#E8E8F4',
          100: '#DFDFF0',
          150: '#DADAED',
          200: '#CCCCE3',
          300: '#B0B0CF',
          400: '#8989B0',
          500: '#6B6B8F',
          600: '#40425E',
          700: '#32334A',
          800: '#232538',
          900: '#181929'
        },
        'odd-green': {
          0: '#F5FFFC',
          50: '#DEFAF1',
          100: '#D0F5E8',
          150: '#B8E5D6',
          200: '#A2DBC7',
          300: '#63BA9B',
          400: '#119163',
          500: '#117853',
          600: '#1A664B',
          700: '#164D39',
          800: '#133B2C',
          900: '#10261E'
        },
        'odd-pink': {
          0: '#FFFAFB',
          50: '#FEF1F4',
          100: '#FFE3E9',
          150: '#FFD1DB',
          200: '#FFBDCC',
          300: '#FF829D',
          400: '#FA5A7C',
          500: '#C2304E',
          600: '#A12540',
          700: '#851D33',
          800: '#611324',
          900: '#330A13'
        },
        'odd-purple': {
          0: '#FBFAFF',
          50: '#F1EDFF',
          100: '#EBE3FF',
          150: '#E4D9FF',
          200: '#D6C7FF',
          300: '#BAA6FF',
          400: '#8D74F7',
          500: '#6A50EB',
          600: '#4C34C2',
          700: '#312185',
          800: '#261C5C',
          900: '#1F1B36'
        },
        'odd-red': {
          0: '#FFF2F2',
          50: '#FFD9D9',
          100: '#F7C8C8',
          150: '#F0B4B4',
          200: '#ED9D9F',
          300: '#D9626D',
          400: '#BA2F41',
          500: '#910D23',
          600: '#730E1E',
          700: '#4F080B',
          800: '#3B0609',
          900: '#240002'
        },
        'odd-teal': {
          0: '#EDFFFE',
          50: '#D4FAF7',
          100: '#B9FAF6',
          150: '#9EF7F1',
          200: '#7EF2EA',
          300: '#54E3D9',
          400: '#13BDB3',
          500: '#0A8C84',
          600: '#006B64',
          700: '#095C56',
          800: '#0C4D48',
          900: '#06403C'
        },
        'odd-yellow': {
          0: '#FFFCF0',
          50: '#FFF8DB',
          100: '#FEF1B2',
          150: '#FFEC91',
          200: '#FFE275',
          300: '#FADB52',
          400: '#EBC728',
          500: '#8C690A',
          600: '#6B4D00',
          700: '#5C4309',
          800: '#4D370C',
          900: '#402B06'
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
