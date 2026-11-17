/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crm: {
          navy: '#194B87',
          navyDark: '#102D50',
          navyDeep: '#0A1E36',
          blue: '#2563EB',
          orange: '#F7901E',
          orangeHover: '#DE7A10',
          orangeLight: '#FFF6ED',
          green: '#10B981',
          greenLight: '#ECFDF5',
          bg: '#F4F7FB',
          card: '#FFFFFF',
          text: '#172B45',
          muted: '#64748B',
          border: '#E2E8F0',
          borderLight: '#EDF2F7',
          sidebarBg: '#102D50',
          sidebarHover: '#194B87',
          sidebarActive: '#194B87',
        },
        brand: {
          white: '#FFFFFF',
          blue: '#174F8F',
          blueDark: '#10345F',
          blueLight: '#2563EB',
          green: '#10B981',
          greenDark: '#059669',
          greenLight: '#ECFDF5',
          orange: '#F7901E',
          orangeHover: '#DE7A10',
          orangeLight: '#FFF6ED',
        },
        navy: {
          50: '#F0F4F9',
          100: '#D9E3EF',
          200: '#B3C6DF',
          300: '#8DAACF',
          400: '#527EBA',
          500: '#174F8F',
          600: '#143F77',
          700: '#10345F',
          800: '#0C284E',
          900: '#0A2342',
          950: '#051324',
        }
      }
    },
  },
  plugins: [],
}
