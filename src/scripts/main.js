// DOM...
import {docHtml, docBody} from "./services/dom_service";

// Services...
import {testService} from "./services/test_service";
import {martingaleService} from "./services/martingale.service";

// Event Listeners...

// Init...

// Test...
console.log("docHtml:", docHtml, "docBody:", docBody);
testService().exposedMethod();
martingaleService().getStackedMartingales();





