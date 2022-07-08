import React from 'react';
import './Register.scss';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
// почта
// пароль от 6 до 30 символов
// имя пользователя от 4 до 30 символов
const Register = () => {
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
    if (!/\W{4,30}/.test(values.username)) {
      errors.username =
        'Имя пользователя должно быть длиннее 4 символов и короче 30';
    }
    if (
      !/.{6,}/g.test(values.password) ||
      !/\d{1,}/g.test(values.password) ||
      !/[A-Z]{1,}/g.test(values.password) ||
      !/[!@#$%^&*]{1,}/g.test(values.password)
    ) {
      errors.password = `Пароль не подходит следующим требованиям: 
        *минимальная длина 6 символов.
        *хотя бы одна заглавная буква.
        *один специальный символ(!@#$%^&*).
        *хотя бы одна цифра.`;
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
              <Field
                type='text'
                className='register__input input'
                name='username'
                placeholder='Имя пользователя'
              />
              <pre className='form__error' style={{ minHeight: 48 }}>
                {touched.username && errors.username}
              </pre>
              <Field
                type='password'
                className='register__input input'
                name='password'
                placeholder='Пароль'
              />
              <pre className='form__error' style={{ minHeight: 120 }}>
                {touched.password && errors.password}
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
          <p className='register__text'>Есть аккаунт на Toxin?</p>
          <Link to='/login' className='button button_transparent'>
            Войти
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
