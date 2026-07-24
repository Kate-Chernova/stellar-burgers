import { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const { pathname } = useLocation();

  const isFeedPage = pathname.startsWith('/feed');
  const isProfileOrdersPage = pathname.startsWith('/profile/orders');

  const ingredients = useSelector(
    (state) => state.ingredients.items
  ) as TIngredient[];

  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);

  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);


  const orderFromLists = useMemo(() => {
    const orderNumber = Number(number);
    if (!orderNumber) return null;

    if (isFeedPage)
      return feedOrders.find((o) => o.number === orderNumber) ?? null;
    if (isProfileOrdersPage)
      return profileOrders.find((o) => o.number === orderNumber) ?? null;

    return (
      feedOrders.find((o) => o.number === orderNumber) ??
      profileOrders.find((o) => o.number === orderNumber) ??
      null
    );
  }, [number, isFeedPage, isProfileOrdersPage, feedOrders, profileOrders]);

  useEffect(() => {
    const orderNumber = Number(number);
    if (!orderNumber) return;

    if (orderFromLists) {
      setFetchedOrder(null);
      return;
    }

    let cancelled = false;

    getOrderByNumberApi(orderNumber)
      .then((res) => {
        const order = res.orders?.[0] ?? null;
        if (!cancelled) setFetchedOrder(order);
      })
      .catch(() => {
        if (!cancelled) setFetchedOrder(null);
      });

    return () => {
      cancelled = true;
    };
  }, [number, orderFromLists]);

  // 3) Источник данных: store -> иначе fetchedOrder
  const orderData = orderFromLists ?? fetchedOrder;

  // 4) Готовим данные для UI
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        if (!acc[itemId]) {
          const ingredient = ingredients.find((ing) => ing._id === itemId);
          if (ingredient) acc[itemId] = { ...ingredient, count: 1 };
        } else {
          acc[itemId].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
