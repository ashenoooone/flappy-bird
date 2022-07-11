import React from 'react';
import Logo from '../../images/Flappy_Bird_Logo.svg';
import './Header.scss';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux/es/exports';

const Header = () => {
  const isLogged = localStorage.getItem('isLogged');
  return (
    <header className='header'>
      <div className='header__wrapper'>
        <img src={Logo} className='header__logo' alt='логотип' />
        <div className={`header__links ${!isLogged && 'header__links_hidden'}`}>
          <NavLink
            to='/'
            title='Главная'
            className={({ isActive }) =>
              'link' + (isActive ? ' link_active' : '')
            }
          >
            Главная
          </NavLink>
          <NavLink
            to='/settings'
            title='Настройки'
            className={({ isActive }) =>
              'link' + (isActive ? ' link_active' : '')
            }
          >
            Настройки
          </NavLink>
          <NavLink
            title='Таблица лидеров'
            to='/leaderboard'
            className={({ isActive }) =>
              'link' + (isActive ? ' link_active' : '')
            }
          >
            Таблица лидеров
          </NavLink>
          <NavLink
            title='Играть'
            to='/play'
            className={({ isActive }) =>
              'link' + (isActive ? ' link_active' : '')
            }
          >
            Играть
          </NavLink>
        </div>
        <div
          className={`header__buttons ${isLogged && 'header__buttons_hidden'}`}
        >
          <Link to='/login' className='button button_transparent'>
            Авторизация
          </Link>
          <Link to='/register' className='button button_default'>
            Регистрация
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
