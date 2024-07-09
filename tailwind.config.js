/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "dark-gray": "#282828",
        "dark-blue": "#131842",
        "light-green": "#5fa800",
        "dark-green": "#7FB414",
        cream: "#E5C3A6dd",
        light: "#FBF6E2",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
