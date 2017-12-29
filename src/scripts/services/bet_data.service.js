// import {_Zoobinary} from "../super/Zoobinary.super";
import {betDataDefaults} from "../_defaults/bet_data.defaults";
import {viewBinderService} from "./view_binder.service";
// import {configService} from "./config.service";
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
		let data = dataService().get();
		console.log("dataserice data:", data);
		let settings = settingsService().get();

		// get data from the relevant martingale iteration...
		var martingaleBet = data.martingaleBets[data.martingaleIterationSlot];
		//var data = martingaleData[_Zoobinary.data.martingaleIterationSlot];

		// =================================================
		// TODO: use Floats or Ceils based on settings
		// =================================================
		
		console.log("martingaleBet:", martingaleBet);

		let viewObj = {
			bet: {},
			header: {}
		}
		viewObj.header.capital = `£${settings.capital}`;
		viewObj.header.brokerReturn = `${settings.brokerReturn * 100}%`;
		viewObj.bet.currency = `£${martingaleBet.currencyCeil}`; 
		viewObj.bet.win = `£${martingaleBet.currencyCeilReturnNet} / ${martingaleBet.percentCeilReturnNet}%`;
		viewObj.bet.lose = `£${martingaleBet.currencyCeilTotal} / ${martingaleBet.percentCeilTotal}%`;		
		viewObj.bet.martingales = settings.martingales;
		viewObj.bet.martingaleIterationNumber = data.martingaleIterationNumber;

		console.log("viewObj", viewObj);

		viewDataService().set(viewObj);

		// _Zoobinary.view.bet.currency = `£${martingaleBet.currencyCeil}`; 
		// _Zoobinary.view.bet.win = `£${martingaleBet.currencyCeilReturnNet} / ${martingaleBet.percentCeilReturnNet}%`;
		// _Zoobinary.view.bet.lose = `£${martingaleBet.currencyCeilTotal} / ${martingaleBet.percentCeilTotal}%`;

		// // get latest data from settings...		
		// let settings = settingsService().get();
		// _Zoobinary.view.header.capital = `£${settings.capital}`;
		// _Zoobinary.view.bet.martingales = settings.martingales;
		
		// _Zoobinary.view.bet.martingaleIterationNumber = data.martingaleIterationNumber;


		//console.log("_Zoobinary object updated:", _Zoobinary);

		viewBinderService().bind();

		return;



		// // get data from the relevant martingale iteration...
		// var data = martingaleData[betData.martingaleIterationSlot];
		// betData.bet = `£${data.currencyCeil}`;
		// betData.win = `£${data.currencyCeilReturnNet} / ${data.percentCeilReturnNet}%`;
		// betData.lose = `£${data.currencyCeilTotal} / ${data.percentCeilTotal}%`;

		// // get latest data from config...
		// var config = configService().get();
		// betData.capital = `£${config.capital}`;
		// betData.martingales = config.martingales;

		// console.log("betData updated:", betData);



		// viewBinderService().bind({name: "betData", data: betData});
	};

	return function () {
		return {
			set: (martingaleData) => {
				return $set(martingaleData);
			}
		}
	}

})();
