/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-datepicker/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#BDA47A",
        chocolate: "#3B2F2F",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}