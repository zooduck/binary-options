//import {config} from "../config/config";
// import {configService} from "./config.service";
import {genericService} from "./generic.service";
// import {_Zoobinary} from "../global/zoobinary";
import {settingsService} from "./settings.service";
import {dataService} from "./data.service";
import {betDataService} from "./bet_data.service";

export const martingaleService = (function () {

	// const config = configService().get();
	const settings = settingsService().get();
	// const data = dataService().get();

	console.log("settings:", settings);

	// if (Object.keys(settings).length < 1) {
	// 	console.error("settings.service was not imported before martingale.service");
	// 	return;
	// }

	const $calcBet = (combinedBets, martingaleIteration, singleBet) => {

		// let cover = combinedBets / settings.brokerReturn;
		let cover = combinedBets / settingsService().getBrokerReturnAsFloat();
		let nextBet = singleBet * martingaleIteration;
		return cover + nextBet;
	};

	const $calcBets = (singleBet = 1) => {
		let combinedBets = 0;
		let bets = [];
		let martingaleIteration = 1;
		for (let n = 0, l = settings.martingales; n < l; n++) {
			// console.log("martingaleIteration", martingaleIteration);
			let bet = $calcBet(combinedBets, martingaleIteration, singleBet);
			bets.push(bet);
			combinedBets = bets.reduce(genericService().arraySum);
			martingaleIteration++;
		}
		return bets;
	};

	const $float = (integer, decimalPlaces = 2) => {
		return new Number(integer).toFixed(decimalPlaces);
	};

	const $martingaleData = (betsArr) => {
		// -------------------------------------------------------------------------
	    // NOTE: betsArr is an array of bet percentages as floats (12.5% = 0.125)
	    // -------------------------------------------------------------------------
		let currencyFloatTotal = 0;
		let percentFloatTotal = 0;
		let percentCeilTotal = 0;
		const martingaleBets = [];
		betsArr.forEach(function(betPercent, index) {
			let percentFloat = betPercent;
			percentFloatTotal += percentFloat;
			// console.log(percentFloat, percentFloatTotal);
			let currencyFloat = settings.capital * (betPercent / 100);
			currencyFloatTotal += currencyFloat;
			let currencyCeil = Math.ceil(currencyFloat);
			let currencyCeilTotal = Math.ceil(currencyFloatTotal);

			let percentCeil = currencyCeil / (settings.capital / 100);
			percentCeilTotal += percentCeil;

			const brokerReturnAsFloat = settingsService().getBrokerReturnAsFloat();
			// let currencyFloatReturnGross = currencyFloat * settings.brokerReturn;
			let currencyFloatReturnGross = currencyFloat * brokerReturnAsFloat;
			let currencyFloatReturnNet = currencyFloatReturnGross;
			// let currencyCeilReturnGross = currencyCeil * settings.brokerReturn;
			let currencyCeilReturnGross = currencyCeil * brokerReturnAsFloat;
			let currencyCeilReturnNet = currencyCeilReturnGross;
			// let percentFloatReturnGross = percentFloat * settings.brokerReturn;
			let percentFloatReturnGross = percentFloat * brokerReturnAsFloat;
			let percentFloatReturnNet = percentFloatReturnGross;
			// let percentCeilReturnGross = percentCeil * settings.brokerReturn;
			let percentCeilReturnGross = percentCeil * brokerReturnAsFloat;
			let percentCeilReturnNet = percentCeilReturnGross;

			if (martingaleBets[index-1]) {
				// subtract previous total from gross...
				currencyFloatReturnNet = currencyFloatReturnGross - martingaleBets[index-1].float.currencyTotal;
				currencyCeilReturnNet = currencyCeilReturnGross - martingaleBets[index-1].ceil.currencyTotal;
				percentFloatReturnNet = percentFloatReturnGross - martingaleBets[index-1].float.percentTotal;
				percentCeilReturnNet = percentCeilReturnGross - martingaleBets[index-1].ceil.percentTotal;
			}

			// martingaleBets.push({
			// 	index: index,
			// 	currencyFloat: $float(currencyFloat),
			// 	currencyFloatTotal: $float(currencyFloatTotal),
			// 	currencyFloatReturnGross: $float(currencyFloatReturnGross),
			// 	currencyFloatReturnNet: $float(currencyFloatReturnNet),
			// 	currencyCeil: $float(currencyCeil),
			// 	currencyCeilTotal: $float(currencyCeilTotal),
			// 	currencyCeilReturnGross: $float(currencyCeilReturnGross),
			// 	currencyCeilReturnNet: $float(currencyCeilReturnNet),
			// 	percentFloat: $float(percentFloat),
			// 	percentFloatTotal: $float(percentFloatTotal),
			// 	percentFloatReturnGross: $float(percentFloatReturnGross),
			// 	percentFloatReturnNet: $float(percentFloatReturnNet),
			// 	percentCeil: $float(percentCeil),
			// 	percentCeilTotal: $float(percentCeilTotal),
			// 	percentCeilReturnGross: $float(percentCeilReturnGross),
			// 	percentCeilReturnNet: $float(percentCeilReturnNet)
			// });

			martingaleBets.push({
				index: index,
				float: {
					currency: $float(currencyFloat),
					currencyTotal: $float(currencyFloatTotal),
					currencyReturnGross: $float(currencyFloatReturnGross),
					currencyReturnNet: $float(currencyFloatReturnNet),
					percent: $float(percentFloat),
					percentTotal: $float(percentFloatTotal),
					percentReturnGross: $float(percentFloatReturnGross),
					percentReturnNet: $float(percentFloatReturnNet),
				},
				ceil: {
					currency: $float(currencyCeil),
					currencyTotal: $float(currencyCeilTotal),
					currencyReturnGross: $float(currencyCeilReturnGross),
					currencyReturnNet: $float(currencyCeilReturnNet),
					percent: $float(percentCeil),
					percentTotal: $float(percentCeilTotal),
					percentReturnGross: $float(percentCeilReturnGross),
					percentReturnNet: $float(percentCeilReturnNet)
				}
			});

		});

		// console.table(martingaleBets);

		// dataService().set({
		// 	martingaleBets: martingaleBets,
		// 	martingaleIterationSlot: data.martingaleIterationSlot >= martingaleBets.length? 0 : data.martingaleIterationSlot
		// });

		//_Zoobinary.data.martingaleBets = betsData;
		return martingaleBets;
	};

	const $getStackedMartingales = function $getStackedMartingales () {

		// ------------------------------------------------------------------
		// we must return a Promise because using setInterval for the loop!
		// ------------------------------------------------------------------
		return new Promise ( (resolve, reject) => {
			const data = dataService().get();
			const settings = settingsService().get();
			// let singleBet = 1;
			let singleBet = data.currentBalance / settings.martingales;
			let betAdjustFactor = 3;
			let betAdjust = singleBet / betAdjustFactor; // how much to adjust the singleBet by each time we go below or above the target (99-100)
			let aboveTarget = null;
			let efficiencyLoopCount = 0;
			const targetMax = 100;
			const targetMin = 99;

			const calcBetsInterval = setInterval(function(){
				let bets = $calcBets(singleBet);

				let totalBets = bets.reduce(genericService().arraySum);
				if (totalBets <= targetMax && totalBets >= targetMin) {
					clearInterval(calcBetsInterval);
					console.warn("EFFICIENCY OF getStackedMartingales() LOOP:", efficiencyLoopCount);
					// ===================================================================
					// increase final bet up to 100%
					// NOTE: The total of all bets will always be between 99% and 100%
					// (this based on targetMin of 99 and targetMax of 100)
					// - we should then use up any remaining percentage on the last bet
					// ===================================================================
					const onePercentToleranceDiff = 100 - totalBets;
					bets[bets.length - 1] += onePercentToleranceDiff;
					resolve($martingaleData(bets));
					// return $martingaleData(bets);
				}
				if (totalBets > targetMax) {
					// reduce the singleBet
					if (aboveTarget === false) {
						betAdjust = betAdjust / betAdjustFactor;
					}
					aboveTarget = true;
					singleBet = singleBet - betAdjust;

				}
				if (totalBets < targetMax) {
					// increase the singleBet
					if (aboveTarget === true) {
						betAdjust = betAdjust / betAdjustFactor;
					}
					aboveTarget = false;
					singleBet = singleBet + betAdjust;
				}
				efficiencyLoopCount++;
			}, 0);

		});
	};


	return function () {

		return {
			update() {
				// $getStackedMartingales().then( () => {
				// 	betDataService().set();
				// });
				$getStackedMartingales().then ( (martingaleBets) => {
					const data = dataService().get();
					dataService().set({
						martingaleBets: martingaleBets,
						martingaleIterationSlot: data.martingaleIterationSlot >= martingaleBets.length? 0 : data.martingaleIterationSlot
					});
				})
			}
			// getStackedMartingales: function getStackedMartingales () {
			//
			// 	// ------------------------------------------------------------------
			// 	// we must return a Promise because using setInterval for the loop!
			// 	// ------------------------------------------------------------------
			// 	return new Promise ( (resolve, reject) => {
			//
			// 		let singleBet = 1;
			// 		let betAdjustFactor = 3;
			// 		let betAdjust = singleBet / betAdjustFactor; // how much to adjust the singleBet by each time we go below or above the target (99-100)
			// 		let aboveTarget = null;
			// 		let efficiencyLoopCount = 0;
			// 		const targetMax = 100;
			// 		const targetMin = 99;
			//
			// 		const calcBetsInterval = setInterval(function(){
			// 			let bets = $calcBets(singleBet);
			//
			// 			let totalBets = bets.reduce(genericService().arraySum);
			// 			if (totalBets <= targetMax && totalBets >= targetMin) {
			// 				clearInterval(calcBetsInterval);
			// 				console.warn("EFFICIENCY OF getStackedMartingales() LOOP:", efficiencyLoopCount);
			// 				console.table(settings);
			// 				resolve($martingaleData(bets));
			// 				// return $martingaleData(bets);
			// 			}
			// 			if (totalBets > targetMax) {
			// 				// reduce the singleBet
			// 				if (aboveTarget === false) {
			// 					betAdjust = betAdjust / betAdjustFactor;
			// 				}
			// 				aboveTarget = true;
			// 				singleBet = singleBet - betAdjust;
			//
			// 			}
			// 			if (totalBets < targetMax) {
			// 				// increase the singleBet
			// 				if (aboveTarget === true) {
			// 					betAdjust = betAdjust / betAdjustFactor;
			// 				}
			// 				aboveTarget = false;
			// 				singleBet = singleBet + betAdjust;
			// 			}
			// 			efficiencyLoopCount++;
			// 		}, 0);
			//
			// 	});
			// }
		}
	}
})();
