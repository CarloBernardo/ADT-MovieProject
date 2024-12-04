import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const navigate = useNavigate();
  let { movieId } = useParams();

  const handleSearch = useCallback(() => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI', // Replace with your actual API key
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
    });
  }, [query]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleSave = () => {
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

    axios({
      method: 'post',
      url: '/movies',
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => alert('Movie saved successfully!'))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
      });
    }
  }, [movieId]);

  return (
    <div className="form-container">
      <h1>{movieId ? 'Edit Movie' : 'Create Movie'}</h1>

      {/* Search Section */}
      {!movieId && (
        <div className="search-section">
          <label>Search for a Movie:</label>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Type a movie name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {searchedMovieList.length > 0 && (
            <div className="search-results">
              {searchedMovieList.map((movie) => (
                <div
                  key={movie.id}
                  className={`search-item ${
                    selectedMovie && selectedMovie.id === movie.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleSelectMovie(movie)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                    alt={movie.original_title}
                  />
                  <span>{movie.original_title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Section */}
      <form className="movie-form">
        {selectedMovie && (
          <div className="poster-preview">
            <img
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt="Selected Movie Poster"
            />
          </div>
        )}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={selectedMovie?.original_title || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Overview</label>
          <textarea
            rows={5}
            value={selectedMovie?.overview || ''}
            readOnly
          ></textarea>
        </div>
        <div className="form-group">
          <label>Popularity</label>
          <input
            type="text"
            value={selectedMovie?.popularity || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Release Date</label>
          <input
            type="text"
            value={selectedMovie?.release_date || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Vote Average</label>
          <input
            type="text"
            value={selectedMovie?.vote_average || ''}
            readOnly
          />
        </div>
        <button type="button" className="save-button" onClick={handleSave}>
          Save Movie
        </button>
      </form>

      {/* Tabs Section */}
      {movieId && selectedMovie && (
        <div className="tabs-section">
          <ul className="tabs">
            <li onClick={() => navigate(`/main/movies/form/${movieId}/cast`)}>Cast & Crews</li>
            <li onClick={() => navigate(`/main/movies/form/${movieId}/videos`)}>Videos</li>
            <li onClick={() => navigate(`/main/movies/form/${movieId}/photos`)}>Photos</li>
          </ul>
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Form;
