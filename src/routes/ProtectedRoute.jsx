import { Outlet } from 'react-router-dom';

import AuthRedirect from '../auth/AuthRedirect';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') || false;
  return isAuthenticated ? <Outlet /> : <AuthRedirect />;
};

export default ProtectedRoute;
