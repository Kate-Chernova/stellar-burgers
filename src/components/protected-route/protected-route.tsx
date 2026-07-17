import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { getUserData } from '../../services/slices/user';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children?: React.ReactElement;
  onlyAuthorized?: boolean;
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  onlyAuthorized = true,
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked, isAuthenticated, loginUserRequest, request } = 
    useSelector(getUserData);

  if (loginUserRequest || request) {
    return <Preloader />;
  }

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyAuthorized && !isAuthenticated) {
    return <Navigate replace to={redirectTo} state={{ from: location }} />;
  }

  if (!onlyAuthorized && isAuthenticated) {
    
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children ? children : <Outlet />;
};