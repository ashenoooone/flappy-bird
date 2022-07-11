import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/thunks/userLoginThunk';
import './Login.scss';

const Login = () => {
  const error = useSelector((state) => state.user.error);
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
    navigate('/');
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
          <pre className='form__error' style={{ minHeight: 48 }}>
            {error}
          </pre>
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
