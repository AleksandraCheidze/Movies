import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import Spinner from "./Spinner";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/popular?language=en-US&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const data = await response.json();
        setMovies(data.results);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <img
                src="/cassandra-logo.png"
                alt="Cassandra Films"
                className="h-[80px] w-auto"
              />
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-8">
            Popular <span className="text-gradient">Movies</span>
          </h1>
        </header>

        {isLoading ? (
          <Spinner />
        ) : (
          <section className="all-movies">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
};

export default AllMovies;
