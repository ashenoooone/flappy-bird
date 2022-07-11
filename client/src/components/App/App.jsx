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

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      dispatch(loginUser({ jwt }));
      localStorage.setItem('isLogged', true);
    }
  }, []);

  return (
    <>
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
    </>
  );
}

export default App;
