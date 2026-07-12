import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {TIngredient} from '../../utils/types'
import { getIngredientsApi } from '@api';

interface IIngredientState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredientState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    console.log('gooooooood')
    const result = getIngredientsApi();
    console.log(result);
    return result;
    // try {
    //   console.log('all good')
    //   return await getIngredientsApi();
      
    // } catch (error) {
    //   console.log('all bad')
    //   throw error
    // };
  }
)

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error';
      });
  },
  selectors: {
    getIngredientsSelector: (state: IIngredientState) => state.ingredients,
    getLoadingSelector: (state: IIngredientState) => state.isLoading

  }
});

export const { getIngredientsSelector, getLoadingSelector } = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
