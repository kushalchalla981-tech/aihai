import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#eef6ff",
        surface: "rgba(255, 255, 255, 0.74)",
        "surface-warm": "rgba(238, 246, 255, 0.72)",
        fg: "#102033",
        "fg-2": "#34465f",
        muted: "#60708a",
        meta: "#4f8cff",
        border: "rgba(255, 255, 255, 0.64)",
        "border-soft": "rgba(255, 255, 255, 0.38)",
        accent: "#4f8cff",
        "accent-on": "#ffffff",
        "accent-hover": "#3b7be5",
        "accent-active": "#2f6bd0",
        success: "#22c55e",
        warn: "#f59e0b",
        danger: "#ef4444",
        "accent-light": "#6ba3ff",
        "surface-on": "#ffffff",
        "accent-soft": "rgba(79, 140, 255, 0.14)",
        "fg-soft": "rgba(16, 32, 51, 0.06)",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ['"SF Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        "h1": ["clamp(36px, 4.5vw, 56px)", { lineHeight: "1.04", letterSpacing: "-0.025em", fontWeight: "600" }],
        "h2": ["clamp(24px, 3vw, 36px)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h3": ["18px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "lead": ["17px", { lineHeight: "1.55" }],
        "body": ["15px", { lineHeight: "1.55" }],
        "meta": ["13px", { lineHeight: "1.55" }],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
      },
      borderRadius: {
        "sm": "16px",
        "md": "24px",
        "lg": "36px",
        "pill": "9999px",
        "DEFAULT": "10px",
        "xl": "20px",
      },
      gap: {
        "xs": "6px",
        "sm": "10px",
        "md": "16px",
        "lg": "24px",
        "xl": "40px",
        "2xl": "72px",
      },
      maxWidth: {
        container: "1120px",
      },
      boxShadow: {
        "elev-raised": "0 24px 80px rgba(79, 140, 255, 0.18)",
        "elev-ring": "0 0 0 1px rgba(255, 255, 255, 0.64)",
        "glow-card": "0 0 20px rgba(79, 140, 255, 0.15), 0 0 60px rgba(79, 140, 255, 0.08)",
      },
      transitionDuration: {
        "fast": "180ms",
        "base": "280ms",
      },
      transitionTimingFunction: {
        "ease-standards": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.92)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-bounce": {
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "orb-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "25%": { transform: "translate(60px, -40px) scale(1.08) rotate(5deg)" },
          "50%": { transform: "translate(-30px, 60px) scale(0.92) rotate(-3deg)" },
          "75%": { transform: "translate(40px, 20px) scale(1.04) rotate(4deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 4px currentColor" },
          "50%": { boxShadow: "0 0 16px currentColor, 0 0 32px currentColor" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
        "live-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.5)" },
          "70%": { boxShadow: "0 0 0 8px rgba(34, 197, 94, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "draw-line": {
          to: { strokeDashoffset: "0" },
        },
        "shine-sweep": {
          "0%": { backgroundPosition: "300% 0" },
          "30%": { backgroundPosition: "-100% 0" },
          "100%": { backgroundPosition: "-100% 0" },
        },
        "mesh-morph": {
          "0%": { opacity: "0.6" },
          "100%": { opacity: "1" },
        },
        "sparkle-twinkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "0.6", transform: "scale(1)" },
        },
        "chart-bar-grow": {
          to: { transform: "scaleY(1)" },
        },
        "log-flash": {
          "0%": { backgroundColor: "rgba(79, 140, 255, 0.08)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-up": "slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-bounce": "slide-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "orb-float": "orb-float 25s ease-in-out infinite",
        "glow-pulse": "glow-pulse 1.5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        "live-pulse": "live-pulse 1.5s ease-in-out infinite",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "shine-sweep": "shine-sweep 8s ease-in-out infinite",
        "sparkle": "sparkle-twinkle 4s ease-in-out infinite",
        "chart-bar": "chart-bar-grow 1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "log-flash": "log-flash 2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
