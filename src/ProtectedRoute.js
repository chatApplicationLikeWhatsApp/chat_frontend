import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  const accessToken = localStorage.getItem('access_token');

  return accessToken ? Component : <Navigate to="/" />;
};

export default ProtectedRoute;
