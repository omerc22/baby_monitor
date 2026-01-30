import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC", // User: Background
        surface: "#FFFFFF",    // User: Surface
        primary: "#6366F1",    // User: Primary (Indigo)
        secondary: "#64748B",  // User: Secondary
        safe: "#10B981",       // User: Safe (Normal)
        alert: "#F43F5E",      // User: Alert (Danger)
        warmth: "#F59E0B",     // User: Warmth (Warm/Low Hum)
        cold: "#3B82F6",       // User: Blue (Cold < 18)
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
