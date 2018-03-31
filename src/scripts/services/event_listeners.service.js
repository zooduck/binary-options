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

export const eventListenersService = (function eventListenersService () {
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
		dom.main__infoBar__win.addEventListener("click", function (e) {
			dataService().set({
				martingaleIterationSlot: 0
			});
		});
		dom.main__infoBar__lose.addEventListener("click", function (e) {
			const data = dataService().get();
			let martingaleIterationSlot = data.martingaleIterationSlot + 1;
			if (martingaleIterationSlot >= data.martingaleBets.length) {
				return console.warn(`data.martingaleBets[${martingaleIterationSlot}] is undefined`);
			}
			dataService().set({
				martingaleIterationSlot: martingaleIterationSlot
			});
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
