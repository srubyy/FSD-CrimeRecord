/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Precise 8-color design system defined by specification
        brand: {
          light: '#24527A',
          dark: '#6B9BC2',
          DEFAULT: '#24527A',
          hover: '#1B3E5C',
        },
        app: {
          bg: {
            light: '#F5F7FA',
            dark: '#0F141C',
          },
          surface: {
            light: '#FFFFFF',
            dark: '#151C26',
          },
          border: {
            light: '#D9E0E8',
            dark: '#293544',
          },
          text: {
            primary: {
              light: '#172033',
              dark: '#F1F4F8',
            },
            secondary: {
              light: '#526176',
              dark: '#AAB6C5',
            }
          },
          status: {
            success: {
              light: '#167A5B',
              dark: '#4DB58B',
              bgLight: '#E8F5F1',
              bgDark: 'rgba(77, 181, 139, 0.15)',
            },
            warning: {
              light: '#A66A00',
              dark: '#D6A34A',
              bgLight: '#FFF5DD',
              bgDark: 'rgba(214, 163, 74, 0.15)',
            },
            critical: {
              light: '#B4232C',
              dark: '#E06A70',
              bgLight: '#FCEBEC',
              bgDark: 'rgba(224, 106, 112, 0.15)',
            }
          }
        }
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'sm': '0 1px 3px 0 rgba(16, 24, 40, 0.08), 0 1px 2px -1px rgba(16, 24, 40, 0.08)',
        'md': '0 4px 6px -1px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.08)',
        'dropdown': '0 10px 15px -3px rgba(16, 24, 40, 0.1), 0 4px 6px -4px rgba(16, 24, 40, 0.1)',
      }
    },
  },
  plugins: [],
}
