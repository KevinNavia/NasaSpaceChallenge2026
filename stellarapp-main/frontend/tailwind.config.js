/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nvidia: {
          green: "#76b900",
          "green-dark": "#5a8d00",
          "green-pale": "#bff230",
          dark: "#000000",
          elevated: "#1a1a1a",
          soft: "#f7f7f7",
          hairline: "#cccccc",
          "hairline-dark": "#333333",
          mute: "#757575",
          stone: "#898989",
        },
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
        "3xl": "2px",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
