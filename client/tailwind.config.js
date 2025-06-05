// tailwind.config.js
const defaultColors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // Ундаагүй default colors-г нэмэгдүүлэх
      colors: {
        green: defaultColors.green,
        yellow: defaultColors.yellow,
        purple: defaultColors.purple,
        gray: defaultColors.gray,
        blue: defaultColors.blue,
        red: defaultColors.red,
        // таны semantic өнгүүд:
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // … бусад semantic…
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
