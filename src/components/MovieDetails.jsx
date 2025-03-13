import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/movie/${id}?language=en-US&append_to_response=credits,videos,reviews,recommendations`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${API_KEY}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch movie details');
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="movie-details">
            {/* Movie Title in Centered Card */}
            <h1 className="movie-title">{movie.title}</h1>

            {/* Centering the poster */}
            <img className="movie-poster" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />

            {/* Movie Overview in a Card */}
            <div className="movie-info">
                <p className="movie-overview">{movie.overview}</p>
            </div>

            {/* Movie Release Date and Rating */}
            <div className="movie-info">
                <p><strong>Release Date:</strong> {movie.release_date}</p>
                <p><strong>Rating:</strong> {movie.vote_average}</p>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
                <div className="movie-info">
                    <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
                </div>
            )}

            {/* Cast in Card */}
            <div className="movie-cast-card">
                <h2 className="section-title">Cast</h2>
                <ul>
                    {movie.credits?.cast?.slice(0, 5).map(actor => (
                        <li key={actor.id}>
                            {actor.name} as <strong>{actor.character}</strong>
                        </li>
                    ))}
                </ul>
            </div>

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
                    <ul>
                        {movie.reviews.results.slice(0, 5).map(review => (
                            <li key={review.id} className="review-card">
                                <p className="review-author">{review.author}</p>
                                <p className="review-content">{review.content.substring(0, 150)}...</p>
                                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommended Movies */}
            {movie.recommendations?.results?.length > 0 && (
                <div className="movie-info movie-recommended-card">
                    <h2 className="section-title">Recommended Movies</h2>
                    <ul>
                        {movie.recommendations.results.slice(0, 5).map(rec => (
                            <li key={rec.id}>{rec.title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
