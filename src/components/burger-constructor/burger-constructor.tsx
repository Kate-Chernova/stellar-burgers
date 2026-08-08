import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { clearOrder, createOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(
    (state: any) => state.burgerConstructor || { bun: null, ingredients: [] }
  );
  const orderRequest = useSelector((state: any) => state.order?.isLoading);
  const orderModalData = useSelector((state: any) => state.order?.order);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: { price: number }) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item: any) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredients));
    dispatch(clearConstructor());
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

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
