// import {ctrl__settings__basic__toggle} from "./dom.service";
// import {settings__basic__toggle} from "../ctrls/settings__basic__toggle.ctrl";
// import {ctrl__settings__advanced__toggle} from "./dom.service";
// import {settings__advanced__toggle} from "../ctrls/settings__advanced__toggle.ctrl";

import * as dom from "./dom.service";
import * as ctrls from "./ctrls.service";

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
	};
	return function () {		
		return {
			set() {
				$set();
			}
		}
	}
})();
