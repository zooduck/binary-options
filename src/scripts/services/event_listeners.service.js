import * as dom from "./dom.service";
import * as ctrls from "./ctrls.service";
import {settingsService} from "./settings.service";
import {martingaleService} from "./martingale.service";
import {betDataService} from "./bet_data.service";
import {dataService} from "./data.service";

export const eventListenersService = (function eventListenersService () {
	const $float = (int) => {
		return new Number(int).toFixed(2);
	};
	const $set = () => {
		dom.main__infoBar__win.addEventListener("click", function () {
			const data = dataService().get();
			const settings = settingsService().get();
			const martingaleIterationSlot = data.martingaleIterationSlot;
			const numberType = settings.roundUpBets? "ceil" : "float";
			const currentBalance = parseFloat(settings.capital) + parseFloat(data.martingaleBets[martingaleIterationSlot][numberType].currencyReturnNet);
			settingsService().set({
				capital: $float(currentBalance)
			});
			dataService().set({
				currentBalance: $float(currentBalance),
				martingaleIterationSlot: 0
			});
			martingaleService().update();
		});
		dom.main__infoBar__lose.addEventListener("click", function () {
			const data = dataService().get();
			const settings = settingsService().get();
			let martingaleIterationSlot = data.martingaleIterationSlot;
			// if (martingaleIterationSlot > data.martingaleBets.length) { // THIS SHOULD NO LONGER BE POSSIBLE
			// 	return console.warn(`data.martingaleBets[${martingaleIterationSlot}] is undefined`);
			// }
			const numberType = settings.roundUpBets? "ceil" : "float";
			const currentBalance = parseFloat(settings.capital) - parseFloat(data.martingaleBets[martingaleIterationSlot][numberType].currencyTotal);
			if (martingaleIterationSlot == (data.martingaleBets.length - 1)) {
				// ==========================================================
				// process final loss and reset martingaleIterationSlot...
				// ==========================================================
				settingsService().set({
					capital: $float(currentBalance)
				});
				dataService().set({
					currentBalance: $float(currentBalance),
					martingaleIterationSlot: 0
				});
				martingaleService().update();
			} else {
				dataService().set({
					currentBalance: $float(currentBalance),
					martingaleIterationSlot: martingaleIterationSlot + 1
				});
			}
		});
		dom.main__infoBar__exit.addEventListener("click", function () {
			const data = dataService().get();
			const settings = settingsService().get();
			if (data.martingaleIterationSlot == 0) return;
			let martingaleIterationSlot = data.martingaleIterationSlot - 1;
			const numberType = settings.roundUpBets? "ceil" : "float";
			const currentBalance = parseFloat(settings.capital) - parseFloat(data.martingaleBets[martingaleIterationSlot][numberType].currencyTotal);
			settingsService().set({
				capital: $float(currentBalance)
			});
			dataService().set({
				currentBalance: $float(currentBalance),
				martingaleIterationSlot: 0
			});
			martingaleService().update();
		});
		dom.ctrl__menu__toggle.addEventListener("click", function () {
			ctrls.settings__toggle();
		});
		dom.ctrl__settings__toggle.addEventListener("click", function () {
			ctrls.settings__toggle();
		});
		dom.ctrl__settings__basic__toggle.addEventListener("click", function () {
			ctrls.settings__basic__toggle();
		});
		dom.ctrl__settings__advanced__toggle.addEventListener("click", function () {
			ctrls.settings__advanced__toggle();
		});
		dom.ctrl__settings__martingalesDetail__toggle.addEventListener("click", function () {
			ctrls.settings__martingalesDetail__toggle();
		});
		const settingsInputCtrls = [
			dom.ctrl__settings__basic__capital,
			dom.ctrl__settings__basic__brokerReturn,
			dom.ctrl__settings__basic__martingales,
			dom.ctrl__settings__advanced__open,
			dom.ctrl__settings__advanced__targetPercent
		];
		for (const ctrl of settingsInputCtrls) {
			ctrl.addEventListener("change", function() {
				const form = this.parentNode;
				const formData = new FormData(form);
				// update settings...
				settingsService().set(formData);
				// update martingale data...
				martingaleService().update();
			});
		}
		const settingsCheckboxCtrls = [
			dom.ctrl__settings__advanced__roundUpBets
		];
		for (const ctrl of settingsCheckboxCtrls) {
			ctrl.addEventListener("change", function () {
				const data = {
					roundUpBets: this.checked
				};
				// update settings...
				settingsService().set(data)
				// update martingale data...
				martingaleService().update();
			});
		}
	};
	return function () {
		return {
			set() {
				$set();
			}
		}
	}
})();
