import { useEffect } from 'react';
import { AppHeader } from '@components';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { ConstructorPage } from '../../pages/constructor-page/constructor-page';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';
import { Modal } from '../../components/modal/modal';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoading = useSelector((state: any) => state.ingredients?.isLoading);
  const error = useSelector((state: any) => state.ingredients?.error);
  const background = location.state?.background;

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  if (isLoading) {
    return <div className={styles.app}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.app}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
