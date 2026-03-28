"use client";

import { motion } from "framer-motion";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  compact?: boolean;
}

export default function ThemeToggle({ theme, onToggle, compact = false }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex items-center rounded-full border transition-all duration-300 ${
        compact ? "h-7 w-12" : "h-8 w-14"
      }`}
      style={{
        background: theme === "dark" ? "rgba(110,231,183,0.15)" : "rgba(0,0,0,0.06)",
        borderColor: theme === "dark" ? "rgba(110,231,183,0.3)" : "rgba(0,0,0,0.1)",
      }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        className={`flex items-center justify-center rounded-full shadow-sm ${
          compact ? "h-5 w-5" : "h-6 w-6"
        }`}
        style={{
          background: theme === "dark" ? "#1e293b" : "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
        animate={{
          x: theme === "dark" ? (compact ? 22 : 26) : 3,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <span className="text-[10px]">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </motion.div>
    </button>
  );
}
