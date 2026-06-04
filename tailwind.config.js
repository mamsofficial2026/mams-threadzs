/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Keeping your old code intact
        primary: '#111111', 
        secondary: '#f5f5f5', 
        
        // ===================================================
        // 🎨 NEW: 90s Vintage Retro Drip Color Palette Matrix
        // ===================================================
        vintage: {
          bg: '#F4EFEA',       // Oatmeal / Light Sand (Whole Site Base)
          text: '#242525',     // Charcoal Dark Gray (Premium Font Color)
          mustard: '#DE9B26',  // Vintage Mustard (Main Buttons / Action Highlights)
          forest: '#2D523E',   // Forest Green (Offer Badges / Sale Elements)
        }
      }
    },
  },
  plugins: [],
}