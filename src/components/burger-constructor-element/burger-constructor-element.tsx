import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { moveIngredientsDown, moveIngredientsUp, removeIngredients } from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveDown = () => {
      dispatch(moveIngredientsDown({id: ingredient.id}));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredientsUp({id: ingredient.id}));
    };

    const handleClose = () => {
      dispatch(removeIngredients(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
