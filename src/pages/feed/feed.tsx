import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFeedOrdersSelector, feedSlice, fetchFeeds} from '../../services/slices/feedSlice';
import { useDispatch } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getFeedOrdersSelector);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch])

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />;
};
