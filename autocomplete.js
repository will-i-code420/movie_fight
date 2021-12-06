const createAutoComplete = ({ rootEl, renderItem, onItemSelect, inputValue, fetchData }) => {
	rootEl.innerHTML = `
    <label><b>Movie Title</b></label>
    <input class="input" >
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
    `;

	const input = rootEl.querySelector('input');
	const dropdown = rootEl.querySelector('.dropdown');
	const results = rootEl.querySelector('.results');

	const onInput = debounceInput(async (e) => {
		const items = await fetchData(e.target.value);
		if (results.firstChild) {
			while (results.firstChild) {
				results.removeChild(results.firstChild);
			}
		}
		dropdown.classList.add('is-active');
		if (typeof items === 'string') {
			const div = document.createElement('div');
			const msg = items === 'Incorrect IMDb ID.' ? 'No Results...' : movies;
			div.classList.add('dropdown-item');
			div.innerHTML = `<h1>${msg}</h1>`;
			results.append(div);
			return;
		}
		for (let item of items) {
			const div = document.createElement('div');

			div.classList.add('dropdown-item');
			div.addEventListener('click', () => {
				input.value = inputValue(item.Title);
				dropdown.classList.remove('is-active');
				onItemSelect(item.imdbID);
			});
			div.innerHTML = renderItem(item);
			results.append(div);
		}
	}, 500);

	input.addEventListener('input', onInput);

	document.addEventListener('click', (e) => {
		if (!rootEl.contains(e.target)) {
			dropdown.classList.remove('is-active');
		}
	});
};
