/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mocha: '#7a4f34', // Rich Mocha (Primary Accent, slightly deeper for contrast)
        lightCream: '#f7f1e7', // Softer Cream (Balanced Background)
        softRose: '#b85c57', // Soft Rose (Refined Highlight Text / Accent)
        deepTeal: '#2a4759', // Dark Blue-Gray (Primary Dark Background)
        sand: '#c2956d', // Muted Sand (Subtle Accent, slightly softer)
        darkTan: '#8a5a3b', // Dark Tan (Warm, Earthy)
        'darkTan-400': '#8a5a3b', // Consistent Dark Tan Shade
        mahogany: '#5a1f22', // Deep Mahogany (Strong Text & Depth)
        roseBorder: '#b85c57', // Soft Rose for Borders (Matching SoftRose)
        warmSoftOrange: '#d17a4d', // Muted Warm Orange (Less vibrant, more balanced)
        darkerWarmOrange: '#b55d42', // Deeper Burnt Orange (Stronger Button Color)
        lightGrayish: '#d4d7db', // Softer Grayish White (Better for contrast)
        darkTeal: '#1f3a45', // Even Deeper Teal (For seamless blending with #2a4759)
        paleSkyBlue: '#a0c4dc', // More Muted Pale Blue (For subtle highlights)
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        custom: ['Georgia', 'serif'],
        anticSlab: ['Antic Slab', 'serif'],
        arsenal: ['Arsenal', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
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
          '0%': { transform: 'translateX(100%)' }, // Start off-screen to the right
          '100%': { transform: 'translateX(0)' }, // Slide to original position
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' }, // Start from original position
          '100%': { transform: 'translateX(100%)' }, // Slide out to the right
        },
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out forwards',
        slideOut: 'slideOut 0.5s ease-in forwards',
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [],
};
