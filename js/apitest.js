console.log("Script loaded!")

const apiKey = '24c182c1ae2274877815b20c1c384c68'
const imageBaseUrl = 'https://image.tmdb.org/t/p/'
const imageSizeOriginal = 'original/'
const imageSizeW500 = 'w500/'

async function fetchGenres(){
    let url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=' + apiKey + '&language=en-US';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function fetchMoviesFromGenre(genreId){

    let url = 'http://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&language=en-US&with_genres=' + genreId;
    try {
        let res = await fetch(url);
        let data = await res.json();
        return [data.total_pages,url]
    } catch (error) {
        console.log(error);
    }
}

async function fetchRandomMovie(genreId,page){

    let url = 'http://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&language=en-US&page=' + page + '&with_genres=' + genreId;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function setMovieElements(title,year,genre,overview,posterUrl){
    var pNode = document.createElement("p");
    var textNode = document.createTextNode(name);
    pNode.appendChild(textNode);

    let posterImg = document.getElementById('poster-img')
    let movieTitle = document.getElementById('movie-title')
    let movieYear = document.getElementById('movie-year')
    let movieGenre = document.getElementById('movie-genre')
    let movieOverview = document.getElementById('overview')

    posterImg.src = imageBaseUrl + imageSizeW500 + posterUrl

    movieTitle.textContent = title
    movieYear.textContent = year
    movieGenre.textContent = genre
    movieOverview.textContent = overview
}

async function pickMovie(){

    fetchGenres().then(data => {
        let genresArray = data.genres
        randomGenre = genresArray[Math.floor(Math.random() * genresArray.length)]

        fetchMoviesFromGenre(randomGenre.id).then(data => {
            let randomPage = Math.floor(Math.random() * data[0])

            fetchRandomMovie(randomGenre.id, randomPage).then(data => {
                moviesArray = data.results
                randomMovie = moviesArray[Math.floor(Math.random() * moviesArray.length)]
                console.log(randomMovie)

                let movieYear = randomMovie.release_date.split("-")[0]

                let genreNames = ""
                randomMovie.genre_ids.forEach(genreId => {
                    genresArray.forEach(genre => {
                        if (genre.id === genreId){
                            if(genreNames.length === 0){
                                genreNames += genre.name
                            }else{
                                genreNames += " | " + genre.name
                            }
                        }
                    });
                });
                setMovieElements(randomMovie.original_title, movieYear, genreNames,randomMovie.overview,randomMovie.poster_path)
            })
        })
    })
}

async function fetchMovie(movieId) {
    let url = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=24c182c1ae2274877815b20c1c384c68';
    try {
        let res = await fetch(url);
        let movie = await res.json();

        var pNode = document.createElement("p");
        var textNode = document.createTextNode(movie.original_title);
        pNode.appendChild(textNode);

        var imgNode = document.createElement("img");
        imgNode.src = imageBaseUrl + imageSizeW500 + movie.poster_path

        var element = document.getElementById("content");
        element.appendChild(pNode);
        element.appendChild(imgNode);

    } catch (error) {
        console.log(error);
    }
}

async function setGenreFilters(){
    fetchGenres().then(data =>{
        genresListElement = document.getElementById('genre-filters-list')

        data.genres.forEach(genre => {
            genreLi = document.createElement('li')

            genreLabel = document.createElement('label')
            genreLabel.htmlFor = ''
            genreLabel.innerText = genre.name

            genreInput = document.createElement('input')
            genreInput.type = 'checkbox'
            genreInput.name = 'g' + genre.name
            genreInput.id = 'g' + genre.name
            genreInput.checked = true

            genreLi.appendChild(genreInput)
            genreLi.appendChild(genreLabel)

            genresListElement.appendChild(genreLi)
        })
    })
}

setGenreFilters();
pickMovie();
//fetchMovie(76341)