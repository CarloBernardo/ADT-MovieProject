import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);

  const getMovies = () => {
    axios.get('/movies').then((response) => {
      setLists(response.data);
    });
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      'Are you sure you want to delete this movie?'
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          
        })
        .then(() => {
          setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
        });
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          className="button-create"
          type="button"
          onClick={() => navigate('/main/movies/form')}
        >
          
          + Add New Movie
        </button>
      </div>
      <div className="movie-grid">
        {lists.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`}
              alt={`${movie.title} Poster`}
            />
            <div className="movie-details">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-info">
                <span>Popularity:</span> {movie.popularity}
              </p>
              <p className="movie-info">
                <span>Release Date:</span> {movie.dateCreated}
              </p>
            </div>
            <div className="movie-actions">
              <button
                className="button-edit"
                type="button"
                onClick={() => navigate(`/main/movies/form/${movie.id}`)}
              >
                Edit
              </button>
              <button
                className="button-delete"
                type="button"
                onClick={() => handleDelete(movie.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lists;
