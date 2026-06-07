import type { Config } from "tailwindcss";

/**
 * NEXUS design tokens — the shared color/spacing/type system extracted from
 * the original Stitch mockups. Single source of truth for the whole app.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#3a3939",
        "surface-variant": "#353534",
        "surface-tint": "#a5d700",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c3c9ad",
        "on-background": "#e5e2e1",
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
        outline: "#8d937a",
        "outline-variant": "#434934",
        // Primary — neon lime
        primary: "#ffffff",
        "primary-fixed": "#bff520",
        "primary-fixed-dim": "#a5d700",
        "primary-container": "#bff520",
        "on-primary": "#273500",
        "on-primary-fixed": "#151f00",
        "on-primary-fixed-variant": "#3a4d00",
        "on-primary-container": "#536d00",
        "inverse-primary": "#4e6700",
        // Secondary — cyan
        secondary: "#d3fbff",
        "secondary-fixed": "#7df4ff",
        "secondary-fixed-dim": "#00dbe9",
        "secondary-container": "#00eefc",
        "on-secondary": "#00363a",
        "on-secondary-fixed": "#002022",
        "on-secondary-fixed-variant": "#004f54",
        "on-secondary-container": "#00686f",
        // Tertiary — magenta
        tertiary: "#ffffff",
        "tertiary-fixed": "#ffd7f5",
        "tertiary-fixed-dim": "#ffabf3",
        "tertiary-container": "#ffd7f5",
        "on-tertiary": "#5b005b",
        "on-tertiary-fixed": "#380038",
        "on-tertiary-fixed-variant": "#810081",
        "on-tertiary-container": "#b300b3",
        // Error
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
      },
      spacing: {
        xs: "4px",
        base: "8px",
        sm: "12px",
        gutter: "16px",
        md: "24px",
        lg: "48px",
        xl: "80px",
        "margin-mobile": "20px",
        "margin-desktop": "64px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-varela)", "sans-serif"],
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "1", fontWeight: "500" }],
        "label-md": ["14px", { lineHeight: "1", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
      },
      boxShadow: {
        "neon-primary": "0 0 15px rgba(191, 245, 32, 0.4)",
        "neon-secondary": "0 0 15px rgba(0, 238, 252, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
