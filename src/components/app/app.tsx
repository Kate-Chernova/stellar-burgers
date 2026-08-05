import { useEffect } from 'react';
import { AppHeader } from '@components';
import { Outlet } from 'react-router-dom';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients, selectIngredientsLoading, selectIngredientsError } from '../../services/slices/ingredientsSlice';

const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

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
      <Outlet />
    </div>
  );
};

export default App;