const dropdownContainer = document.querySelector('.dropdown-container');
dropdownContainer.innerHTML = `
<label for="movieInput1"><b>Movie Title</b></label>
<input id="movieInput1" class="input" >
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
    </div>
</div>
`;
const movieInput1 = document.querySelector('#movieInput1');
const dropdown = document.querySelector('.dropdown');
const results = document.querySelector('.results');

const onInput = debounceInput(async (e) => {
	const movies = await fetchMovies(e.target.value);
	console.log(movies);
	dropdown.classList.add('is-active');
	for (let movie of movies) {
		const div = document.createElement('div');
		div.id = movie.imdbID;
		div.classList.add('dropdown-item');
		div.addEventListener('click', (e) => {
			if (!e.target.id) return fetchMovieInfo(e.target.parentElement.id);
			fetchMovieInfo(e.target.id);
		});
		div.innerHTML = `
        <img src="${movie.Poster}" />
        <h1>${movie.Title}</h1>
        <p class="movie-year">${movie.Year}</p>
        `;
		results.append(div);
	}
}, 500);

movieInput1.addEventListener('input', onInput);

const fetchMovies = async (movie) => {
	try {
		const res = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: '40c22a0b',
				type: 'movie',
				s: movie,
				r: 'json'
			}
		});
		if (res.data.Error) throw new Error(res.data.Error);
		return res.data.Search;
	} catch (e) {
		console.log(e.message);
	}
};

const fetchMovieInfo = async (id) => {
	try {
		const movie = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: '40c22a0b',
				i: id
			}
		});
		console.log(movie.data);
		if (movie.data.Error) throw new Error(movie.data.Error);
	} catch (e) {
		console.log(e.message);
	}
};
