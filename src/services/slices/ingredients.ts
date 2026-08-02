import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => getIngredientsApi()
);

type TIngredientState = {
  items: TIngredient[];
  ingredientsIsLoading: boolean;
  ingredientsIsRequested: boolean;
  error: string | null;
};

export const ingredientsInitialState: TIngredientState = {
  items: [],
  ingredientsIsLoading: false,
  ingredientsIsRequested: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: ingredientsInitialState,
  reducers: {},
  selectors: {
    getIngredientsFromState: (state) => state.items,
    getIngredientsIsLoading: (state) => state.ingredientsIsLoading,
    getIngredientsIsRequested: (state) => state.ingredientsIsRequested,
    getIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.ingredientsIsLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredientsIsLoading = false;
        state.ingredientsIsRequested = true;
        state.items = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.ingredientsIsLoading = false;
        state.ingredientsIsRequested = true;
        state.error = action.error.message ?? 'Unknown error';
      });
  }
});

export default ingredientsSlice.reducer;

export const {
  getIngredientsFromState,
  getIngredientsIsLoading,
  getIngredientsIsRequested,
  getIngredientsError
} = ingredientsSlice.selectors;