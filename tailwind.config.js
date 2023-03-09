/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/tw-elements/dist/js/**/*.js',
    "./node_modules/flowbite/**/*.js",
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx,scss}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  plugins: [require('tw-elements/dist/plugin'), require('flowbite/plugin')],
}
