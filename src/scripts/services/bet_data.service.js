// import {betDataDefaults} from "../_defaults/bet_data.defaults";
import {viewBinderService} from "./view_binder.service";
import {settingsService} from "./settings.service";
import {dataService} from "./data.service";
import {viewDataService} from "./view_data.service";

export const betDataService = (function () {

	const betData = {};

	// const $init = function $init () {
	// 	// if no localStorage, use defaults...
	// 	// ============================================
	// 	// TODO!!! (CURRENTLY ALWAYS USING DEFAULTS)
	// 	// ============================================
	// 	Object.assign(betData, betDataDefaults);
	// };
	//
	// $init();

	// const $set = function $set (martingaleData) {
	const $set = function $set () {
		const data = dataService().get();
		console.log("dataService data:", data);
		const settings = settingsService().get();

		// get data from the relevant martingale iteration...
		let martingaleBet = data.martingaleBets[data.martingaleIterationSlot];
		let nextMartingaleBet = data.martingaleBets[data.martingaleIterationSlot + 1] || null;
		let previousMartingaleBet = data.martingaleBets[data.martingaleIterationSlot - 1] || null;

		// let nextMartingaleBet = data.martingaleBets[data.martingaleIterationSlot + 1] || null;
		// const nowAndNext = `£${martingaleBet[numberType].currency} / £${nextMartingaleBet[numberType].currency}`;

		console.log(`martingaleBet for iteration ${data.martingaleIterationSlot}:`, martingaleBet);

		// =================================================
		// IMPORTANT: use Floats or Ceils based on settings
		// =================================================
		const numberType = settings.roundUpBets? "ceil" : "float";
		const currentBetStr = `£${martingaleBet[numberType].currency}`;
		const nextBetStr = nextMartingaleBet? `next up... £${nextMartingaleBet[numberType].currency}` : "GAME OVER";
		const takeLossStr = previousMartingaleBet? `£${previousMartingaleBet[numberType].currencyTotal}` : "£0.00";
		const profitLoss = `${new Number(((settings.capital / settings.open) * 100) - 100).toFixed(2)}%`;
		const viewObj = {
			progressIndicator: {
				value: martingaleBet[numberType].percentTotal,
				percent: `${martingaleBet[numberType].percentTotal}%`,
				currency: `£${martingaleBet[numberType].currencyTotal}`
			},
			header: {
				capital: `£${settings.capital}`,
				currentBalance: `£${data.currentBalance}`,
				brokerReturn: `${parseInt(settings.brokerReturn * 100)}%`,
				martingales: settings.martingales,
				profitLoss: profitLoss,
				targetPercent: `${settings.targetPercent * 100}%`,
				targetPercentStatus: ((settings.capital - settings.open) / settings.targetCurrency) * 100
			},
			bet: {
				currentBet: currentBetStr,
				nextBet: nextBetStr,
				win: `${martingaleBet[numberType].percentReturnNet}% / £${martingaleBet[numberType].currencyReturnNet}`,
				lose: `${martingaleBet[numberType].percentTotal}% / £${martingaleBet[numberType].currencyTotal}`,
				takeLoss: takeLossStr,
				martingales: settings.martingales,
				martingaleIterationNumber: data.martingaleIterationNumber
			}
		};

		// const numberType = settings.roundUpBets? "Ceil" : "Float";
		// const betDataProps = {
		// 	currency: `currency${numberType}`,
		// 	currencyReturnNet: `currency${numberType}ReturnNet`,
		// 	currencyTotal: `currency${numberType}Total`,
		// 	percentReturnNet: `percent${numberType}ReturnNet`,
		// 	percentTotal: `percent${numberType}Total`
		// };
		// const viewObj = {
		// 	progressIndicator: {
		// 		value: martingaleBet[betDataProps.percentTotal],
		// 		percent: `${martingaleBet[betDataProps.percentTotal]}%`,
		// 		currency: `£${martingaleBet[betDataProps.currencyTotal]}`
		// 	},
		// 	header: {
		// 		capital: `£${settings.capital}`,
		// 		currentBalance: `£${data.currentBalance}`,
		// 		brokerReturn: `${parseInt(settings.brokerReturn * 100)}%`,
		// 		martingales: settings.martingales
		// 	},
		// 	bet: {
		// 		// currency: `£${martingaleBet.currencyCeil}`,
		// 		// win: `£${martingaleBet.currencyCeilReturnNet} / ${martingaleBet.percentCeilReturnNet}%`,
		// 		// lose: `£${martingaleBet.currencyCeilTotal} / ${martingaleBet.percentCeilTotal}%`,
		// 		currency: `£${martingaleBet[betDataProps.currency]}`,
		// 		win: `${martingaleBet[betDataProps.percentReturnNet]}% / £${martingaleBet[betDataProps.currencyReturnNet]}`,
		// 		lose: `${martingaleBet[betDataProps.percentTotal]}% / £${martingaleBet[betDataProps.currencyTotal]}`,
		// 		martingales: settings.martingales,
		// 		martingaleIterationNumber: data.martingaleIterationNumber
		// 	}
		// }


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
