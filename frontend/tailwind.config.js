const values = {
	"1/100": "1%",
	"2/100": "2%",
	"3/100": "3%",
	"4/100": "4%",
	"5/100": "5%",
	"6/100": "6%",
	"7/100": "7%",
	"8/100": "8%",
	"9/100": "9%",
	"10/100": "10%",
	"11/100": "11%",
	"12/100": "12%",
	"13/100": "13%",
	"14/100": "14%",
	"15/100": "15%",
	"16/100": "16%",
	"17/100": "17%",
	"18/100": "18%",
	"19/100": "19%",
	"20/100": "20%",
	// ...
	"80/100": "80%",
	"81/100": "81%",
	"82/100": "82%",
	"83/100": "83%",
	"84/100": "84%",
	"85/100": "85%",
	"86/100": "86%",
	"87/100": "87%",
	"88/100": "88%",
	"89/100": "89%",
	"90/100": "90%",
	"91/100": "91%",
	"92/100": "92%",
	"93/100": "93%",
	"94/100": "94%",
	"96/100": "96%",
	"97/100": "97%",
	"98/100": "98%",
	"99/100": "99%",
	"120p": "120px",
};

module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			height: values,
			width: values,
			maxWidth: values,
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
