import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#d4af37",
          light:   "#e8c84a",
          dark:    "#b8962e",
          dim:     "rgba(212,175,55,0.15)",
        },
        bg: {
          DEFAULT: "#080808",
          "2": "#0d0d0d",
          "3": "#111111",
          "4": "#161616",
          "5": "#1a1a1a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)",    "system-ui", "sans-serif"],
      },
      animation: {
        "glow-pulse":  "glowPulse 3s ease-in-out infinite",
        "float":       "float 6s ease-in-out infinite",
        "shimmer":     "shimmer 2.5s linear infinite",
        "scan":        "scan 3s linear infinite",
      },
      keyframes: {
        glowPulse: {
          "0%,100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":     { opacity: "0.8", transform: "scale(1.05)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4af37, #e8c84a, #b8962e)",
        "gold-text":     "linear-gradient(180deg, #e8e0cc 0%, #fff 35%, #d4af37 60%, #8a6c1e 100%)",
        "glass":         "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        "cyber-grid":    "linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
