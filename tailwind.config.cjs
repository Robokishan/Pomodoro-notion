/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
      colors: {
        /* ---- semantic surface colors ---- */
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          card:    "rgb(var(--color-surface-card) / <alpha-value>)",
          btn:     "rgb(var(--color-surface-btn) / <alpha-value>)",
          hover:   "rgb(var(--color-surface-hover) / <alpha-value>)",
          muted:   "rgb(var(--color-surface-muted) / <alpha-value>)",
          active:  "rgb(var(--color-surface-active) / <alpha-value>)",
        },
        /* ---- semantic text colors ---- */
        heading: "rgb(var(--color-heading) / <alpha-value>)",
        body:    "rgb(var(--color-body) / <alpha-value>)",
        muted:   "rgb(var(--color-muted) / <alpha-value>)",
        faint:   "rgb(var(--color-faint) / <alpha-value>)",
        icon:    "rgb(var(--color-icon) / <alpha-value>)",
        /* ---- semantic border color ---- */
        theme: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          subtle:  "rgb(var(--color-border-subtle) / <alpha-value>)",
        },
        /* ---- existing project colors ---- */
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
      fill: {
        "icon-disabled": "rgb(var(--color-fill-disabled))",
        "icon-default":  "rgb(var(--color-fill-icon))",
      },
      boxShadowColor: {
        theme: "rgb(var(--color-shadow) / 0.4)",
      },
    },
  },
  plugins: [],
};
