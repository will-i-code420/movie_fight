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

let leftMovie = false;
let rightMovie = false;
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
				leftMovie = true;
				break;
			case 'right':
				rightMovie = true;
				break;
			default:
				break;
		}
		el.innerHTML = movieInfoTemplate(movie.data);
		if (leftMovie && rightMovie) return compareMovies();
	} catch (e) {
		console.log(e.message);
	}
};

const movieInfoTemplate = (movieInfo) => {
	const boxoffice = parseInt(movieInfo.BoxOffice.replace(/[\$\,]/g, ''));
	const metascore = parseInt(movieInfo.Metascore);
	const imdbRating = parseFloat(movieInfo.imdbRating);
	const imdbVote = parseInt(movieInfo.imdbVotes.replace(/,/g, ''));
	const awards = movieInfo.Awards.match(/(won \d+)|(\d+ wins)|/gim).join(' ').split(' ').reduce((total, val) => {
		const value = parseInt(val);
		if (isNaN(value)) return total;
		return parseInt(total) + parseInt(val);
	}, 0);
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
    <article class="notification is-primary" data-value=${awards}>
    <p class="title">
    ${movieInfo.Awards}
    </p>
    <p class="subtitle">
    Awards
    </p>
    </article>
    <article class="notification is-primary" data-value=${boxoffice}>
    <p class="title">
    ${movieInfo.BoxOffice}
    </p>
    <p class="subtitle">
    Box Office Gross
    </p>
    </article>
    <article class="notification is-primary" data-value=${metascore}>
    <p class="title">
    ${movieInfo.Metascore}
    </p>
    <p class="subtitle">
    Metascore
    </p>
    </article>
    <article class="notification is-primary" data-value=${imdbRating}>
    <p class="title">
    ${movieInfo.imdbRating}
    </p>
    <p class="subtitle">
    IMDB Rating
    </p>
    </article>
    <article class="notification is-primary" data-value=${imdbVote}>
    <p class="title">
    ${movieInfo.imdbVotes}
    </p>
    <p class="subtitle">
    IMDB Votes
    </p>
    </article>
    `;
};

const compareMovies = () => {
	const leftStats = document.querySelectorAll('#left-summary .notification');
	const rightStats = document.querySelectorAll('#right-summary .notification');
	leftStats.forEach((leftStat, i) => {
		const currentRight = rightStats[i];
		const leftStatVal = parseInt(leftStat.dataset.value);
		const rightStatVal = parseInt(currentRight.dataset.value);
		console.log(leftStatVal, rightStatVal);
		if (rightStatVal > leftStatVal) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		} else {
			currentRight.classList.remove('is-primary');
			currentRight.classList.add('is-warning');
		}
	});
};

createAutoComplete({
	...autoCompleteConfig,
	rootEl: document.querySelector('#left-autocomplete'),
	onItemSelect(itemId) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		fetchMovieInfo(itemId, document.querySelector('#left-summary'), 'left');
	}
});
createAutoComplete({
	...autoCompleteConfig,
	rootEl: document.querySelector('#right-autocomplete'),
	onItemSelect(itemId) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		fetchMovieInfo(itemId, document.querySelector('#right-summary'), 'right');
	}
});
