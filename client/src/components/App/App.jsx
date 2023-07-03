import Header from '../Header/Header';
import './App.scss';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Main from '../Main/Main';
import RequireAuth from '../../hoc/RequireAuth';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux/es/exports';
import {loginUser} from '../../store/slices/UserSlice';
import LeaderboardContainer from '../LeaderboardContainer/LeaderboardContainer';
import IsAlreadyAuth from '../../hoc/AlreadyAuth';
import Settings from '../Settings/Settings';
import {removeUser} from '../../store/slices/UserSlice';
import Game from '../Game/Game';
import ShopPage from "../Shop/ShopPage";
import {ToastContainer} from "react-toastify";

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [theme, setTheme] = useState(
		sessionStorage.getItem('theme') || 'light'
	);

	useEffect(() => {
		const jwt = localStorage.getItem('jwt');
		const isLogged = sessionStorage.getItem('isLogged');
		if (jwt && !isLogged) {
			dispatch(loginUser({jwt}));
			sessionStorage.setItem('isLogged', true);
		}
	}, []);

	const onChangeThemeClick = () => {
		if (theme === 'light') {
			setTheme('dark');
			sessionStorage.setItem('theme', 'dark');
		} else if (theme === 'dark') {
			setTheme('light');
			sessionStorage.setItem('theme', 'light');
		}
	};

	const onLogoutClick = () => {
		dispatch(removeUser());
		localStorage.removeItem('jwt');
		sessionStorage.setItem('isLogged', false);
		navigate('/login', {replace: true});
	};

	return (
		<div className={`page page_${theme}`}>
			<Header/>
			<Routes>
				<Route
					path='/'
					element={
						<RequireAuth>
							<Main/>
						</RequireAuth>
					}
				/>
				<Route
					path='/leaderboard'
					element={
						<RequireAuth>
							<LeaderboardContainer/>
						</RequireAuth>
					}
				/>
				<Route
					path='/shop'
					element={
						<RequireAuth>
							<ShopPage/>
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
					path='/play'
					element={
						<RequireAuth>
							<Game/>
						</RequireAuth>
					}
				/>
				<Route
					path='/login'
					element={
						<IsAlreadyAuth>
							<Login/>
						</IsAlreadyAuth>
					}
				/>
				<Route
					path='/register'
					element={
						<IsAlreadyAuth>
							<Register/>
						</IsAlreadyAuth>
					}
				/>
			</Routes>
			<ToastContainer
				position={'bottom-right'}
			/>
		</div>
	);
}

export default App;
