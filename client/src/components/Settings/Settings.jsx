import React, {useEffect} from 'react';
import './Settings.scss';
import {useState} from 'react';
import {useDispatch} from 'react-redux/es/exports';
import {loginUser, updateUser} from '../../store/slices/UserSlice';
import {useSelector} from "react-redux";

const Settings = ({theme, onChangeThemeClick, onLogoutClick}) => {
	const user = useSelector(state => state.user)
	const [userName, setUserName] = useState(user.username || "");
	const dispatch = useDispatch();
	const jwt = localStorage.getItem('jwt');
	const [isSoundsAllowed, setIsSoundsAllowed] = useState(
		Boolean(user.settings.sounds)
	);
	const onAllowSoundsClick = (e) => {
		setIsSoundsAllowed(!isSoundsAllowed)
		dispatch(updateUser({sounds: !isSoundsAllowed}))
	};
	const onUserNameChange = (e) => {
		setUserName(e.target.value);
	};
	const onChangeUserNameClick = () => {
		dispatch(updateUser({jwt, username: userName}));
	};

	useEffect(() => {
		dispatch(loginUser({jwt: localStorage.getItem("jwt")}))
	}, []);

	return (
		<section className='settings'>
			<div className='container'>
				<h2>Настройки</h2>
				<div className='settings__theme'>
					<p className='settings__text'>Тема</p>
					<div className='settings__inputs'>
						<label className='settings__label'>
							Светлая
							<input
								name='theme'
								checked={theme === 'LIGHT'}
								onChange={onChangeThemeClick}
								type='radio'
								id={'LIGHT'}
							/>
						</label>
						<label className='settings__label'>
							Темная
							<input
								name='theme'
								checked={theme === 'DARK'}
								onChange={onChangeThemeClick}
								type='radio'
								id={'DARK'}
							/>
						</label>
					</div>
				</div>
				<div className='settings__user-name'>
					<label className='settings__label'>
						Имя пользователя
						<input
							name='name'
							type='text'
							value={userName}
							minLength='4'
							onChange={onUserNameChange}
						/>
					</label>
					<button
						className='button button_default'
						onClick={onChangeUserNameClick}
					>
						Сменить имя пользователя
					</button>
				</div>
				<div className='settings__sounds'>
					<p className='settings__text'>Звуки игры</p>
					<div className='settings__inputs'>
						<label className='settings__label'>
							Вкл
							<input
								onChange={onAllowSoundsClick}
								checked={isSoundsAllowed}
								name='sounds'
								type='radio'
							/>
						</label>
						<label className='settings__label'>
							Выкл
							<input
								onChange={onAllowSoundsClick}
								checked={!isSoundsAllowed}
								name='sounds'
								type='radio'
							/>
						</label>
					</div>
				</div>
				<button className='button button_default' onClick={onLogoutClick}>
					Выйти
				</button>
			</div>
		</section>
	);
};

export default React.memo(Settings);
