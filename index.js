document.addEventListener('click', (e) => {
	if (!dropdownContainer.contains(e.target)) {
		dropdown.classList.remove('is-active');
	}
});

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
	if (results.firstChild) {
		while (results.firstChild) {
			results.removeChild(results.firstChild);
		}
	}
	dropdown.classList.add('is-active');
	if (typeof movies === 'string') {
		const div = document.createElement('div');
		const msg = movies === 'Incorrect IMDb ID.' ? 'No Results...' : movies;
		div.classList.add('dropdown-item');
		div.innerHTML = `<h1>${msg}</h1>`;
		results.append(div);
		return;
	}
	for (let movie of movies) {
		const div = document.createElement('div');
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		div.classList.add('dropdown-item');
		div.addEventListener('click', () => {
			movieInput1.value = movie.Title;
			dropdown.classList.remove('is-active');
			fetchMovieInfo(movie.imdbID);
		});
		div.innerHTML = `
        <img src="${imgSrc}" />
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
		return e.message;
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
		document.querySelector('.movie-info-container').innerHTML = movieInfoTemplate(movie.data);
	} catch (e) {
		console.log(e.message);
	}
};

const movieInfoTemplate = (movieInfo) => {
	return `
    <article class="media">
    <figure class="media-left">
    <p class="image">
    <img src="${movieInfo.Poster}"/>
    </p>
    </figure>
    <div class="media-content">
    <div class="content">
    <h1>${movieInfo.Title}</h1>
    <h2>${movieInfo.Genre}</h2>
    <p>${movieInfo.Plot}</p>
    </div>
    </div>
    </article>
    <article class="notification is-primary">
    <p class="title">
    ${movieInfo.Awards}
    </p>
    <p class="subtitle>
    award
    </p>
    </article>
    <article class="notification is-primary">
    <p class="title">
    ${movieInfo.BoxOffice}
    </p>
    <p class="subtitle>
    box office
    </p>
    </article>
    <article class="notification is-primary">
    <p class="title">
    ${movieInfo.Metascore}
    </p>
    <p class="subtitle>
    metascore
    </p>
    </article>
    <article class="notification is-primary">
    <p class="title">
    ${movieInfo.imdbRating}
    </p>
    <p class="subtitle>
    imdb rating
    </p>
    </article>
    <article class="notification is-primary">
    <p class="title">
    ${movieInfo.imdbVotes}
    </p>
    <p class="subtitle>
    imdb votes
    </p>
    </article>
    `;
};
