import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          teal: "var(--primary-teal)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          bg: "var(--primary-bg)"
        },
        accent: {
          gold: "var(--accent-gold)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)"
        },
        coral: {
          DEFAULT: "var(--coral)",
          light: "var(--coral-light)",
          dark: "var(--coral-dark)"
        },
        cream: "var(--cream)",
        "sky-blue": "var(--sky-blue)",
        surface: {
          base: "var(--surface-base)",
          card: "var(--surface-card)"
        },
        success: "var(--success)",
        error: "var(--error)",
        text: {
          main: "var(--text-main)",
          muted: "var(--text-muted)"
        },
        border: {
          soft: "var(--border-soft)"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "sans-serif"
        ]
      },
      boxShadow: {
        apple:
          "0 20px 60px rgba(var(--primary-rgb), 0.10), 0 4px 18px rgba(var(--background-rgb), 0.08)",
        panel: "0 30px 90px rgba(var(--background-rgb), 0.08)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 15% 15%, rgba(var(--primary-light-rgb), 0.22), transparent 32%), radial-gradient(circle at 85% 20%, rgba(var(--accent-rgb), 0.16), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.86), rgba(232,246,245,0.86))"
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "soft-bar": {
          "0%, 100%": {
            transform: "scaleY(0.48)",
            opacity: "0.45"
          },
          "50%": {
            transform: "scaleY(1)",
            opacity: "1"
          }
        }
      },
      animation: {
        "fade-up": "fade-up 0.48s cubic-bezier(0.22, 1, 0.36, 1) both",
        "soft-bar": "soft-bar 1.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
