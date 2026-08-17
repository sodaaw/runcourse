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
        ink: "#14171A",
        canvas: "#FFFFFF",
        surface: "#F4F5F3",
        line: "#E2E4E1",
        mute: "#767B76",
        accent: {
          DEFAULT: "#3D6B4C",
          soft: "#E4EEE7",
        },
        safety: "#FFB020",
        caution: "#C4432B",
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
        card: "4px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
