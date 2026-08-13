/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple:      "#79709E",
        lavender:    "#C9BFE9",
        "lav-tint":  "#D9D5F7",
        grey:        "#F4F4F4",
        charcoal:    "#040610",
        orange:      "#E5974D",
        yellow:      "#F3C948",
        "yel-tint":  "#FFF38B",
        muted:       "#6E6F75",
      },
      fontFamily: {
        sans:    ["ABC Diatype", "Roboto", "Helvetica", "sans-serif"],
        serif:   ["Ivar Text", "Lora", "serif"],
      },
    },
  },
  plugins: [],
}
