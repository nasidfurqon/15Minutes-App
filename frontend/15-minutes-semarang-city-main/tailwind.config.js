/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"brand-dark-blue": "#2A3A4E",
				"brand-medium-blue": "#5B7A9A",
				"brand-light-blue": "#9DB2C8",
				"brand-accent": "#F0EAD6",
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				poppins: ["Poppins", "sans-serif"],
			},
			screens: {
				xs: "480px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1536px",
				"3xl": "1920px",
			},
			backgroundImage: {
				// "main-page-bg": "url('/src/assets/semarang-background.jpg')",
			},
		},
	},
	plugins: [],
};
