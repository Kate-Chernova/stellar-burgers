import { TOrder, TNewOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: any;
  orderRequest: boolean;
  price: number;
  orderModalData: (TOrder | TNewOrder) | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};