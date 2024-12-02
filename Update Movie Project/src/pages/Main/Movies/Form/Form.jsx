import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Form.css';

const Form = () => {
    const [query, setQuery] = useState('');
    const [searchedMovieList, setSearchedMovieList] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(undefined);
    const [, setMovie] = useState(undefined);
    const [notfound, setNotFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    let { movieId } = useParams();

    const handleSearch = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios({
                method: 'get',
                url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9...',
                },
            });

            if (response.data.results.length === 0) {
                setNotFound(true);
                setSearchedMovieList([]);
                setTotalPages(0);
            } else {
                setSearchedMovieList(response.data.results);
                setTotalPages(response.data.total_pages);
                setNotFound(false);
            }
        } catch (err) {
            setError('Error fetching movies. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
    };

    const handleSave = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!selectedMovie) {
            alert('Please search and select a movie.');
            return;
        }

        const data = {
            tmdbId: selectedMovie.id,
            title: selectedMovie.title,
            overview: selectedMovie.overview,
            popularity: selectedMovie.popularity,
            releaseDate: selectedMovie.release_date,
            voteAverage: selectedMovie.vote_average,
            backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
            posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
            isFeatured: 0,
        };

        try {
            if (movieId) {
                await axios({
                    method: 'PATCH',
                    url: `/movies/${movieId}`,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                alert('Update Success');
            } else {
                await axios({
                    method: 'post',
                    url: '/movies',
                    data: data,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                alert('Save Success');
            }
            navigate('/main/movies');
        } catch (err) {
            setError('Error saving movie. Please try again later.');
            console.error(err);
        }
    };

    useEffect(() => {
        if (movieId) {
            const fetchMovie = async () => {
                try {
                    const response = await axios.get(`/movies/${movieId}`);
                    setMovie(response.data);
                    setSelectedMovie({
                        id: response.data.tmdbId,
                        title: response.data.title,
                        overview: response.data.overview,
                        popularity: response.data.popularity,
                        poster_path: response.data.posterPath,
                        release_date: response.data.releaseDate,
                        vote_average: response.data.voteAverage,
                    });
                } catch (err) {
                    setError('Error fetching movie details. Please try again later.');
                    console.error(err);
                }
            };

            fetchMovie();
        }
    }, [movieId]);

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h1 className="text-center">{movieId ? 'Edit Movie' : 'Create Movie'}</h1>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                {!movieId && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="movie-search" className="form-label">
                                Search Movie:
                            </label>
                            <div className="input-group">
                                <input
                                    id="movie-search"
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type a movie title"
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleSearch(1)}
                                    disabled={!query.trim()}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div>
                            {notfound && (
                                <div className="alert alert-warning text-center">
                                    Movie not found.
                                </div>
                            )}
                            {isLoading && <div className="text-center">Loading...</div>}
                            <ul className="list-group mt-3">
                                {searchedMovieList.map((movie) => (
                                    <li
                                        key={movie.id}
                                        className={`list-group-item d-flex justify-content-between align-items-center ${
                                            selectedMovie?.id === movie.id ? 'active' : ''
                                        }`}
                                        onClick={() => handleSelectMovie(movie)}
                                    >
                                        {movie.original_title}
                                        <span className="badge bg-primary rounded-pill">
                                            {movie.vote_average}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                <div className="row mt-4">
                    {selectedMovie && (
                        <div className="col-md-4 text-center">
                            <img
                                src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
                                alt={selectedMovie.title}
                                className="img-thumbnail mb-3"
                                style={{ maxHeight: '300px' }}
                            />
                        </div>
                    )}

                    <div className="col-md-8">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={selectedMovie?.title || ''}
                                    disabled={!movieId}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="overview" className="form-label">
                                    Overview
                                </label>
                                <textarea
                                    id="overview"
                                    className="form-control"
                                    rows="4"
                                    value={selectedMovie?.overview || ''}
                                    disabled={!movieId}
                                ></textarea>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="popularity" className="form-label">
                                        Popularity
                                    </label>
                                    <input
                                        type="number"
                                        id="popularity"
                                        className="form-control"
                                        value={selectedMovie?.popularity || ''}
                                        disabled={!movieId}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="releaseDate" className="form-label">
                                        Release Date
                                    </label>
                                    <input
                                        type="date"
                                        id="releaseDate"
                                        className="form-control"
                                        value={selectedMovie?.release_date || ''}
                                        disabled={!movieId}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="voteAverage" className="form-label">
                                    Vote Average
                                </label>
                                <input
                                    type="number"
                                    id="voteAverage"
                                    className="form-control"
                                    value={selectedMovie?.vote_average || ''}
                                    disabled={!movieId}
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate(-1)} // Navigate back to the previous page
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSave}
                                    disabled={!selectedMovie}
                                >
                                    {movieId ? 'Update Movie' : 'Save Movie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
