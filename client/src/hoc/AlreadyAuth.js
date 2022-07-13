import React from 'react';
import { Navigate } from 'react-router-dom';

const IsAlreadyAuth = ({ children }) => {
  const isLogged = sessionStorage.getItem('isLogged') === 'true' ? true : false;
  return isLogged ? <Navigate to='/' /> : children;
};

export default IsAlreadyAuth;
