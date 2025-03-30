/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Si usas la carpeta /app
    "./pages/**/*.{js,ts,jsx,tsx}", // Por si usas también /pages
    "./components/**/*.{js,ts,jsx,tsx}", // Si tienes componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
