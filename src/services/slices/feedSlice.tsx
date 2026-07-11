import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {TOrder} from '../../utils/types'
import { getFeedsApi } from "@api"


export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds', async () => {
    const result = getFeedsApi();
    return result;
  }
)

interface IFeedSlice {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: null | string;
}


const initialState: IFeedSlice = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
}

export const feedSlice = createSlice({
  name: 'feedSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error feed';
      })
  },
  selectors: {
    getFeedOrdersSelector: (state) => state.orders,
    getFeedLoadingSelector: (state) => state.isLoading,
    getFeedTotalSelector: (state) => state.total,
    getFeedTotalTodaySelector: (state) => state.totalToday,
    getFeedErrorSelector: (state) => state.error
  }
}
)

export const {
  getFeedOrdersSelector,
  getFeedLoadingSelector,
  getFeedTotalSelector,
  getFeedTotalTodaySelector,
  getFeedErrorSelector
} = feedSlice.selectors;

export default feedSlice.reducer;