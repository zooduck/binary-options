import {zoobinary} from "../global/zoobinary";
import {betDataService} from "./bet_data.service";
import {settingsService} from "./settings.service";

export const dataService = (function dataService () {

	const $init = () => {
		zoobinary.data = {
			currentBalance: settingsService().get().capital,
			martingaleBets: [],
			martingaleIterationSlot: 0,
			martingaleIterationNumber: 1
		}
	}

	$init();

	const $get = () => {
		return zoobinary.data;
	};

	const $set = function $set (data = {}) {
		for (let key in data) {
			let val = data[key];
			if (val === 0 || val) zoobinary.data[key] = val;
		}
		zoobinary.data.martingaleIterationNumber = zoobinary.data.martingaleIterationSlot + 1;
		console.log("zoobinary updated:", zoobinary);
		betDataService().set();
	};

	console.log("zoobinary", zoobinary);

	return function () {
		return {
			get: () => {
				return $get();
			},
			set: (data = {}) => {
				return $set(data);
			}
		}
	}
})();
