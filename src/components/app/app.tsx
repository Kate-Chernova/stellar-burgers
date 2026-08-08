import { useEffect } from 'react';
import { AppHeader } from '@components';
import { Routes, Route } from 'react-router-dom';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { ConstructorPage } from '../../pages/constructor-page/constructor-page';

const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.ingredients?.isLoading);
  const error = useSelector((state: any) => state.ingredients?.error);

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
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
      </Routes>
    </div>
  );
};

export default App;
