const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}","./node_modules/flowbite/**/*.js",flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),  flowbite.plugin()
  ],
}
// "./index.html",
