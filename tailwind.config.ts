import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        verticall: {
          dark: "#1a3a2a",
          mid: "#2d6a4f",
          light: "#52b788",
          pale: "#d8f3dc",
          accent: "#f4a261",
          cream: "#faf8f2"
        }
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
