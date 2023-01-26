/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
      colors: {
        bgColor: {
          10: "#282c34",
        },
        boxShadowColor: {
          10: "#f133450c",
        },
        darkBoxShadowColor: {
          10: "#7b757517",
        },
        timercircleDarkBoxShadowColor: {
          10: "#ffffff33",
        },
        gradientStop1: {
          10: "#F13346",
        },
        gradientStop2: {
          10: "#FB5143",
        },
        darkGradientStop1: {
          10: "#232526",
        },
        darkGradientStop2: {
          10: "#414345",
        },
      },
    },
  },
  plugins: [],
};
