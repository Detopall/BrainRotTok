import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [
		heroui({
			themes: {
				"green-dark": {
					extend: "dark",
					colors: {
						background: "#000000",
						foreground: "#FFFFFF",
						primary: {
							50: "#0B3A1F",
							100: "#0F5229",
							200: "#18733A",
							300: "#23984B",
							400: "#31C05E",
							500: "#62ED7E",
							600: "#82F69F",
							700: "#ADF9C0",
							800: "#D5F9DD",
							900: "#ECFEEF",
							DEFAULT: "#62ED7E",
							foreground: "#FFFFFF",
						},
						focus: "#82F69F",
					},
					layout: {
						disabledOpacity: "0.3",
						radius: {
							small: "4px",
							medium: "6px",
							large: "8px",
						},
						borderWidth: {
							small: "1px",
							medium: "2px",
							large: "3px",
						},
					},
				},
			},
			"green-light": {
				extend: "light",
				colors: {
					background: "#FFFFFF",
					foreground: "#000000",
					primary: {
						50: "#ECFEEF",
						100: "#D5F9DD",
						200: "#ADF9C0",
						300: "#82F69F",
						400: "#62ED7E",
						500: "#31C05E",
						600: "#23984B",
						700: "#18733A",
						800: "#0F5229",
						900: "#0B3A1F",
						DEFAULT: "#31C05E",
						foreground: "#000000",
					},
					focus: "#23984B",
				},
				layout: {
					disabledOpacity: "0.3",
					radius: {
						small: "4px",
						medium: "6px",
						large: "8px",
					},
					borderWidth: {
						small: "1px",
						medium: "2px",
						large: "3px",
					},
				},
			},
		}),
	],
};
