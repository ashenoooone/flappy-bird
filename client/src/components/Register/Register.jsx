import React, { useState } from 'react';
import './Register.scss';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/slices/thunks/userRegisterThunk';
// почта
// пароль от 6 до 30 символов
// имя пользователя от 4 до 30 символов
const Register = () => {
  const [isPasswordHiden, setIsPasswordHiden] = useState(true);
  const dispatch = useDispatch();
  const onShowPasswordClick = (event) => {
    if (!event.target.classList.contains('input')) {
      event.target.classList.toggle('no-view');
      setIsPasswordHiden(!isPasswordHiden);
    }
  };
  // начальные значения
  const initialValues = {
    email: '',
    password: '',
    username: '',
  };
  // функиция валидирующая поля
  const validate = (values) => {
    const errors = {};
    if (!/.{4,255}@.{2,255}\..{2,255}/g.test(values.email)) {
      errors.email = 'Введите корректный адресс электронной почты.';
    }
    if (!/^(?=[A-Za-z]).{4,30}/.test(values.username)) {
      errors.username =
        'Длина имени пользователя 4-30 символов, быть хотя бы одна буква.';
    }
    if (!/.{6,40}/g.test(values.password)) {
      errors.password = 'Длина пароля должна составлять от 6 до 40 символов';
    } else if (!/\d{1,}/g.test(values.password)) {
      errors.password = 'В пароле должна быть хотя бы одна цифра';
    } else if (!/[A-Z]{1,}/g.test(values.password)) {
      errors.password = 'В пароле должна быть хотя бы одна заглавная буква';
    } else if (!/[!@#$%^&*]{1,}/g.test(values.password)) {
      errors.password =
        'В пароле должен быть хотя бы один специальный символ (!@#$%^&*)';
    }
    return errors;
  };

  return (
    <section className='register'>
      <div className='register__container'>
        <h1 className='register__title'>Регистрация аккаунта</h1>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={(values) => {
            console.log(values);
            dispatch(registerUser(values));
          }}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form className='register__form form'>
              <Field
                type='email'
                className='register__input input'
                placeholder='Почта'
                name='email'
              />
              <pre className='form__error' style={{ minHeight: 24 }}>
                {touched.email && errors.email}
              </pre>
              <div
                onClick={onShowPasswordClick}
                className={`form__password-input-container ${
                  !isPasswordHiden && 'no-view'
                }`}
              >
                <Field
                  type={`${isPasswordHiden ? 'password' : 'text'}`}
                  className='register__input input'
                  name='password'
                  placeholder='Пароль'
                />
              </div>
              <pre className='form__error' style={{ minHeight: 48 }}>
                {touched.password && errors.password}
              </pre>
              <Field
                type='text'
                className='register__input input'
                name='username'
                placeholder='Имя пользователя'
              />
              <pre className='form__error' style={{ minHeight: 48 }}>
                {touched.username && errors.username}
              </pre>
              <button
                type='submit'
                className={`button button_default ${
                  (!isValid || !dirty) && 'button_inactive'
                }`}
              >
                Зарегистрироваться
              </button>
            </Form>
          )}
        </Formik>
        <div className='register__no-account'>
          <p className='register__text'>Есть аккаунт?</p>
          <Link to='/login' className='button button_transparent'>
            Войти
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
