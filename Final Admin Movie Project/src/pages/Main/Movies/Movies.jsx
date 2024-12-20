import { Outlet } from 'react-router-dom';

const Movie = () => {
  return (
    <>
      <h1>Movies</h1>
      <Outlet />
    </>
  );
};

export default Movie;