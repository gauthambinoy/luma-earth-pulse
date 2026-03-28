import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0f1a",
        surface: "rgba(17, 24, 39, 0.7)",
        border: "rgba(255,255,255,0.06)",
        accent: "#6EE7B7",
        "accent-blue": "#60A5FA",
        "accent-purple": "#C4B5FD",
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [],
};

export default config;
