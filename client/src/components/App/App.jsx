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
import {loginUser, updateUser} from '../../store/slices/UserSlice';
import LeaderboardContainer from '../LeaderboardContainer/LeaderboardContainer';
import IsAlreadyAuth from '../../hoc/AlreadyAuth';
import Settings from '../Settings/Settings';
import {removeUser} from '../../store/slices/UserSlice';
import Game from '../Game/Game';
import ShopPage from "../Shop/ShopPage";
import {ToastContainer} from "react-toastify";
import {useSelector} from "react-redux";
import AdminUsers from "../Admin/nested/users/AdminUsers";
import Admin from "../Admin/Admin";
import AdminSkins from "../Admin/nested/skins/AdminSkins";

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userTheme = useSelector(state => state.user.settings.theme)
	const [theme, setTheme] = useState(
		userTheme
	);

	useEffect(() => {
		const jwt = localStorage.getItem('jwt');
		const isLogged = sessionStorage.getItem('isLogged');
		if (jwt && !isLogged) {
			dispatch(loginUser({jwt}));
			sessionStorage.setItem('isLogged', true);
		}
	}, []);

	const onChangeThemeClick = (event) => {
		const newTheme = event.target.id;
		dispatch(updateUser({theme: newTheme}))
		setTheme(newTheme)
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
					path='/admin'
					element={
						<RequireAuth>
							<Admin/>
						</RequireAuth>
					}
				/>
				<Route
					path='/admin/users'
					element={
						<RequireAuth>
							<AdminUsers/>
						</RequireAuth>
					}
				/>
				<Route
					path='/admin/skins'
					element={
						<RequireAuth>
							<AdminSkins/>
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
