module.exports = {
  purge: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      // Add more here
  ],
  darkMode: 'class',
  theme: {
      extend: {},
  },
  variants: {
      extend: {},
  },
  plugins: [],
}

module.exports = {
    theme: {
     extend: {
       backdropBlur: {
         xs: '2px',
       },
     }
    }
  }