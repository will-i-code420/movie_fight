const movieInput1 = document.querySelector('#movieInput1');

const onInput = debounceInput((e) => {
	fetchMovies(e.target.value);
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
		return res.data;
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
		return movie.data;
	} catch (e) {
		console.log(e.message);
	}
};
