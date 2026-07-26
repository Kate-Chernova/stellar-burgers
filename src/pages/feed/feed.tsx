import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { selectFeedIsLoading, selectFeedOrders } from '@selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectFeedIsLoading);
  const orders: TOrder[] = useSelector(selectFeedOrders);
  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);
  if (isLoading) {
    return <Preloader />;
  }
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
