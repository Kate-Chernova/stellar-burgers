import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import styles from './app.module.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useEffect } from 'react';
import { checkUserAuth } from '../../services/slices/userSlice';
import { TitledModal } from '../titled-modal';
import { selectIsIngredientsLoading, selectIsAuthChecked } from '@selectors';
console.log('APP');
const App = () => {
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const location = useLocation();
  const background = location.state?.background;
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, []);
  const navigate = useNavigate();

  if (!isAuthChecked || isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='feed' element={<Feed />} />
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='reset-password' element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='profile' element={<Profile />} />
          <Route path='profile/orders' element={<ProfileOrders />} />
          <Route path='profile/orders/:number' element={<OrderInfo />} />
        </Route>

        <Route path='feed/:number' element={<OrderInfo />} />
        <Route path='ingredients/:id' element={<IngredientDetails />} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='feed/:number'
            element={<TitledModal onClose={() => navigate(-1)} />}
          />
          <Route
            path='ingredients/:id'
            element={
              <Modal title='Детали ингридиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path='profile/orders/:number'
              element={<TitledModal onClose={() => navigate(-1)} />}
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
