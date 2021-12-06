const autoCompleteConfig = {
	renderItem(item) {
		const imgSrc = item.Poster === 'N/A' ? '' : item.Poster;
		return `
        <img src="${imgSrc}" />
        <h1>${item.Title} (${item.Year})</h1>
        `;
	},
	inputValue(itemValue) {
		return itemValue;
	},
	async fetchData(searchInfo) {
		try {
			const res = await axios.get('http://www.omdbapi.com/', {
				params: {
					apikey: '40c22a0b',
					type: 'movie',
					s: searchInfo,
					r: 'json'
				}
			});
			if (res.data.Error) throw new Error(res.data.Error);
			return res.data.Search;
		} catch (e) {
			console.log(e.message);
			return e.message;
		}
	}
};

let leftMovie;
let rightMovie;
const fetchMovieInfo = async (id, el, side) => {
	try {
		const movie = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: '40c22a0b',
				i: id
			}
		});
		if (movie.data.Error) throw new Error(movie.data.Error);
		switch (side) {
			case 'left':
				leftMovie = movie.data;
				break;
			case 'right':
				rightMovie = movie.data;
				break;
			default:
				break;
		}
		el.innerHTML = movieInfoTemplate(movie.data);
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

createAutoComplete({
	...autoCompleteConfig,
	rootEl: document.querySelector('#left-autocomplete'),
	onItemSelect(itemId) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		fetchMovieInfo(itemId, document.querySelector('#left-summary', 'left'));
	}
});
createAutoComplete({
	...autoCompleteConfig,
	rootEl: document.querySelector('#right-autocomplete'),
	onItemSelect(itemId) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		fetchMovieInfo(itemId, document.querySelector('#right-summary', 'right'));
	}
});
