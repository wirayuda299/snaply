import type { Config } from "tailwindcss";

const config = {
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
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2FA8F2",
          dark: "#1E252B",
        },
        secondary: {
          DEFAULT: "#3F4354",
          light: "#97989D",
          dark: "#2C353D",
          "dark-2": "#262D34",
          blue: "#EBF2FC",
          red: "#FFECE6",
        },
        white: {
          DEFAULT: "#FFFFFF",
          800: "#F7F7F7",
          700: "#F4F6F8",
        },
        yellow: {
          10: "#FDF4EA",
        },
        blue: {
          10: "#EBF2FC",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
