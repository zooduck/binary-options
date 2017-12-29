import {_Zoobinary} from "../super/Zoobinary.super";

export const dataService = (function dataService () {
	
	const $init = () => {		
		_Zoobinary.data = {
			martingaleBets: [],
			martingaleIterationSlot: 0,
			martingaleIterationNumber: 1
		}
	}

	$init();

	const $get = () => {
		return _Zoobinary.data;
	};

	const $set = function $set (data = {}) {
		for (let key in data) {
			let val = data[key];			
			if (val) _Zoobinary.data[key] = val;					
		}
		console.log("_Zoobinary updated:", _Zoobinary);
	};

	console.log("_Zoobinary", _Zoobinary);

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
