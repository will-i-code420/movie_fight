const debounceInput = (cb, delay) => {
	let timeoutId;
	return (...args) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			cb.apply(null, args);
		}, delay);
	};
};
