import {zoobinary} from "../global/zoobinary";
export const viewDataService = (function viewDataService () {

	const $init = () => {
		zoobinary.view = {
			header: {},
			bet: {},
			settings: {}
		}
	}

	$init();

	const $get = () => {
		return zoobinary.view;
	};

	const $set = (data) => {
		for (const key in data) {
			zoobinary.view[key] = data[key];
		}
		// zoobinary.view = data;
	};

	const $setItem = (prop, val) => {
		let view = $get();
		view[prop] = val;
	};

	console.log("zoobinary", zoobinary);

	return function () {
		return {
			get: () => {
				return $get();
			},
			set: (data) => {
				$set(data);
			},
			setItem: (prop, val) => {
				return $setItem(prop, val);
			}
		}
	}
})();
