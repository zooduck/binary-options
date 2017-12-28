export const viewBinderService = (function () {

	const $bind = (dataObj = {name: null, data: null}) => {
		console.warn("updating the view...");
		// ------------------------------------------------------------------------------------
		// data: an object with keys that reference "zoo-bind" attribute values
		// name: the object name of the attribute value, "someObjectName.someValue"
		// 			  so that we only update values for the specified object (data)
		//            for example, we might have current.balance and open.balance
		//            and we would not want to update both instances of "balance" in the view
		//            when updating "balance" property of the "current" object.
		// -------------------------------------------------------------------------------------

		if (!dataObj.name || !dataObj.data) {
			return;
		}
		let pattern = new RegExp(`${dataObj.name}.`);		
		let boundEls = document.querySelectorAll("[data-bind]");
		let boundElsObj = {};
		for (let boundEl of Array.from(boundEls)) {
			let attrVal = boundEl.attributes["data-bind"].value;
			// console.log("pattern", pattern, "attrVal", attrVal);
			if (attrVal.match(pattern)) {
				boundElsObj[boundEl.attributes["data-bind"].value] = boundEl;
			}			
		}
		// console.log("boundElsObj", boundElsObj);
		for (let zooBindVal in boundElsObj) {
			// --------------------------------------------
			// zooBindVal = betData.capital, for example
			// strip out object prefix...
			// --------------------------------------------
			let attrVal = zooBindVal.replace(pattern, "");
			boundElsObj[zooBindVal].innerHTML = dataObj.data[attrVal];
		}
	};

	return function () {
		return {
			bind: (dataObj = {name: null, data: null}) => {
				return $bind(dataObj);
			}
		}
	}
})();
