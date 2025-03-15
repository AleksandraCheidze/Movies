
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import MovieCard from "./MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  const shouldShowButton = review.content.length > maxLength;

  console.log("Review data:", review);

  return (
    <div className="review-card">
      <div className="review-header">
        <p className="review-author">{review.author}</p>
        {review.author_details && review.author_details.rating !== null && (
          <div className="review-rating">
            <img src="/star.svg" alt="Rating" />
            <span>{review.author_details.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="review-content">
        {isExpanded
          ? review.content
          : shouldShowButton
          ? `${review.content.slice(0, maxLength)}...`
          : review.content}
      </div>
      {shouldShowButton && (
        <button
          className="read-more-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?language=en-US&append_to_response=credits,videos,reviews,recommendations`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movie?.id]);

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <Link to="/" className="logo-link">
            <img
              src="/cassandra-logo.png"
              alt="Cassandra Films"
              className="details-logo"
            />
          </Link>
          <h1 className="text-3xl text-center">More about {movie.title}</h1>
        </header>
        <img
          className="movie-poster"
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-info">
          <p className="movie-overview">{movie.overview}</p>
        </div>
        {/* Movie Release Date and Rating */}
        <div className="movie-info">
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}
          </p>
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="movie-info">
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
          </div>
        )}

        {/* Cast in Card */}
        {movie.credits?.cast?.length > 0 && (
          <div className="movie-info movie-cast-card">
            <h2 className="section-title">Cast</h2>
            <div className="cast-grid">
              {movie.credits.cast
                .filter((person) => person.profile_path)
                .map((person) => (
                  <div key={person.id} className="cast-member">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                      alt={person.name}
                      className="cast-image"
                    />
                    <div className="cast-info">
                      <div className="cast-name">{person.name}</div>
                      <div className="cast-character">{person.character}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Trailer */}
        {movie.videos?.results?.length > 0 && (
          <div className="movie-info movie-trailer-card">
            <h2 className="section-title">Trailer</h2>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
              title="Movie Trailer"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Reviews */}
        {movie.reviews?.results?.length > 0 && (
          <div className="movie-info">
            <h2 className="section-title">Reviews</h2>
            <div className="reviews-container">
              {movie.reviews.results.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Movies as Movie Cards */}
        {movie.recommendations?.results?.length > 0 && (
          <div className="movie-info movie-recommended-card">
            <h2 className="section-title">Recommended Movies</h2>
            <div className="movie-card-container">
              {movie.recommendations.results.slice(0, 8).map((recMovie) => (
                <Link
                  to={`/movie/${recMovie.id}`}
                  key={recMovie.id}
                  className="recommended-movie"
                >
                  <div className="poster-wrapper">
                    <img
                      src={
                        recMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${recMovie.poster_path}`
                          : "/no-movie.png"
                      }
                      alt={recMovie.title}
                    />
                    <div className="rating-overlay">
                      <img src="/star.svg" alt="Star Icon" />
                      <span>{recMovie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3>{recMovie.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MovieDetails;
