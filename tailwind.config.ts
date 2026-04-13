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
        "accent-cyan": "#22D3EE",
        "accent-pink": "#F472B6",
        aurora: {
          green: "#6EE7B7",
          cyan: "#22D3EE",
          blue: "#60A5FA",
          purple: "#C4B5FD",
          pink: "#F472B6",
        },
        neon: {
          cyan: "#00FFFF",
          green: "#39FF14",
          pink: "#FF006E",
          purple: "#BF00FF",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.06)",
          medium: "rgba(255, 255, 255, 0.1)",
          heavy: "rgba(255, 255, 255, 0.15)",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(110, 231, 183, 0.15)",
        "glow-md": "0 0 30px rgba(110, 231, 183, 0.25)",
        "glow-lg": "0 0 50px rgba(110, 231, 183, 0.35)",
        "glow-cyan": "0 0 30px rgba(34, 211, 238, 0.25)",
        "glow-purple": "0 0 30px rgba(196, 181, 253, 0.25)",
        aurora: "0 0 20px rgba(110,231,183,0.2), 0 0 40px rgba(96,165,250,0.15), 0 0 60px rgba(196,181,253,0.1)",
        "glass-sm": "0 2px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        "glass-md": "0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "glass-lg": "0 8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        auroraGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(110,231,183,0.2)" },
          "33%": { boxShadow: "0 0 30px rgba(96,165,250,0.3)" },
          "66%": { boxShadow: "0 0 25px rgba(196,181,253,0.25)" },
        },
        auroraShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        rotateBorder: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        waveShimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
        "aurora-glow": "auroraGlow 4s ease-in-out infinite",
        "aurora-shift": "auroraShift 6s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "rotate-border": "rotateBorder 3s linear infinite",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "wave-shimmer": "waveShimmer 2s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        premium: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
