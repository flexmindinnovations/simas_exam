/** @type {import('tailwindcss').Config} */

// pg: persian_green
// sb: sandy_brown
// bs: burnt_sienna
// br: blue-ribbon
// ph: purple-heart
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      screens: {
        "2x": {
          raw: "(min-width: 1366px) and (min-height: 768px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1366px) and (min-height: 768px) and (min-resolution: 192dpi), (min-width: 1366px) and (min-height: 768px) and (min-resolution: 2dppx)",
        },
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      fontSize: {
        "10xl": "10rem", // 160px
        "11xl": "12rem", // 192px
      },
      animation: {
        slideIn: "slideIn .25s ease-in-out forwards var(--delay, 0)",
      },
      colors: {
        charcoal: {
          50: "#264653",
          100: "#080e11",
          200: "#0f1c22",
          300: "#172b32",
          400: "#1f3943",
          500: "#264653",
          600: "#3f7489",
          700: "#609db6",
          800: "#95bece",
          900: "#cadee7",
        },
        pg: {
          50: "#2a9d8f",
          100: "#081f1d",
          200: "#113f39",
          300: "#195e56",
          400: "#217e73",
          500: "#2a9d8f",
          600: "#3acbba",
          700: "#6cd8cb",
          800: "#9de5dc",
          900: "#cef2ee",
        },
        saffron: {
          50: "#e9c46a",
          100: "#3b2c09",
          200: "#755912",
          300: "#b0851a",
          400: "#e0ad2e",
          500: "#e9c46a",
          600: "#edd086",
          700: "#f1dca4",
          800: "#f6e7c3",
          900: "#faf3e1",
        },
        sb: {
          50: "#f4a261",
          100: "#401f04",
          200: "#803e09",
          300: "#c05e0d",
          400: "#f07e22",
          500: "#f4a261",
          600: "#f6b681",
          700: "#f8c8a1",
          800: "#fbdac0",
          900: "#fdede0",
        },
        bs: {
          50: "#e76f51",
          100: "#371107",
          200: "#6e220f",
          300: "#a43316",
          400: "#db441e",
          500: "#e76f51",
          600: "#ec8b73",
          700: "#f1a896",
          800: "#f5c5b9",
          900: "#fae2dc",
        },
        br: {
          50: "#eff4ff",
          100: "#dbe6fe",
          200: "#bfd3fe",
          300: "#93b4fd",
          400: "#6090fa",
          500: "#3b76f6",
          600: "#2563eb",
          700: "#1d58d8",
          800: "#1e4baf",
          900: "#1e408a",
          950: "#172a54",
        },
        botticelli: {
          50: "#f2f9fd",
          100: "#e5f1f9",
          200: "#c6e3f3",
          300: "#91cbe8",
          400: "#56b0da",
          500: "#3096c7",
          600: "#2078a9",
          700: "#1b6189",
          800: "#1a5272",
          900: "#1b455f",
          950: "#122c3f",
        },
        ph: {
          50: "#f7f3ff",
          100: "#efe9fe",
          200: "#e2d6fe",
          300: "#cbb5fd",
          400: "#ad8bfa",
          500: "#8b5cf6",
          600: "#713aed",
          700: "#5e28d9",
          800: "#4e21b6",
          900: "#421d95",
          950: "#2a1065",
        },
      },
    },
  },
  plugins: [],
};
