module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./content/**/*.{md,mdx}"] ,
  theme: {
    extend: {
      colors: {
        brand: '#0ea5a4'
      },
      fontFamily: {
        sans: ['Poppins', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
}
