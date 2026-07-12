import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';


interface IOrderSlice {
  name: string | null;
  order: TOrder | null;
  orders: TOrder[] | null;
  orderNumber: TOrder | null;
  isLoading: boolean;
  error?: string | null;
}

const initialState: IOrderSlice = {
  name: null,
  order: null,
  orders: [],
  orderNumber: null,
  isLoading: false,
  error: null
};

export const fetchOrder = createAsyncThunk('order/fetchOrder', async () => {
  const result = getOrdersApi();
  return result;
});

export const fetchOrderNumber = createAsyncThunk(
  'order/fetchOrderNumber',
  async (number: number) => {
    const result = getOrderByNumberApi(number);
    return result;
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingtredients: string[]) => {
    const result = await orderBurgerApi(ingtredients);
    return result;
  }
);

export const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.name = null;
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error order';
      });
    builder
      .addCase(fetchOrderNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload.orders[0];
      })
      .addCase(fetchOrderNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error order';
      });
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error order';
      });
  },
  selectors: {
    getOrderNameSelector: (state) => state.name,
    getOrderSelector: (state) => state.order,
    getOrdersSelector: (state) => state.orders,
    getOrderNumberSelector: (state) => state.orderNumber,
    getOrderLoadingSelector: (state) => state.isLoading,
    getOrderErrorSelector: (state) => state.error
  }
});

export const {
  getOrderNameSelector,
  getOrderSelector,
  getOrdersSelector,
  getOrderNumberSelector,
  getOrderLoadingSelector,
  getOrderErrorSelector
} = orderSlice.selectors;

export default orderSlice.reducer;

export const { clearOrder } = orderSlice.actions;
