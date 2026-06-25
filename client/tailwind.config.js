/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        ink: {
          50:  "#f7f7fb",
          100: "#eeeef5",
          200: "#d9d9e6",
          300: "#b8b8cf",
          400: "#8e8eb0",
          500: "#6b6b92",
          600: "#4f4f73",
          700: "#3a3a59",
          800: "#25253c",
          900: "#131322",
          950: "#08080f",
        },
        accent: {
          DEFAULT: "#a78bfa",
          glow: "#c4b5fd",
          deep:  "#7c3aed",
        },
        electric: "#22d3ee",
        mint: "#34d399",
        coral: "#fb7185",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 10%, rgba(167,139,250,0.18), transparent 45%), radial-gradient(circle at 80% 30%, rgba(34,211,238,0.14), transparent 45%), radial-gradient(circle at 50% 90%, rgba(251,113,133,0.12), transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(167,139,250,0.45)",
        "glow-cyan": "0 0 40px -10px rgba(34,211,238,0.45)",
        card: "0 10px 40px -15px rgba(0,0,0,0.5)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 30px -10px rgba(167,139,250,0.4)" },
          "50%":      { boxShadow: "0 0 60px -5px rgba(167,139,250,0.75)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
