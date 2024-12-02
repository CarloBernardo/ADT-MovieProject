import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);

  const getMovies = () => {
    // Fetch movies from the API or database
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
          // Update the movie list array
          setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
        });
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          className="button-list"
          type="button"
          onClick={() => {
            navigate('/main/movies/form');
          }}
        >
          Create New
        </button>
      </div>
      <div className="table-container">
        <table className="movie-lists">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Popularity</th>
              <th>Release Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>{movie.popularity}</td>
                <td>{movie.dateCreated}</td>
                <td>
                  <button
                    className="button-list"
                    type="button"
                    onClick={() => navigate(`/main/movies/form/${movie.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="button-list"
                    type="button"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
