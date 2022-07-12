import React, { useState } from 'react';
import Logo from '../../images/Flappy_Bird_Logo.svg';
import './Header.scss';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
  const isLogged = localStorage.getItem('isLogged') === 'true' ? true : false;
  const [isBurgerActive, setIsBurgerActive] = useState(window.innerWidth > 768);
  const onOpenBurgerClick = () => {
    setIsBurgerActive(!isBurgerActive);
  };
  let variants = {};
  if (window.innerWidth < 768) {
    variants = {
      initial: {
        right: '-100%',
      },
      animate: {
        right: 0,
      },
      exit: {
        right: '-100%',
      },
    };
  }

  return (
    <header className='header'>
      <div className='header__container container'>
        <img src={Logo} className='header__logo' alt='логотип' />
        <AnimatePresence>
          {isBurgerActive && (
            <motion.div
              variants={variants}
              transition={{
                bounce: 'none',
              }}
              initial='initial'
              animate='animate'
              exit='exit'
              className={`header__links ${!isLogged && 'header__links_hidden'}`}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={`burger ${isBurgerActive && 'burger_active'}`}
          onClick={onOpenBurgerClick}
        >
          <div></div>
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
