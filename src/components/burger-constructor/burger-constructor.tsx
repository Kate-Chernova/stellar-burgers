import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { constructorSlice, getBunSelector, getIngredientsConstructorSelector } from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';
import { clearOrder, createOrder, getOrderLoadingSelector, getOrderSelector, getOrdersSelector } from '../../services/slices/orderSlice';
import { getAuthCheckSelector } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';


export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const bun = useSelector(getBunSelector);
  const ingredients = useSelector(getIngredientsConstructorSelector);
  const constructorItems = { bun, ingredients };

  const orderRequest = useSelector(getOrderLoadingSelector);
  const orderModalData = useSelector(getOrderSelector);

  const authCheck = useSelector(getAuthCheckSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!authCheck) {
      navigate('/login');
      return
    }
    const order = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(order));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(constructorSlice.actions.clearConstructor());
    dispatch(constructorSlice.actions.resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
