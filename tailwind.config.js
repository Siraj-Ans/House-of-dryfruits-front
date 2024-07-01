/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "dark-gray": "#282828",
        "light-green": "#5fa800",
        "dark-green": "#7FB414",
        cream: "#E5C3A6dd",
        light: "#E5F9BD",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
