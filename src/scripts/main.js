// DOM...
//import {docHtml, docBody, ctrl_setCapital, ctrl_setBrokerReturn, ctrl_setMartingales} from "./services/dom.service";
import * as dom from "./services/dom.service";


// Services...
import {testService} from "./services/test_service";
// import {configService} from "./services/config.service";
import {martingaleService} from "./services/martingale.service";
import {betDataService} from "./services/bet_data.service";
import {viewBinderService} from "./services/view_binder.service";
import {viewDataService} from "./services/view_data.service";
import {settingsService} from "./services/settings.service";
import {dataService} from "./services/data.service";

// Event Listeners (FOR TESTING ONLY)...

const ctrls = [
	dom.ctrl_setCapital,
	dom.ctrl_setBrokerReturn,
	dom.ctrl_setMartingales
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



// Event Listeners...
import {eventListenersService} from "./services/event_listeners.service";



// Init...


eventListenersService().set();

martingaleService().getStackedMartingales().then( (martingaleData) => {
	betDataService().set(martingaleData);
});




// Test...
console.log("dom.docHtml:", dom.docHtml, "dom.docBody:", dom.docBody);
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
