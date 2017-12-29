import {_Zoobinary} from "../super/Zoobinary.super";
const flatten = require("flat");
const unflatten = flatten.unflatten;

export const viewDataService = (function viewDataService () {
	
	const $init = () => {		
		_Zoobinary.view = {
			header: {},
			bet: {},
			settings: {}
		}
	}

	$init();

	const $get = () => {
		return _Zoobinary.view;
	};

	const $set = (data) => {
		_Zoobinary.view = data;
	};

	const $setItem = (prop, val) => {
		let view = $get();
		view[prop] = val;
	};

	console.log("_Zoobinary", _Zoobinary);

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
