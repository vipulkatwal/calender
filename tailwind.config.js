/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", "Inter", "system-ui", "sans-serif"],
			},
			colors: {
				primary: {
					50: "#f0f9ff",
					100: "#e0f2fe",
					200: "#bae6fd",
					300: "#7dd3fc",
					400: "#38bdf8",
					500: "#0ea5e9",
					600: "#0284c7",
					700: "#0369a1",
					800: "#075985",
					900: "#0c4a6e",
				},
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-in": "slideIn 0.5s ease-out",
				"slide-up": "slideUp 0.5s ease-out",
				"bounce-slow": "bounce 3s infinite",
				gradient: "gradient 8s ease infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideIn: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				slideUp: {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
				gradient: {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},
			},
			boxShadow: {
				soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
				"inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
			},
			screens: {
				xs: "475px",
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
		require("tailwindcss-animate"),
		require("tailwindcss-gradients"),
	],
};
