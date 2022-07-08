import React from 'react';
import { Link } from 'react-router-dom';
import './Login.scss';
const Login = () => {
  return (
    <section className='login'>
      <div className='login__container'>
        <h1 className='login__title'>Войти</h1>
        <form className='login__form'>
          <input
            type='email'
            className='login__input input'
            placeholder='Почта'
          />
          <input
            type='text'
            className='login__input input'
            placeholder='Имя пользователя'
          />
          <input
            type='password'
            className='login__input input'
            placeholder='Пароль'
          />
          <button className='button button_default'>Войти</button>
        </form>
        <div className='login__no-account'>
          <p className='login__text'>Нет аккаунта на Toxin?</p>
          <Link to='/register' className='button button_transparent'>
            Создать
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
