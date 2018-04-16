import {zoobinary} from "../global/zoobinary";

export const settingsService = (function settingsService () {

	const $init = () => {
		zoobinary.settings = {
			capital: 250.00,
			brokerReturn: 0.85,
			martingales: 6,
			open: 250.00,
			targetPercent: 0.15,
			roundUpBets: false
		}
		// zoobinary.settings.targetCurrency = zoobinary.settings.open + (zoobinary.settings.open * zoobinary.settings.targetPercent);
		zoobinary.settings.targetCurrency = zoobinary.settings.open * zoobinary.settings.targetPercent;
	}

	$init();

	const types = {
		capital: "number",
		brokerReturn: "number",
		martingales: "number",
		open: "number",
		targetPercent: "number",
		roundUpBets: "boolean"
	};

	const $set = function $set (data = {}) {
		for (let key in data) {
			let val = data[key];
			switch (types[key]) {
				case "string": val = val.toString(); break;
				case "number": val = parseFloat(val); break;
				case "boolean": val = val; break;
			}
			if (typeof val != types[key]) {
				return console.error(`Invalid type! Expected ${types[key]} but got ${typeof val} (${val}).`);
			} else if (val || val == 0) {
				zoobinary.settings[key] = val;
			}
			if (key == "capital" && (val || val == 0)) {
				zoobinary.data.currentBalance = val;
			}
		}
		console.log("zoobinary updated:", zoobinary);
	};

	const $setWithFormData = function $setWithFormData (formData) {
		for (let pair of formData) {
			let key = pair[0];
			let val = pair[1];
			let data = {}
			if (val) {
				data[key] = val;
				$set(data);
			}
		}
	};

	console.log("zoobinary", zoobinary);

	return function () {
		return {
			set: (data = {}) => {
				if (data.constructor.name === "FormData") {
					return $setWithFormData(data);
				}
				return $set(data);
			},
			get: (key = null) => {
				if (typeof key === "string" && zoobinary.settings[key]) {
					return zoobinary.settings[key];
				} else return zoobinary.settings;
			}
		}
	}
})();
