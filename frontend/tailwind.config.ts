import type { Config } from "tailwindcss"
import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
const config: Config = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
    flowbite.content()
  ],
  plugins: [
    flowbite.plugin()
  ]
}

export default config
