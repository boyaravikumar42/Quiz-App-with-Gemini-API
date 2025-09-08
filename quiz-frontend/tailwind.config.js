// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Adjust as per your project
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "red", // custom light shade
          DEFAULT: "#0ea5e9", // main primary color
          dark: "#0369a1",   // darker variant
        },
        secondary: "#9333ea", // single custom color
        customGray: "#1f2937", // another custom color
      },
    },
  },
  plugins: [],
};
