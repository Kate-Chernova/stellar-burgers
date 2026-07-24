import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean; 
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  element,
  onlyUnAuth = false
}) => {
  const location = useLocation();

  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  
  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return user ? <Navigate to={from} replace /> : element;
  }

  return user ? (
    element
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};