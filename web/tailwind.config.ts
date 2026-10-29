import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4fc",
          100: "#dbe9f8",
          200: "#b7d2f1",
          300: "#8fb9e9",
          400: "#6aa2e2",
          500: "#4a8bd9", // primary blue accent from the sheet
          600: "#3a70b3",
          700: "#2c5588",
          800: "#1e3a5f",
          900: "#122238",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
