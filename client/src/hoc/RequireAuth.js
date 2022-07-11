import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isLogged = localStorage.getItem('isLogged');
  return isLogged ? children : <Navigate to='/' />;
};

export default RequireAuth;
