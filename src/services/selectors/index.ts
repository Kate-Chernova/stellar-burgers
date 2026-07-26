import { RootState } from '../store';

export const selectIsIngredientsLoading = (state: RootState) =>
  state.ingredients.isIngredientsLoading;
export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserOrders = (state: RootState) => state.user.orders;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedIsLoading = (state: RootState) => state.feed.isLoading;
export const selectFeed = (state: RootState) => state.feed.feed;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
