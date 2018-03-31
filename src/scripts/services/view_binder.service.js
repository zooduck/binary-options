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

	const $evalDataPseudoEl = (el, pseudoType) => {
		const bindType = `pseudo${pseudoType}`;
		const evalStr = `zoobinary.${el.dataset[bindType]}`;
		let viewVal = el.dataset[bindType];
		try {
			// try to evaluate the attribute value as a simple expression
			viewVal = eval(viewVal);
		} catch (err) {
			// console.error(err);
		}
		try {
			// try to evaluate the attribute value against zoobinary data
			viewVal = eval(evalStr)? eval(evalStr) : viewVal;
		} catch (err) {
			// console.error(err);
		}
		return viewVal;
	};

	const $setVal = (el, viewVal, bindType, pseudoBefore, pseudoAfter) => {
		if (viewVal || viewVal === false || viewVal == 0) {
			switch (bindType) {
				case "value": el.value = viewVal; break;
				case "checked": el.checked = viewVal; break;
				default: el.innerHTML = viewVal; // "bind"
			}
			if (pseudoBefore) {
				el.setAttribute("pseudo-before", pseudoBefore);
			}
			if (pseudoAfter) {
				el.setAttribute("pseudo-after", pseudoAfter);
			}
			// el.innerHTML = viewVal;
			// el.value = viewVal;
			// el.checked = viewVal;
			return true;
		} else return false;
	};

	const $bind = () => {
		// =========================================================================================
		// UPDATE ALL data-bind type ELEMENTS IN THE DOM (much like $scope.$apply() in AngularJS)
		// =========================================================================================
		const boundEls = document.querySelectorAll("[data-bind]");

		const dataBindEls = Array.from(document.querySelectorAll("[data-bind]"));
		const dataValEls = Array.from(document.querySelectorAll("[data-value]"));
		const dataCheckedEls = Array.from(document.querySelectorAll("[data-checked]"));
		const dataBoundEls = dataBindEls.concat(dataValEls, dataCheckedEls);

		console.log(dataBoundEls);
		// return;
		for (const el of dataBoundEls) {
			// ===========================================
			// check for bind type (bind, value, checked)
			// ===========================================
			const bindType = "bind";
		  if (el.hasAttribute("data-value")) {
				bindType = "value";
			} else if (el.hasAttribute("data-checked")) {
				bindType = "checked";
			}

			const evalStr = `zoobinary.${el.dataset[bindType]}`;
			let viewVal = el.dataset[bindType];
			try {
				// try to evaluate the attribute value as a simple expression
				viewVal = eval(viewVal);
			} catch (err) {
				// console.error(err);
			}
			try {
				// try to evaluate the attribute value against zoobinary data
				viewVal = eval(evalStr);
			} catch (err) {
				// console.error(err);
			}

			// =====================================================================
			// check for additional binds (data-psuedo-before, data-pseudo-after)
			// NOTE: these can be used in stylesheets for psuedo elements like:
			// div::before { content: attr(pseudo-before); }
			// =====================================================================
			let pseudoBefore = "";
			let pseudoAfter = "";
			if (el.hasAttribute("data-pseudo-before")) {
				pseudoBefore = $evalDataPseudoEl(el, "Before");
			}
			if (el.hasAttribute("data-pseudo-after")) {
				pseudoAfter = $evalDataPseudoEl(el, "After");
			}

			if (!$setVal(el, viewVal, bindType, pseudoBefore, pseudoAfter)) {
				console.error(`[data-${bindType}] value for ${el.dataset[bindType]} not found`);
			}
		}
		// const boundCheckboxEls = document.querySelectorAll("[data-checked]");
		// for (const el of boundCheckboxEls) {
		// 	const evalStr = `zoobinary.${el.dataset.checked}`;
		// 	const viewVal = eval(evalStr);
		// 	el.checked = viewVal;
		// }
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
			// bind: (dataObj = {name: null, data: null}) => {
			// 	return $bind(dataObj);
			// }
			bind() {
				return $bind();
			}
		}
	}
})();
