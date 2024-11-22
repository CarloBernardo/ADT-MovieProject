import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, Form, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/Public/Login/LoginPage';
import RegisterPage from './pages/Public/Register/RegisterPage';
import Main from './pages/Main/Main';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Lists from './pages/Main/Movies/Lists/Lists';
import Forms from './pages/Main/Movies/Form/Form';
import Movies from './pages/Main/Movies/Movies';

const router = createBrowserRouter([
  
  { path: '/',
    element: <LoginPage/>,
  },
  {
    path: '/register',
    element: <RegisterPage/>,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      //Temporarily disabled the dashboard route
      // {
      //   path: '/main/dashboard',
      //   element: <Dashboard />,
      // },
      {
        path: '/main/movies',
        element: <Movies/>,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:movieId?',
            element: <Forms />,
          },
        ],
      },
    ],
  },
]);
function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
