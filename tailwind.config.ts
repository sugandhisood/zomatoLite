import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F8F5EF",
        ink: "#1C1917",
        muted: "#78716C",
        line: "#E4DED4",
        accent: "#C2410C",
        "accent-soft": "#F3E5D8",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        soft: "14px",
      },
      maxWidth: {
        page: "560px",
      },
    },
  },
  plugins: [],
};

export default config;
