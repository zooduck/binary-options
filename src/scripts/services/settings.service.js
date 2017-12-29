import {_Zoobinary} from "../super/Zoobinary.super";

export const settingsService = (function settingsService () {
	
	const $init = () => {		
		_Zoobinary.settings = {
			capital: 0.00,
			open: 0.00,
			brokerReturn: 0.85,
			martingales: 5
		}
	}

	$init();

	const types = {
		capital: "number",
		brokerReturn: "number",
		martingales: "number"
	};

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
			} else if (val) _Zoobinary.settings[key] = val;					
		}
		console.log("_Zoobinary updated:", _Zoobinary);
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


	console.log("_Zoobinary", _Zoobinary);

	return function () {
		return {
			set: (data = {}) => {
				if (data.constructor.name === "FormData") {
					return $setWithFormData(data);
				}
				return $set(data);
			},
			get: (key = null) => {				
				if (typeof key === "string" && _Zoobinary.settings[key]) {
					return _Zoobinary.settings[key];
				} else return _Zoobinary.settings;
			}
		}
	}
})();
