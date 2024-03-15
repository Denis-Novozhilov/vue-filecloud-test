// tailwind.config.js
export default {
	// purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	content: [
		// Example content paths...
		'./public/**/*.html',
		'./src/**/*.{js,jsx,ts,tsx,vue}'
	],
	// darkMode: false, // or 'media' or 'class'
	darkMode: 'media', // or 'media' or 'class'
	theme: {
		extend: {}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
// /** @type {import('tailwindcss').Config} */
// module.exports = {
// 	content: ['./src/**/*.{html,js}'],
// 	theme: {
// 		extend: {}
// 	},
// 	plugins: []
// };
