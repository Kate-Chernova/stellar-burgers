import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser } from '@selectors';
import { selectIsAuthChecked } from '@selectors';
import { Preloader } from '@ui';
type Props = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth = false }: Props) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuth = !!user;
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  return <Outlet />;
};