import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      colors: {
        "neon-cyan":  "#00f5ff",
        "neon-blue":  "#0066ff",
        "neon-green": "#00ff88",
        "dark-950":   "#020408",
        "dark-900":   "#050d14",
        "dark-800":   "#091824",
      },
      animation: {
        "float":       "float 6s ease-in-out infinite",
        "glow-pulse":  "glowPulse 2.5s ease-in-out infinite",
        "fade-up":     "fadeUp 0.6s ease forwards",
        "fade-in":     "fadeIn 0.5s ease forwards",
        "shimmer":     "shimmer 2.5s linear infinite",
        "scan-line":   "scanLine 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1)" },
          "50%":      { boxShadow: "0 0 40px rgba(0,245,255,0.6), 0 0 100px rgba(0,245,255,0.3)" },
        },
        scanLine: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
