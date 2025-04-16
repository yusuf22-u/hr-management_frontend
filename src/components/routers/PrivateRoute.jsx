import React from 'react';
import { Navigate } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, requiredRole }) => {
  const token = sessionStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // const decodedToken = jwtDecode(token);
  
  // if (requiredRole && decodedToken.role !== requiredRole) {
  //   return <Navigate to="/unauthorized" />;
  // }

  return children;
};

export default PrivateRoute;
