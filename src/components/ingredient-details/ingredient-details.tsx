import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientData = ingredients.find((i: TIngredient) => i._id === id);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <div>Ингридиент не найден</div>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
