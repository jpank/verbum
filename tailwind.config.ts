import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        "surface-active": "var(--surface-active)",
        border: "var(--border)",

        // Text
        "t-primary": "var(--t-primary)",
        "t-secondary": "var(--t-secondary)",
        "t-tertiary": "var(--t-tertiary)",

        // Accent — Apple blue
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },

        // Rose — from iPhone pink body
        rose: {
          DEFAULT: "#F2D1CA",
          soft: "var(--rose-soft)",
          muted: "#E8B4A8",
        },

        // Semantic
        correct: "var(--correct)",
        "correct-soft": "var(--correct-soft)",
        incorrect: "var(--incorrect)",
        "incorrect-soft": "var(--incorrect-soft)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
