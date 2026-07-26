import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients, selectIsIngredientsLoading } from '@selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const ingredientData = ingredients.find((i) => i._id === id);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p>Ингридиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
