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
        "page-bg": "var(--page-bg)",
        "surface-base": "var(--surface-base)",
        "surface-elevated": "var(--surface-elevated)",
        "border-soft": "var(--border-soft)",
        "border-strong": "var(--border-strong)",

        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",

        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-border": "var(--accent-border)",

        "status-critical": "var(--status-critical)",
        "status-high": "var(--status-high)",
        "status-medium": "var(--status-medium)",
        "status-low": "var(--status-low)",
        "status-success": "var(--status-success)",

        // Aliases for compatibility/components
        danger: "var(--status-critical)",
        warn: "var(--status-high)",
        info: "var(--status-medium)",
        muted: "var(--text-secondary)",
        fg: "var(--text-primary)",
        "fg-2": "var(--text-secondary)",
        "fg-soft": "rgba(255,255,255,0.04)",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        "h1": ["24px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h2": ["16px", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body": ["14px", { lineHeight: "1.5" }],
        "meta": ["12px", { lineHeight: "1.5" }],
      },
      borderRadius: {
        "sm": "4px",
        "DEFAULT": "6px",
        "md": "8px",
        "lg": "12px",
        "full": "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
