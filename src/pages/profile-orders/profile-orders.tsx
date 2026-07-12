import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrder, getOrdersSelector } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders = useSelector(getOrdersSelector) || [];

  useEffect(() => {
    // dispatch(checkUserAuth());
    dispatch(fetchOrder())
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
