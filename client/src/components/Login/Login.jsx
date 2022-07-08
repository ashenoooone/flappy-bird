import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../../store/slices/thunks/userLoginThunk';
import './Login.scss';
const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <section className='login'>
      <div className='login__container'>
        <h1 className='login__title'>Войти</h1>
        <form className='login__form form' onSubmit={onSubmit}>
          <input
            type='email'
            className='login__input input'
            placeholder='Почта'
            onChange={onEmailChange}
            value={email}
            required
          />
          <input
            type='password'
            className='login__input input'
            placeholder='Пароль'
            onChange={onPasswordChange}
            value={password}
            required
          />
          <button type='submit' className='button button_default'>
            Войти
          </button>
        </form>
        <div className='login__no-account'>
          <p className='login__text'>Нет аккаунта?</p>
          <Link to='/register' className='button button_transparent'>
            Создать
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
