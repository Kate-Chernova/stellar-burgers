import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  feed: { total: number; totalToday: number };
  isLoading: boolean;
};

const initialState: TFeedState = {
  orders: [],
  feed: { total: 0, totalToday: 0 },
  isLoading: false
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchAll',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.feed = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default feedSlice.reducer;
