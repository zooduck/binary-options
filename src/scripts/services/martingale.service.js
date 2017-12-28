//import {config} from "../config/config";
import {configService} from "./config.service";
import {genericService} from "./generic.service";

export const martingaleService = (function () {
	
	const config = configService().get();

	if (Object.keys(config).length < 1) {
		alert("config.service was not imported before martingale.service");
		return;
	}

	const $calcBet = (combinedBets, martingaleIteration, singleBet) => {		
		let cover = combinedBets / config.brokerReturn;
		let nextBet = singleBet * martingaleIteration;
		return cover + nextBet;		
	};

	const $calcBets = (singleBet = 1) => {
		let combinedBets = 0;
		let bets = [];
		let martingaleIteration = 1;
		for (let n = 0, l = config.martingales; n < l; n++) {
			
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
	    // NOTE: betsArr is an array of bet percentages as floats (12.5% = 0.125)	
		let currencyFloatTotal = 0;
		let percentFloatTotal = 0;
		let percentCeilTotal = 0;
		const betsData = [];
		betsArr.forEach(function(betPercent, index) {
			let percentFloat = betPercent;
			percentFloatTotal += percentFloat;
			console.log(percentFloat, percentFloatTotal);
			let currencyFloat = config.capital * (betPercent / 100);
			currencyFloatTotal += currencyFloat;
			let currencyCeil = Math.ceil(currencyFloat);
			let currencyCeilTotal = Math.ceil(currencyFloatTotal);

			let percentCeil = currencyCeil / (config.capital / 100);
			percentCeilTotal += percentCeil;

			//let percentCeil = Math.ceil(percentFloat);
			//let percentCeilTotal = Math.ceil(percentFloatTotal);


			let currencyFloatReturnGross = currencyFloat * config.brokerReturn;
			let currencyFloatReturnNet = currencyFloatReturnGross;
			let currencyCeilReturnGross = currencyCeil * config.brokerReturn;
			let currencyCeilReturnNet = currencyCeilReturnGross;
			let percentFloatReturnGross = percentFloat * config.brokerReturn;
			let percentFloatReturnNet = percentFloatReturnGross;
			let percentCeilReturnGross = percentCeil * config.brokerReturn;
			let percentCeilReturnNet = percentCeilReturnGross;
			
			if (betsData[index-1]) {
				// subtract previous total from gross...
				currencyFloatReturnNet = currencyFloatReturnGross - betsData[index-1].currencyFloatTotal;
				currencyCeilReturnNet = currencyCeilReturnGross - betsData[index-1].currencyCeilTotal;
				percentFloatReturnNet = percentFloatReturnGross - betsData[index-1].percentFloatTotal;
				percentCeilReturnNet = percentCeilReturnGross - betsData[index-1].percentCeilTotal;
			}			

			betsData.push({
				currencyFloat: $float(currencyFloat),
				currencyFloatTotal: $float(currencyFloatTotal),
				currencyFloatReturnGross: $float(currencyFloatReturnGross),
				currencyFloatReturnNet: $float(currencyFloatReturnNet),
				currencyCeil: $float(currencyCeil),				
				currencyCeilTotal: $float(currencyCeilTotal),
				currencyCeilReturnGross: $float(currencyCeilReturnGross),
				currencyCeilReturnNet: $float(currencyCeilReturnNet),
				percentFloat: $float(percentFloat),
				percentFloatTotal: $float(percentFloatTotal),
				percentFloatReturnGross: $float(percentFloatReturnGross),
				percentFloatReturnNet: $float(percentFloatReturnNet),
				percentCeil: $float(percentCeil),				
				percentCeilTotal: $float(percentCeilTotal),
				percentCeilReturnGross: $float(percentCeilReturnGross),
				percentCeilReturnNet: $float(percentCeilReturnNet)		
			});
		});

		console.table(betsData);		
		return betsData;
	};

	const $testing = () => {
		return "sultanas";
	};

	return function () {
		
		return {
			getStackedMartingales____: function getStackedMartingales () {
				return new Promise((resolve, reject) => {
					setTimeout(function(){
						let rtn = $testing();
						resolve(rtn);
					}, 5000);
					
				});
			},

			getStackedMartingales: function getStackedMartingales () {

				// ------------------------------------------------------------------
				// we must return a Promise because using setInterval for the loop!
				// ------------------------------------------------------------------
				return new Promise ( (resolve, reject) => {
					
					let singleBet = 1;
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
							console.table(config);							
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
			}
		}
	}
})();