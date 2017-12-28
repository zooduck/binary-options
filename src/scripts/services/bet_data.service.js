import {betDataDefaults} from "../_defaults/bet_data.defaults";
import {viewBinderService} from "./view_binder.service";
import {configService} from "./config.service";

export const betDataService = (function () {

	const betData = {};

	const $init = function $init () {
		// if no localStorage, use defaults...
		// TODO!!! (CURRENTLY ALWAYS USING DEFAULTS)
		Object.assign(betData, betDataDefaults);
	};

	$init();

	const $set = function $set (martingaleData) {
		// get data from the relevant martingale iteration...
		let data = martingaleData[betData.martingaleIterationSlot];
		betData.bet = `£${data.currencyCeil}`;
		betData.win = `£${data.currencyCeilReturnNet} / ${data.percentCeilReturnNet}%`;
		betData.lose = `£${data.currencyCeilTotal} / ${data.percentCeilTotal}%`;

		// get latest data from config...
		let config = configService().get();
		betData.capital = `£${config.capital}`;
		betData.martingales = config.martingales;

		console.log("betData updated:", betData);

		viewBinderService().bind({name: "betData", data: betData});
	};

	return function () {
		return {
			set: (martingaleData) => {
				return $set(martingaleData);
			}
		}
	}

})();
