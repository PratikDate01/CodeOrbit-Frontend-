import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { userInfo } = useAuth();
  return userInfo ? children : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
  const { userInfo } = useAuth();
  return userInfo && userInfo.role === 'admin' ? children : <Navigate to="/" />;
};
