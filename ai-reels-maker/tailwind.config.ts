import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          50: "#F5EEFF",
          100: "#ECE0FF",
          200: "#D6BCFA",
          300: "#C4A0FF",
          400: "#A970FF",
          500: "#8F46FF",
          600: "#7C3AED",
          700: "#5F2EB4",
          800: "#43217D",
          900: "#2B1453",
        },
        neon: {
          green: "#7CFFB6",
          blue: "#48C7FF",
          pink: "#FF5EDF",
          purple: "#A855F7",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.08)",
          on: "rgba(18,18,24,0.92)",
        },
        border: {
          glow: "rgba(124, 58, 237, 0.35)",
        },
        background: {
          DEFAULT: "#050510",
        },
        accent: colors.fuchsia,
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 58, 237, 0.35)",
        "soft-glow": "0 8px 40px rgba(124, 58, 237, 0.25)",
        glass: "0 24px 60px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(124,58,237,0.06), rgba(10,10,25,0.85)), radial-gradient(circle at top, rgba(124,58,237,0.35), transparent 55%)",
        "hero-lines":
          "radial-gradient(circle at 20% 20%, rgba(124,58,237,0.45), transparent 40%), radial-gradient(circle at 80% 0%, rgba(72,199,255,0.4), transparent 45%)",
      },
      animation: {
        pulseSlow: "pulseSlow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 4s ease-in-out infinite",
        spinSlow: "spin 18s linear infinite",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

