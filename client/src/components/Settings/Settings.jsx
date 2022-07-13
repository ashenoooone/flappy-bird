import React from 'react';
import './Settings.scss';
import { useState } from 'react';
import { useDispatch } from 'react-redux/es/exports';
import { updateUser } from '../../store/slices/UserSlice';

const Settings = ({ theme, onChangeThemeClick, onLogoutClick }) => {
  const [userName, setUserName] = useState(sessionStorage.getItem('username'));
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const onUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const onChangeUserNameClick = () => {
    dispatch(updateUser({ jwt, username: userName }));
  };
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
                checked={theme === 'light'}
                onChange={onChangeThemeClick}
                type='radio'
              />
            </label>
            <label className='settings__label'>
              Темная
              <input
                name='theme'
                checked={theme === 'dark'}
                onChange={onChangeThemeClick}
                type='radio'
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
        <button className='button button_default' onClick={onLogoutClick}>
          Выйти
        </button>
      </div>
    </section>
  );
};

export default React.memo(Settings);
