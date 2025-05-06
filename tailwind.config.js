/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    // tailwind.config.js
    extend: {
      colors: {
        theme: {
          bg: '#f5faff',
          bgSecondary: '#e9f2f9',
          card: '#ffffff',
          border: '#c3d4e3',
          primary: '#4f93ce',
          hover: '#3b7cb2',
          text: '#1e2a36',
          subtext: '#5c6d7e',
          success: '#69b99d',
          warning: '#f6ad55',
          error: '#f56565',
          disabled: '#a0aec0',
        }
      }
    },
  },
  plugins: [],
}


