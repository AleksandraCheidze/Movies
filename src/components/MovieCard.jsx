import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <div className="relative bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : "/no-movie.png"
          }
          alt={movie.title}
          className="w-full h-auto rounded-lg"
        />
      </Link>

      <div className="mt-4">
        <h3 className="text-white font-bold text-base truncate">
          {movie.title}
        </h3>

        <div className="mt-2 flex flex-row items-center flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <img src="star.svg" alt="Star Icon" className="w-4 h-4" />
            <p className="font-bold text-base text-white">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </p>
          </div>

          <span className="text-gray-100">•</span>
          <p className="capitalize text-gray-100 font-medium text-base">
            {movie.original_language}
          </p>

          <span className="text-gray-100">•</span>
          <p className="text-gray-100 font-medium text-base">
            {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
