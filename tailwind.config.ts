import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        verbum: {
          50: "#f5f0fa",
          100: "#ebe0f5",
          200: "#d4bfeb",
          300: "#b893db",
          400: "#9a62c7",
          500: "#7c3aad",
          600: "#6b2fa0",
          700: "#582583",
          800: "#4a2069",
          900: "#3d1b57",
          950: "#260f3a",
        },
        gold: {
          50: "#fdf8e8",
          100: "#faefc0",
          200: "#f5df85",
          300: "#ecc840",
          400: "#e2b517",
          500: "#d4a017",
          600: "#b67c0e",
          700: "#925a0e",
          800: "#784813",
          900: "#663b15",
          950: "#3b1e07",
        },
        correct: "#16a34a",
        incorrect: "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
