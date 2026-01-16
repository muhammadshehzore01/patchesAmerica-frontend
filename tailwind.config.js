/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#5F3DC4",
        cyan: "#00FFFF",
        "hero-gradient-start": "#8B5CF6",
        "hero-gradient-mid": "#EC4899",
        "hero-gradient-end": "#3B82F6",
        "text-light": "hsl(220, 15%, 20%)",
        "text-secondary": "hsl(220, 10%, 50%)",
        "bg-light": "hsl(0, 0%, 98%)",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(255,255,255,0.15), 0 0 40px rgba(255,255,255,0.1)",
        glow: "0 0 30px rgba(0,255,255,0.2), 0 0 60px rgba(0,255,255,0.1)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.7s ease-out forwards",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};