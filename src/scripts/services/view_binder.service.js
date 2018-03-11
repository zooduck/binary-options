import {zoobinary} from "../global/zoobinary";
export const viewBinderService = (function () {

	const $bind = () => {
		// ===================================================================================
		// UPDATE ALL data-bind ELEMENTS IN THE DOM (much like $scope.$apply() in AngularJS)
		// ===================================================================================
		let boundEls = document.querySelectorAll("[data-bind]");
		for (const el of boundEls) {			
			const evalStr = `zoobinary.${el.dataset.bind}`;
			const viewVal = eval(evalStr);
			if (viewVal) {
				el.innerHTML = viewVal;
			} else console.error(`[data-bind] value for ${el.dataset.bind} not found`);			
		}
	};

	// const $bind_ERR = (dataObj = {name: null, data: null}) => {
	// 	console.warn("updating the view...");
	// 	// ------------------------------------------------------------------------------------
	// 	// data: an object with keys that reference "zoo-bind" attribute values
	// 	// name: the object name of the attribute value, "someObjectName.someValue"
	// 	// 			  so that we only update values for the specified object (data)
	// 	//            for example, we might have current.balance and open.balance
	// 	//            and we would not want to update both instances of "balance" in the view
	// 	//            when updating "balance" property of the "current" object.
	// 	// -------------------------------------------------------------------------------------


	// 	// TEST TO UPDATE ALL data-bind ELEMENTS IN THE DOM (much like $scope.$apply() in AngularJS)
	// 	let boundEls__ = document.querySelectorAll("[data-bind]");
	// 	console.log("boundEls__", boundEls__);

	// 	let test = flatten(zoobinary);
	// 	console.log("flat test", test);

	// 	//let boundElsCollection = {}
	// 	for (let el of boundEls__) {
	// 		//boundElsCollection[el.dataset.bind] = el;
	// 		//console.log("el.dataset.bind", el.dataset.bind, "test[el.dataset.bind]", test[el.dataset.bind]);
	// 		if (test[el.dataset.bind]) {
	// 			el.innerHTML = test[el.dataset.bind];
	// 		} else console.error(`[data-bind] value for ${el.dataset.bind} not found`);
			
	// 	}

	// 	//console.log("boundElsCollection", boundElsCollection);

	// 	return;




	// 	if (!dataObj.name || !dataObj.data) {
	// 		return;
	// 	}
	// 	let pattern = new RegExp(`${dataObj.name}.`);		
	// 	let boundEls = document.querySelectorAll("[data-bind]");
	// 	let boundElsObj = {};
	// 	for (let boundEl of Array.from(boundEls)) {
	// 		let attrVal = boundEl.attributes["data-bind"].value;
	// 		// console.log("pattern", pattern, "attrVal", attrVal);
	// 		if (attrVal.match(pattern)) {
	// 			boundElsObj[boundEl.attributes["data-bind"].value] = boundEl;
	// 		}			
	// 	}
	// 	// console.log("boundElsObj", boundElsObj);
	// 	for (let zooBindVal in boundElsObj) {
	// 		// --------------------------------------------
	// 		// zooBindVal = betData.capital, for example
	// 		// strip out object prefix...
	// 		// --------------------------------------------
	// 		let attrVal = zooBindVal.replace(pattern, "");
	// 		boundElsObj[zooBindVal].innerHTML = dataObj.data[attrVal];
	// 	}
	// };

	return function () {
		return {
			bind: (dataObj = {name: null, data: null}) => {
				return $bind(dataObj);
			}
		}
	}
})();
