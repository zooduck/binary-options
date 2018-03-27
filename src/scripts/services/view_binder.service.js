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
			const templateArray = eval(evalStr);
			
			for (const item of Array.from(templateArray)) {
				const templateEl = dataTemplate.cloneNode(true);
				templateEl.removeAttribute("data-template");
				const boundEls = templateEl.querySelectorAll("[data-template-bind]");
								
				for (const boundEl of boundEls) {
					const evalStr = `item.${boundEl.dataset.templateBind}`;
					const viewVal = eval(evalStr);					
					if (!$setVal(boundEl, viewVal, boundEl.dataset.templateBind)) {
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
