/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    // add more if needed
  ],
  theme: {
    extend: {},
  },
  // Performance optimizations
  future: {
    hoverOnlyWhenSupported: true, // Reduces CSS size by not generating unused hover variants
  },
  // Disable variants that you don't use to reduce CSS size
  variants: {
    extend: {},
  },
  // Enable just-in-time mode for faster builds and smaller CSS
  corePlugins: {
    // Disable features you don't use to reduce CSS size
    // container: false, // Uncomment if you don't use container
  },
  plugins: [],
}; 