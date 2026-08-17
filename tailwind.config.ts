import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FDF8F3",
          100: "#FDF8F3",
          200: "#FAF0E6",
          300: "#F5E6D3",
          400: "#EDD9C0",
        },
        blush: {
          DEFAULT: "#F5C6C6",
          100: "#F5C6C6",
          200: "#E8A0A0",
          300: "#D4767A",
          400: "#B85450",
        },
        peach: {
          DEFAULT: "#FFDAB9",
          100: "#FFDAB9",
          200: "#FFB88C",
          300: "#F4A460",
        },
        rose: {
          DEFAULT: "#FFE4E1",
          100: "#FFE4E1",
          200: "#FFB6C1",
          300: "#FF69B4",
          400: "#DB7093",
        },
        mauve: {
          DEFAULT: "#E0C3FC",
          100: "#E0C3FC",
          200: "#C8A2E8",
          300: "#9B72CF",
        },
        "warm-white": {
          DEFAULT: "#FEFCF9",
          100: "#FEFCF9",
          200: "#FBF7F0",
        },
        charcoal: {
          DEFAULT: "#3D3D3D",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#C4C4C4",
          400: "#A0A0A0",
          500: "#7A7A7A",
          600: "#5A5A5A",
          700: "#3D3D3D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-arabic)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "var(--font-noto-arabic)", "system-ui", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(180, 84, 80, 0.08), 0 4px 6px -4px rgba(180, 84, 80, 0.04)",
        "soft-md": "0 4px 25px -5px rgba(180, 84, 80, 0.1), 0 8px 10px -6px rgba(180, 84, 80, 0.05)",
        "soft-lg": "0 10px 40px -10px rgba(180, 84, 80, 0.12), 0 15px 20px -10px rgba(180, 84, 80, 0.06)",
        "soft-xl": "0 20px 60px -15px rgba(180, 84, 80, 0.15), 0 25px 30px -15px rgba(180, 84, 80, 0.08)",
        glow: "0 0 20px rgba(255, 105, 180, 0.15)",
        "glow-rose": "0 0 25px rgba(219, 112, 147, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-left": "slideInLeft 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 2.5s infinite",
        float: "float 4s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
