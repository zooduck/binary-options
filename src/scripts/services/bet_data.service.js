import {betDataDefaults} from "../_defaults/bet_data.defaults";
import {viewBinderService} from "./view_binder.service";
import {settingsService} from "./settings.service";
import {dataService} from "./data.service";
import {viewDataService} from "./view_data.service";

export const betDataService = (function () {

	const betData = {};

	const $init = function $init () {
		// if no localStorage, use defaults...
		// ============================================
		// TODO!!! (CURRENTLY ALWAYS USING DEFAULTS)
		// ============================================
		Object.assign(betData, betDataDefaults);
	};

	$init();

	const $set = function $set (martingaleData) {
		const data = dataService().get();
		console.log("dataService data:", data);
		const settings = settingsService().get();

		// get data from the relevant martingale iteration...
		var martingaleBet = data.martingaleBets[data.martingaleIterationSlot];
		//var data = martingaleData[_Zoobinary.data.martingaleIterationSlot];

		// =================================================
		// TODO: use Floats or Ceils based on settings
		// =================================================
		
		console.log("martingaleBet:", martingaleBet);

		const viewObj = {
			header: {
				capital: `£${settings.capital}`,
				brokerRtn: `Broker: ${parseInt(settings.brokerReturn * 100)}%`
				
			},
			bet: {
				currency: `£${martingaleBet.currencyCeil}`,
				win: `£${martingaleBet.currencyCeilReturnNet} / ${martingaleBet.percentCeilReturnNet}%`,
				lose: `£${martingaleBet.currencyCeilTotal} / ${martingaleBet.percentCeilTotal}%`,
				martingales: settings.martingales,
				martingaleIterationNumber: data.martingaleIterationNumber
			}	
		}
		// viewObj.header.capital = `£${settings.capital}`;
		// viewObj.header.brokerReturn = `Broker: ${parseInt(settings.brokerReturn * 100)}%`;
		// viewObj.bet.currency = `£${martingaleBet.currencyCeil}`; 
		// viewObj.bet.win = `£${martingaleBet.currencyCeilReturnNet} / ${martingaleBet.percentCeilReturnNet}%`;
		// viewObj.bet.lose = `£${martingaleBet.currencyCeilTotal} / ${martingaleBet.percentCeilTotal}%`;		
		// viewObj.bet.martingales = settings.martingales;
		// viewObj.bet.martingaleIterationNumber = data.martingaleIterationNumber;

		console.log("viewObj", viewObj);

		viewDataService().set(viewObj);

		viewBinderService().bind();

		return;
	};

	return function () {
		return {
			set: (martingaleData) => {
				return $set(martingaleData);
			}
		}
	}

})();
