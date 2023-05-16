/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#752A1A",
        primaryHover: "#582014",
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
      screens: {
        xs: "500px",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
