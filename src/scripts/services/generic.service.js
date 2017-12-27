export const genericService = (function () {
	return function () {
		return {
			arraySum: (total, currentVal) => {
				return total + currentVal;
			}
		}
	}
})();
