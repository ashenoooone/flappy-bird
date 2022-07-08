import React from 'react';
import Logo from '../../images/Flappy_Bird_Logo.svg';
import './Header.scss';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='header'>
      <div className='header__wrapper'>
        <img src={Logo} className='header__logo' alt='логотип' />
        <div className='header__buttons'>
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
