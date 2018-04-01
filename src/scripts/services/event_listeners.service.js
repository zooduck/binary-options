// import {ctrl__settings__basic__toggle} from "./dom.service";
// import {settings__basic__toggle} from "../ctrls/settings__basic__toggle.ctrl";
// import {ctrl__settings__advanced__toggle} from "./dom.service";
// import {settings__advanced__toggle} from "../ctrls/settings__advanced__toggle.ctrl";

import * as dom from "./dom.service";
import * as ctrls from "./ctrls.service";
import {settingsService} from "./settings.service";
import {martingaleService} from "./martingale.service";
import {betDataService} from "./bet_data.service";
import {dataService} from "./data.service";
// import {viewDataService} from "./view_data.service";
// import {viewBinderService} from "./view_binder.service";

export const eventListenersService = (function eventListenersService () {
	const $float = (int) => {
		return new Number(int).toFixed(2);
	};
	const $set = () => {
		// =================================================================
		// TODO - REPLACE THIS WITH ARROW CONTROLS AND / OR SWIPE CONTROL
		// =================================================================
		// dom.main__martingaleCounters.addEventListener("click", function (e) {
		// 	const clientX = e.clientX - this.offsetLeft;
		// 	const counterType = clientX >= (this.offsetWidth / 2)? "add" : "subtract";
		// 	const data = dataService().get();
		// 	let martingaleIterationSlot = counterType == "add"? data.martingaleIterationSlot + 1 : data.martingaleIterationSlot - 1;
		// 	if (martingaleIterationSlot >= data.martingaleBets.length || martingaleIterationSlot < 0) {
		// 		return console.warn(`data.martingaleBets[${martingaleIterationSlot}] is undefined`);
		// 	}
		// 	dataService().set({
		// 		martingaleIterationSlot: martingaleIterationSlot
		// 	});
		// 	// betDataService().set();
		// });
		dom.main__infoBar__win.addEventListener("click", function () {
			const data = dataService().get();
			const settings = settingsService().get();
			const martingaleIterationSlot = data.martingaleIterationSlot;
			const currentBalance = parseFloat(settings.capital) + parseFloat(data.martingaleBets[martingaleIterationSlot].currencyFloatReturnNet);
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
			const currentBalance = parseFloat(settings.capital) - parseFloat(data.martingaleBets[martingaleIterationSlot].currencyFloatTotal);
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
			const currentBalance = parseFloat(settings.capital) - parseFloat(data.martingaleBets[martingaleIterationSlot].currencyFloatTotal);
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
		const settingsBasicCtrls = [
			dom.ctrl__settings__basic__capital,
			dom.ctrl__settings__basic__brokerReturn,
			dom.ctrl__settings__basic__martingales
		];
		for (const ctrl of settingsBasicCtrls) {
			ctrl.addEventListener("blur", function() {
				const form = this.parentNode;
				const formData = new FormData(form);
				// update settings...
				settingsService().set(formData);
				// update martingale data...
				martingaleService().update();
				// martingaleService().getStackedMartingales().then( (martingaleData) => {
				// 	// betDataService().set(martingaleData);
				// 	betDataService().set();
				// });
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
