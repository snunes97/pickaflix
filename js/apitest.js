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
    let url = 'http://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&language=en-US&page=' + page + '&include_adult=false&with_genres=' + genreId;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function setMovieElements(title,year,genre,overview,posterUrl,lang,rating,votes){
    var pNode = document.createElement("p");
    var textNode = document.createTextNode(name);
    pNode.appendChild(textNode);

    let posterImg = document.getElementById('poster-img')
    let movieTitle = document.getElementById('movie-title')
    let movieYear = document.getElementById('movie-year')
    let movieGenre = document.getElementById('movie-genre')
    let movieLanguage = document.getElementById('movie-language')
    let movieRating = document.getElementById('movie-rating')
    let movieOverview = document.getElementById('overview')

    posterImg.src = imageBaseUrl + imageSizeW500 + posterUrl

    movieTitle.textContent = title
    movieYear.textContent = year
    movieGenre.textContent = genre
    movieLanguage.textContent = "Language: " + lang.toUpperCase()
    movieRating.textContent = "Avg. Rating: " + rating + " (" + votes + " votes)"
    movieOverview.textContent = overview
}

async function pickMovie(){

    fetchGenres().then(data => {
        let allGenres = data.genres
        let genres = getGenreFilters()

        if(!genres.length > 0){return false}

        let randomGenre = genres[Math.floor(Math.random() * genres.length)]

        fetchMoviesFromGenre(randomGenre).then(data => {
            let randomPage = Math.floor(Math.random() * data[0])
            fetchRandomMovie(randomGenre, randomPage).then(data => {
                let moviesArray = data.results
                let randomMovie = moviesArray[Math.floor(Math.random() * moviesArray.length)]
                console.log(randomMovie)
                let movieYear = randomMovie.release_date.split("-")[0]

                let genreNames = ""
                randomMovie.genre_ids.forEach(genreId => {
                    allGenres.forEach(genre => {
                        if (genre.id === genreId){
                            if(genreNames.length === 0){
                                genreNames += genre.name
                            }else{
                                genreNames += " | " + genre.name
                            }
                        }
                    });
                });
                setMovieElements(randomMovie.title, movieYear, genreNames,randomMovie.overview,randomMovie.poster_path,randomMovie.original_language,randomMovie.vote_average,randomMovie.vote_count)
            })
        })
    })
}

async function setGenreFilters(){
    fetchGenres().then(data =>{
        genresListElement = document.getElementById('genre-filters-list')

        let gId = 1
        data.genres.forEach(genre => {
            genreLi = document.createElement('li')

            genreLabel = document.createElement('label')
            genreLabel.htmlFor = ''
            genreLabel.innerText = genre.name

            genreInput = document.createElement('input')
            genreInput.type = 'checkbox'
            genreInput.name = 'g' + genre.name
            genreInput.id = 'g' + gId
            gId++
            genreInput.value = genre.id
            genreInput.checked = true

            genreLi.appendChild(genreInput)
            genreLi.appendChild(genreLabel)

            genresListElement.appendChild(genreLi)
        })
    })
}

function getGenreFilters(){
    let checkedGenres = []
    let genreCount = document.getElementById("genre-filters-list").childElementCount;

    for (i = 1; i <= genreCount; i++) {
        genre = document.getElementById('g' + i)
        if(genre.checked){
            checkedGenres.push(genre.value)
        }
    }
    return checkedGenres
}

setGenreFilters();
//pickMovie();
//fetchMovie(76341)