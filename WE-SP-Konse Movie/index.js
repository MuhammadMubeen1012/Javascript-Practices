const autoCompleteConfiguration = {
  renderData: (movie) => {
    const imgSRC = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
            <img src="${imgSRC}" />
            ${movie.Title} (${movie.Year})
        `;
  },
  selectedItem: (movie) => {
    return movie.Title;
  },
  fetchData: async (searchInput) => {
    // axios.get(url,{})
    // second param get params property and put there property in URL.
    // auto forming a URL through axios
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "37005a7f",
        // s is search request
        // s: 'avengers',
        // i is for fetching single movie and its all related data.
        // i: 'tt0848228'
        s: searchInput,
      },
    });

    if (response.data.Error) return [];

    // console.log(response.data)
    return response.data.Search;
  },
};
// getting auto-complete widget
createAutoCompleteWidget({
  ...autoCompleteConfiguration,
  autoCompleteWidget: document.querySelector("#left-autocomplete"),
  onItemSelection: (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector(".left-summary"),'left');
  },
});
createAutoCompleteWidget({
  ...autoCompleteConfiguration,
  autoCompleteWidget: document.querySelector("#right-autocomplete"),
  onItemSelection: (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector(".right-summary"), "right");
  },
});

let leftDataStats;
let rightDataStats;

const onMovieSelect = async (movie, summarySpace, inputStatsSide) => {
  const selectedMovie = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "37005a7f",
      i: movie.imdbID,
    },
  });

  summarySpace.innerHTML = movieDataTemplate(selectedMovie.data);
  console.log('Check point 1')
  if (inputStatsSide === "left") {
    console.log('Check point 2')
    leftDataStats = selectedMovie.data;
  } else {
    console.log('Check point 3')
    rightDataStats = selectedMovie.data;
  }

  if (leftDataStats && rightDataStats) {
    console.log('Before comparison')
    doComparison();
  }
};

const doComparison = () => {
    const leftSideDataValue = document.querySelectorAll('.left-summary .notification')
    const rightSideDataValue = document.querySelectorAll('.right-summary .notification')

    console.log(leftSideDataValue , rightSideDataValue)
    leftSideDataValue.forEach((leftArticles,index) =>{
        const rightArticles = rightSideDataValue[index];

        const leftValue = leftArticles.dataset.value;
        const rightValue = rightArticles.dataset.value;

        console.log(leftValue,rightValue)
        if(rightValue>leftValue){
            leftArticles.classList.remove('is-primary')
            leftArticles.classList.add('is-warning')
        } else {
            rightArticles.classList.remove('is-primary')
            rightArticles.classList.add('is-warning')
        }
    })
};

const movieDataTemplate = (movieDetails) => {
  const dollars = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metaScore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));
  const awards = movieDetails.Awards.split(" ").reduce((prev,element) => {
    const digit = parseInt(element);
    if (isNaN(digit)) {
      return prev;
    } else {
      return prev + digit;
    }
  },0);

//   console.log(awards, dollars, metaScore, imdbRating, imdbVotes);
  return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p> 
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
