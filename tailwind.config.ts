import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C1F1B",
        canvas: "#FBFAF7",
        "canvas-alt": "#F2F1EC",
        surface: "#F2F1EC",
        line: "#E4E2DA",
        mute: "#6B6F68",
        accent: {
          DEFAULT: "#3D6B4C",
          soft: "#E4EEE7",
        },
        safety: "#B8720A",
        caution: "#A8402A",
        /** Reserved for night-course badges/filters only — never a page background. */
        night: "#1C2430",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      spacing: {
        section: "48px",
      },
      borderRadius: {
        card: "12px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
