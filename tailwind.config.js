/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./hooks/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: "#C75B39",
        cream: "#FFF8F0",
        charcoal: "#2D2D2D",
        teal: "#2A9D8F",
        "ktu-national": "#E63946",
        "ktu-sports": "#2A9D8F",
        "ktu-cultural": "#E9C46A",
        "ktu-professional": "#264653",
        "ktu-entrepreneurship": "#F4A261",
        "ktu-leadership": "#6D597A",
        "ktu-skill": "#152658",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        poster: "0 12px 32px rgba(45, 45, 45, 0.12)",
        pin: "0 6px 16px rgba(45, 45, 45, 0.2)",
      },
      backgroundImage: {
        corkboard: "url('/textures/corkboard.png')",
      },
    },
  },
  plugins: [],
};
