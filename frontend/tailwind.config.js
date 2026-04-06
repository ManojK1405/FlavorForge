/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090a",
        foreground: "#f8f9fa",
        accent: {
          primary: "#6d28d9", // Deep Purple
          secondary: "#10b981", // Emerald
          highlight: "#f43f5e", // Rose
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Outfit", "serif"],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
