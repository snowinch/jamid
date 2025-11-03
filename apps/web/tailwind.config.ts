import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E6007A",
          50: "#FFE5F3",
          100: "#FFCCE6",
          200: "#FF99CD",
          300: "#FF66B4",
          400: "#FF339B",
          500: "#E6007A",
          600: "#B30060",
          700: "#800046",
          800: "#4D002B",
          900: "#1A000F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
