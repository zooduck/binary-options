import {configDefaults} from "../_defaults/config.defaults";
export const configService = (function () {
	const config = {};
	const types = {
		capital: "number",
		brokerReturn: "number",
		martingales: "number"
	};
	// const $init = function $init () {
	// 	// if no localStorage, use defaults...
	// 	// TODO!!! (CURRENTLY ALWAYS USING DEFAULTS)
	// 	Object.assign(config, configDefaults);
	// };
	//
	// $init();

	const $set = function $set (data = {}) {
		for (let key in data) {
			let val = data[key];
			switch (types[key]) {
				case "string": val = val.toString(); break;
				case "number": val = parseFloat(val); break;
			}
			if (typeof val != types[key]) {
				console.error(`Invalid type! Expected ${types[key]} but got ${typeof val}.`);
				return;
			} else if (val) config[key] = val;
		}
		console.log("config updated:", config);
	};
	const $setWithFormData = function $setWithFormData (formData) {
		// let formData = new FormData(form);
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

	return function () {
		return {
			set: (data = {}) => {
				if (data.constructor.name === "FormData") {
					return $setWithFormData(data);
				}
				return $set(data);
			},
			get: (key = null) => {
				if (typeof key === "string" && config[key]) {
					return config[key];
				} else return config;
			}
		}
	}
})();
