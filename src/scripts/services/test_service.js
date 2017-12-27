export const testService = (function () {
	const localMethod = function () {
		return console.log("testService's localMethod called by testService().exposedMethod()");
	};
	return function () {
		return {
			exposedMethod: function exposedMethod () {				
				return localMethod();
			}
		}
	}
})();
