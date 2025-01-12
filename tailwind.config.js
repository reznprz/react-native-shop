/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  prtsesets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: { mocha: "#8b5e3c" },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        custom: ["Georgia", "serif"],
        anticSlab: ["Antic Slab", "serif"],
        arsenal: ["Arsenal", "sans-serif"],
        playfair: ['"Playfair Display"', "serif"],
      },
    },
  },
  plugins: [],
};
