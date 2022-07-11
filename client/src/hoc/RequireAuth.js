import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isLogged = localStorage.getItem('isLogged') === 'true' ? true : false;
  return isLogged ? children : <Navigate to='/login' />;
};

export default RequireAuth;
