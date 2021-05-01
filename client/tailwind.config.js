const colors = require("tailwindcss/colors");

module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				teal: colors.teal,
				cyan: colors.cyan,
				grayer: "#F0F1F4",
				grayest: "#333333"
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
