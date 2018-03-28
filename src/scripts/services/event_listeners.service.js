// import {ctrl__settings__basic__toggle} from "./dom.service";
// import {settings__basic__toggle} from "../ctrls/settings__basic__toggle.ctrl";
// import {ctrl__settings__advanced__toggle} from "./dom.service";
// import {settings__advanced__toggle} from "../ctrls/settings__advanced__toggle.ctrl";

import * as dom from "./dom.service";
import * as ctrls from "./ctrls.service";
import {settingsService} from "./settings.service";
import {martingaleService} from "./martingale.service";
import {betDataService} from "./bet_data.service";

export const eventListenersService = (function eventListenersService () {
	const $set = () => {
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
				martingaleService().getStackedMartingales().then( (martingaleData) => {
					betDataService().set(martingaleData);
				});
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
