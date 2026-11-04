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
        justspik: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // Brand Teal Core
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        surface: {
          dark: "#090D11",
          card: "#111822",
          elevated: "#182230",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(45, 212, 191, 0.3)",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "teal-glow": "0 0 35px -5px rgba(20, 184, 166, 0.35)",
        "teal-sm": "0 0 15px -2px rgba(45, 212, 191, 0.3)",
        "mic-active": "0 0 45px 5px rgba(20, 184, 166, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "wave-bounce": "bounce 1.2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
