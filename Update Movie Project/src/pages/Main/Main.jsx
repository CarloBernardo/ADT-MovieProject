import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <button 
                className='nav-button home-button' 
                onClick={() => navigate('/main/movies')}
              >
                <FontAwesomeIcon icon={faHome} className='nav-icon' />
                Home
              </button>
            </li>
            <li>
              <button 
                className='nav-button logout-button' 
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className='nav-icon' />
                Logout
              </button>
            </li>
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;