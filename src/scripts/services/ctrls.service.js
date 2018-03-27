import * as dom from "./dom.service";

export const settings__toggle = function settings__toggle () {
	dom.settings.classList.toggle("active");
};
export const settings__basic__toggle = function settings__basic__toggle () {
	dom.settings__basic.classList.toggle("active");
};
export const settings__advanced__toggle = function settings__advanced__toggle () {
	dom.settings__advanced.classList.toggle("active");
};
export const settings__martingalesDetail__toggle = function settings__martingalesDetail__toggle () {
	dom.settings__martingalesDetail.classList.toggle("active");
};
