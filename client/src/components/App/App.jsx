import Header from '../Header/Header';
import './App.scss';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Main from '../Main/Main';
import RequireAuth from '../../hoc/RequireAuth';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux/es/exports';
import { loginUser } from '../../store/slices/thunks/userLoginThunk';
import LeaderboardContainer from '../LeaderboardContainer/LeaderboardContainer';
import IsAlreadyAuth from '../../hoc/AlreadyAuth';
import Settings from '../Settings/Settings';
import { removeUser } from '../../store/slices/UserSlice';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let themeLocal = localStorage.getItem('theme');
  const [theme, setTheme] = useState(themeLocal);
  const isLoggedLocal = localStorage.getItem('isLogged');
  // const [isLog ged, setIsLogged] = useState(false);
  // if (isLoggedLocal) {
  //   setIsLogged(isLoggedLocal);
  // }
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const isLogged = localStorage.getItem('isLogged');
    if (jwt && !isLogged) {
      dispatch(loginUser({ jwt }));
      localStorage.setItem('isLogged', true);
    }
  }, []);

  const onChangeThemeClick = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const onLogoutClick = () => {
    console.log(1);
    dispatch(removeUser());
    localStorage.removeItem('jwt');
    localStorage.setItem('isLogged', false);
    navigate('/login', { replace: true });
  };

  return (
    <div className={`page page_${theme}`}>
      <Header />
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth>
              <Main />
            </RequireAuth>
          }
        />
        <Route
          path='/leaderboard'
          element={
            <RequireAuth>
              <LeaderboardContainer />
            </RequireAuth>
          }
        />
        <Route
          path='/settings'
          element={
            <RequireAuth>
              <Settings
                theme={theme}
                onChangeThemeClick={onChangeThemeClick}
                onLogoutClick={onLogoutClick}
              />
            </RequireAuth>
          }
        />
        <Route
          path='/login'
          element={
            <IsAlreadyAuth>
              <Login />
            </IsAlreadyAuth>
          }
        />
        <Route
          path='/register'
          element={
            <IsAlreadyAuth>
              <Register />
            </IsAlreadyAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
