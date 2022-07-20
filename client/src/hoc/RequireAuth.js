import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isLogged = sessionStorage.getItem('isLogged') === 'true' ? true : false;
  return isLogged ? children : <Navigate to='/register' />;
};

export default RequireAuth;
