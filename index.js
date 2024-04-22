const search = document.getElementById('search');
const searchButton = document.getElementById('search-btn');
const watchlistMovies = document.getElementById('watchlist-movie')
const watchlistItems = document.getElementById('items')

if(searchButton) {
    
    searchButton.addEventListener('click', () => {
        const searchTerm = encodeSearch(search.value); // Encode the search term
        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=cf1f401d`)
            .then(res => res.json())
            .then(data => render(data.Search))
            .catch(error => console.error('Error1:', error));
    });
}

function encodeSearch(searchTerm) {
    return encodeURIComponent(searchTerm); // Properly encode the search term
}

async function render(movies) {
    //console.log(movies);
    if (!movies) return "Sorry, no movies found.";
    let html = '';

    for (const movie of movies) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=cf1f401d`);
            if (!response.ok) {
                console.log("error")
            }
            const data = await response.json();
            //console.log(data)
            html += `
                <div class="movie-info">
                    <div class="poster">
                        <img id="poster" src="${data.Poster} alt="Movie image cannot be displayed at the moment"" />
                    </div>
                    <div class="second-container">
                        <div class="movie-heading">
                            <h3>${data.Title}</h3>
                            <p id="rating">${data.imdbRating}</p>
                        </div>
                        <div class="movie-runtime">
                            <p>${data.Runtime}</p>
                            <p>${data.Genre}</p>
                            <button class="add-to-watchlist" data-imdbid="${data.imdbID}"> <i class="fas fa-plus-circle"></i>Watchlist</button>
                        </div>
                        <p id="plot-details">${data.Plot}</p>
                    </div>
                </div><hr>`
            ;
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }
    document.getElementById('movie-list').innerHTML = html
}




// Event delegation for dynamically added buttons


    document.addEventListener('click', function(event) {
        if (event.target.matches('.add-to-watchlist')) {
            const imdbID = event.target.getAttribute('data-imdbid');
            console.log(imdbID)
            addToWatchlist(imdbID);
        }
    });


// Add movie to watchlist function
function addToWatchlist(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=cf1f401d`)
        .then(res => res.json())
        .then(movieDetails => {
            const movie = {
                imdbID: imdbID,
                poster: movieDetails.Poster,
                title : movieDetails.Title,
                ratings: movieDetails.imdbRating,
                duration: movieDetails.Runtime,
                genre: movieDetails.Genre
            }

            // Retrieve current watchlist from local storage
            let watchlist = JSON.parse(localStorage.getItem("watchList")) || [];
            
            // Check if the movie already exists in the watchlist
            const existingMovieIndex = watchlist.findIndex(item => item.imdbID === imdbID);
            
            if (existingMovieIndex === -1) {
                // Movie doesn't exist, add it to the watchlist
                watchlist.push(movie);
                
                // Update local storage with the updated watchlist
                localStorage.setItem("watchList", JSON.stringify(watchlist));
                
                console.log(`Adding movie with IMDB ID ${imdbID} to watchlist.`);
            } else {
                console.log(`Movie with IMDB ID ${imdbID} already exists in the watchlist.`);
            }
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
}




//extracting data from local storage and rendering it to watchlist.html
const watchlist = JSON.parse(localStorage.getItem("watchList")) || {};
console.log(watchlist)
const watchlistContainer = document.getElementById('items');
// console.log("watchList at bottom: ", watchlist)
if(watchlistContainer) {
    // console.log("running")
    if (watchlist.length) {
        // console.log(watchlist)
        let htmlToRender =""
        for(let movie of watchlist)
        {
            
            htmlToRender += `
                <div class="watchlist-movies">
                    <div class="watchlist-poster">
                        <img id="watchlist-poster" src="${movie.poster}" />
                    </div>
                    <div class="watchlist-second-container">
                        <div class="watchlist-movie-heading">
                            <h3>${movie.title}</h3>
                            <p id="watchlist-rating">Duration: ${movie.duration}</p>
                        </div>
                        <div class="watchlist-movie-runtime">
                            <p>Ratings: ⭐${movie.ratings}</p>
                            <p>Genre: ${movie.genre}</p>
                            <button class="remove-watchlist" data-imdbid="${movie.imdbID}"><i class="fa-solid fa-minus"></i>remove</button>
                        </div>
                    </div>
                </div> <hr>`
        
        }
        watchlistContainer.innerHTML = htmlToRender
    }
}

document.addEventListener('click', function(event) {
    if (event.target.matches('.remove-watchlist')) {
        // Retrieve the imdbID from the clicked button
        const imdbID = event.target.getAttribute('data-imdbid');

        // Remove the movie from the watchlist in local storage
        removeFromWatchlist(imdbID);

        // Remove the movie's HTML element from the DOM
        event.target.closest('.watchlist-movies').remove();
    }
});

function removeFromWatchlist(imdbID) {
    // Retrieve the watchlist from local storage
    let watchlist = JSON.parse(localStorage.getItem("watchList")) || [];

    // Filter out the movie with the provided IMDB ID
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);

    // Update local storage with the updated watchlist
    localStorage.setItem("watchList", JSON.stringify(watchlist));

    console.log(`Removed movie with IMDB ID ${imdbID} from watchlist.`);
}



