import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        burgundy: "#4A1025",
        champagne: "#D6B46A",
        ivory: "#FFF9EF",
        antique: "#AA8750",
        emerald: "#123B32",
        midnight: "#15110F",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Jost'", "system-ui", "sans-serif"],
        script: ["'Mrs Saint Delafield'", "'Snell Roundhand'", "cursive"],
      },
      letterSpacing: { royal: "0.32em" },
    },
  },
  plugins: [],
};
export default config;
