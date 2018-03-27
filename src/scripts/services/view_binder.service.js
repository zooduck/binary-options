import {zoobinary} from "../global/zoobinary";
export const viewBinderService = (function () {

	const $clearDataTemplates = (dataTemplates) => {
		for (const el of dataTemplates) {
			const children = Array.from(el.parentNode.children);
			for (const child of children) {
				if (!child.hasAttribute("data-template")) {
					el.parentNode.removeChild(child);
				}
			}
		}
	};

	const $setVal = (el, viewVal, dataBind) => {
		if (viewVal) {
			el.innerHTML = viewVal;
			el.value = viewVal;
			return true;
		} else return false;
	};

	const $bind = () => {
		// =========================================================================================
		// UPDATE ALL data-bind type ELEMENTS IN THE DOM (much like $scope.$apply() in AngularJS)
		// =========================================================================================
		let boundEls = document.querySelectorAll("[data-bind]");
		for (const el of boundEls) {
			const evalStr = `zoobinary.${el.dataset.bind}`;
			const viewVal = eval(evalStr);
			if (!$setVal(el, viewVal, el.dataset.bind)) {
				console.error(`[data-bind] value for ${el.dataset.bind} not found`);
			}
		}
		const boundCheckboxEls = document.querySelectorAll("[data-checked]");
		for (const el of boundCheckboxEls) {
			const evalStr = `zoobinary.${el.dataset.checked}`;
			const viewVal = eval(evalStr);
			el.checked = viewVal;
		}
		const dataTemplates = document.querySelectorAll("[data-template]");

		$clearDataTemplates(dataTemplates);

		for (const dataTemplate of dataTemplates) {

			const evalStr = `zoobinary.${dataTemplate.dataset.template}`;
			const itemName = dataTemplate.dataset.templateItem; // This is an optional item reference assigned to the with data-template-item attribute
			const templateArray = eval(evalStr);

			for (const item of Array.from(templateArray)) {
				const templateEl = dataTemplate.cloneNode(true);
				templateEl.removeAttribute("data-template");
				const boundEls = templateEl.querySelectorAll("[data-template-bind]");

				for (const boundEl of boundEls) {
					let boundElVal = boundEl.dataset.templateBind;
					if (itemName) {
						if (!boundEl.dataset.templateBind.match(itemName)) {
							// hard fail
							return console.error(`${itemName} not found in ${boundElVal}. Check that the item reference for data-template-item (in your template) matches the item reference for data-template-bind.`);
						}
						boundElVal = boundEl.dataset.templateBind.replace(itemName, "");
					}
					const evalStr = itemName? `item${boundElVal}` : `item.${boundElVal}`;
					let viewVal = "";
					try {
						viewVal = eval(evalStr);
					} catch (err) {
						// ...
					}
					if (!$setVal(boundEl, viewVal, boundEl.dataset.templateBind)) {
						// soft fail
						console.error(`[data-template-bind] value for ${boundEl.dataset.templateBind} not found`);
					}
				}
				dataTemplate.parentNode.appendChild(templateEl);
			}
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
