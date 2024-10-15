import animate from "tailwindcss-animate";

/** @type {import("tailwindcss").Config} */
const tailwindcssConfig = {
  content: [
    "index.html",
    "src/main.tsx",
    "src/components/**/*.tsx",
    "src/layouts/**/*.tsx",
    "src/pages/**/*.tsx",
  ],
  plugins: [animate],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ['"Co Headline"', "serif"],
      },
      colors: {
        primary: "#0fbf4d",
      },
    },
  },
};

export default tailwindcssConfig;
