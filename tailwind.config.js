/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "index.html",
    "src/components/**/*.tsx",
    "src/layouts/**/*.tsx",
    "src/app/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        serif: ["var(--font-co-headline)", "serif"],
      },
      colors: {
        primary: "#0fbf4d",
      },
    },
  },
};
