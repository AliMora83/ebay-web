/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        ebayDark: "#080a0b",
        primary: "#372948",
        secondary: "#2c2b2b",
        accent: "#e6e2dc",
        accent2: "#fffdf9",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
