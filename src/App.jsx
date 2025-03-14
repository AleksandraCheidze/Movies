import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";
import AllMovies from "./components/AllMovies.jsx";
import Filters from "./components/Filters.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    rating: "",
    year: "",
  });

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "", page = 1, isLoadMore = false) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&language=en-US&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&language=en-US&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`Failed to fetch movies. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results) {
        setErrorMessage("No movies found.");
        setMovieList([]);
        return;
      }

      let filteredResults = data.results;

      if (filters.rating) {
        const [min, max] = filters.rating.split("-").map(Number);
        filteredResults = filteredResults.filter(
          (movie) => movie.vote_average >= min && movie.vote_average <= max
        );
      }

      if (filters.year) {
        filteredResults = filteredResults.filter(
          (movie) => movie.release_date?.split("-")[0] === filters.year
        );
      }

      setMovieList((prevMovies) =>
        isLoadMore ? [...prevMovies, ...filteredResults] : filteredResults
      );

      if (filteredResults.length === 0 && !isLoadMore) {
        setErrorMessage("No movies found with selected filters.");
      }

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  const loadMoreMovies = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMovies(debouncedSearchTerm, nextPage, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(debouncedSearchTerm, 1, false);
  }, [debouncedSearchTerm, filters]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <div className="pattern" />
              <div className="wrapper">
                <header>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "40px",
                      marginTop: "-60px",
                      marginBottom: "20px",
                    }}
                  >
                    <Link
                      to="/"
                      onClick={() => window.location.reload()}
                      style={{ marginLeft: "200px" }}
                    >
                      <img
                        src="/cassandra-logo.png"
                        alt="Cassandra Films"
                        style={{ height: "170px", width: "auto" }}
                      />
                    </Link>
                    <img
                      src="./hero.png"
                      alt="Hero Banner"
                      style={{ width: "300px", height: "auto" }}
                    />
                  </div>
                  <h1 style={{ marginTop: "-20px" }}>
                    Find <span className="text-gradient">Movies</span>
                    <br />
                    You'll Enjoy Without the Hassle
                  </h1>
                </header>

                {trendingMovies.length > 0 && (
                  <section className="trending" style={{ marginTop: "-40px" }}>
                    <h2>
                      Trending <span className="text-gradient">Movies</span>
                    </h2>
                    <ul>
                      {trendingMovies.map((movie, index) => {
                        console.log("Trending movie data:", movie);
                        return (
                          <li key={movie.$id}>
                            <p>{index + 1}</p>
                            <Link to={`/movie/${movie.movie_id}`}>
                              <img src={movie.poster_url} alt={movie.title} />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                <div className="mt-16">
                  <h2 className="mb-6">
                    All <span className="text-gradient">Movies</span>
                  </h2>

                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Search
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                        />
                      </div>
                      <Filters filters={filters} setFilters={setFilters} />
                    </div>
                  </div>

                  <section className="all-movies mt-8">
                    {isLoading && currentPage === 1 ? (
                      <Spinner />
                    ) : errorMessage ? (
                      <p className="text-red-500">{errorMessage}</p>
                    ) : (
                      <>
                        <ul>
                          {movieList.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                          ))}
                        </ul>
                        {movieList.length > 0 && (
                          <div className="text-center mt-8 mb-8">
                            <button
                              onClick={loadMoreMovies}
                              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                            >
                              {isLoading ? "Loading..." : "View More Movies"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </section>
                </div>
              </div>
            </main>
          }
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/all-movies" element={<AllMovies />} />
      </Routes>
    </Router>
  );
};

export default App;

