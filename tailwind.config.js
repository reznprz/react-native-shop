/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mocha: "#8b5e3c", // Primary Accent
        lightCream: "#fef6eb", // Background Base
        softRose: "#bb6561", // Highlight Text or Accent
        deepTeal: "#2a4759", // Dark Background
        sand: "#d2a679", // Subtle Accent
        darkTan: "#9b6a4f",
        "darkTan-400": "#9b6a4f",
        mahogany: "#6b292e", // Strong Text Color
        roseBorder: "#bb6561", // Border Accent
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        custom: ["Georgia", "serif"],
        anticSlab: ["Antic Slab", "serif"],
        arsenal: ["Arsenal", "sans-serif"],
        playfair: ['"Playfair Display"', "serif"],
      },
      zIndex: {
        50: 50,
        56: 56,
      },
      borderWidth: {
        6: 6,
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)" }, // Start off-screen to the right
          "100%": { transform: "translateX(0)" }, // Slide to original position
        },
        slideOut: {
          "0%": { transform: "translateX(0)" }, // Start from original position
          "100%": { transform: "translateX(100%)" }, // Slide out to the right
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out forwards",
        slideOut: "slideOut 0.5s ease-in forwards",
      },
    },
  },
  plugins: [],
};
