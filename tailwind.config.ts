import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // The fonts the app actually loads (see styles/foundation.css and styles/typography.css).
      fontFamily: {
        sans: ["Barlow", "ui-sans-serif", "system-ui", "sans-serif"],
        // Literata, or condensed Barlow in a service role (see styles/foundation.css).
        display: ["var(--font-heading)"],
        serif: ["Literata", "Georgia", "Times New Roman", "serif"],
      },
      // Every color comes from the active theme's variables (styles/themes/). Use these instead of Tailwind's
      // stock palette (red-500, lime-700, ...), which would ignore the theme.
      colors: {
        success: "hsl(var(--success))",
        cinnabar: "hsl(var(--cinnabar))",
        "icon-gold": "hsl(var(--icon-gold))",
        "liturgical-warm": "hsl(var(--liturgical-warm))",
        "byzantine-blue": "hsl(var(--byzantine-blue))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.2rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Open and close with opacity and a small slide only (both run on the GPU). The panel takes its height at
        // once, so nothing below has to re-lay out on every frame.
        "accordion-down": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-up": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-4px)" },
        },
        // A slow candle-like drift for the homepage glow.
        drift: {
          "0%, 100%": { transform: "translate3d(-50%, 0, 0) scale(1)", opacity: "0.55" },
          "50%": { transform: "translate3d(-46%, 1.5rem, 0) scale(1.12)", opacity: "0.85" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        drift: "drift 14s ease-in-out infinite",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // touch: styles for finger input only (phones, tablets), so tap targets can grow to 44px without changing the mouse layout.
    plugin(({ addVariant }) => addVariant("touch", "@media (pointer: coarse)")),
  ],
} satisfies Config;
