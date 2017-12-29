// DOM...
import {docHtml, docBody, ctrl_setCapital, ctrl_setBrokerReturn, ctrl_setMartingales} from "./services/dom_service";

// Services...
import {testService} from "./services/test_service";
// import {configService} from "./services/config.service";

import {martingaleService} from "./services/martingale.service";
import {betDataService} from "./services/bet_data.service";

// ============================================================================
// TODO: SEEMS WRONG THAT WE NEED TO INIT THESE HERE, THINK OF A BETTER WAY!
// ============================================================================
import {viewDataService} from "./services/view_data.service";
viewDataService();
import {settingsService} from "./services/settings.service";
settingsService();
import {dataService} from "./services/data.service";
dataService();

// Event Listeners...

const ctrls = [
	ctrl_setCapital,
	ctrl_setBrokerReturn,
	ctrl_setMartingales
];

for (let ctrl of Array.from(ctrls)) {
	ctrl.addEventListener("click", function (e) {
		let form = this.parentNode.querySelector("form");
		let formData = new FormData(form);
		// update settings...
		////////configService().set(formData);
		settingsService().set(formData);
		// update martingale data...
		martingaleService().getStackedMartingales().then( (martingaleData) => {
			betDataService().set(martingaleData);
		});
	});
}

// Init...


// Test...
console.log("docHtml:", docHtml, "docBody:", docBody);
testService().exposedMethod();
//import {_Zoobinary} from "./super/Zoobinary.super";





//configService().init();

// martingaleService().getStackedMartingales().then( (martingaleData) => {
// 	console.log("martingaleData", martingaleData);
// 	betDataService().set(martingaleData);

// });



// setTimeout(function(){
// 	configService().set({brokerReturn: 0.76});
// }, 2000);
// setTimeout(function(){
// 	martingaleService().getStackedMartingales();
// 	console.log("config.capital", configService().get("capital"));
// }, 4000);













// ctrl_setCapital.addEventListener("click", function (e) {
// 	let form = this.parentNode.querySelector("form");
// 	// update config...
// 	setConfigFromForm(form);
// 	// update martingale data...
// 	martingaleService().getStackedMartingales();
// });
// ctrl_setCapital.addEventListener("click", function (e) {
// 	let form = this.parentNode.querySelector("form");
// 	// update config...
// 	setConfigFromForm(form);
// 	// update martingale data...
// 	martingaleService().getStackedMartingales();
// });

// ctrl_setCapital.addEventListener("click", function (e) {
// 	let form = this.parentNode.querySelector("form");
// 	// update config...
// 	setConfigFromForm(form);
// 	// update martingale data...
// 	martingaleService().getStackedMartingales();
// });











