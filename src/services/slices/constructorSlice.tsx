import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { v4 as uuid } from 'uuid';

interface IConstructorSlice {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IConstructorSlice = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerSlice',
  initialState,
  reducers: {
    // Добавление ингредиента с использованием prepare
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() } // Генерируем id здесь
      })
    },
    
    // Удаление ингредиента
    removeIngredient: (state, { payload }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== payload);
    },
    
    // Сброс конструктора
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    
    // Перемещение ингредиента вверх
    moveIngredientUp: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.ingredients.findIndex((item) => item.id === action.payload.id);
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    
    // Перемещение ингредиента вниз
    moveIngredientDown: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.ingredients.findIndex((item) => item.id === action.payload.id);
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    
    // Очищение конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getBunSelector: (state) => state.bun,
    getIngredientsConstructorSelector: (state) => state.ingredients
  }
});

// Экспорт экшенов
export const { 
  addIngredient, 
  removeIngredient, 
  moveIngredientUp, 
  moveIngredientDown, 
  clearConstructor,
  resetConstructor 
} = constructorSlice.actions;

// Экспорт селекторов
export const { getBunSelector, getIngredientsConstructorSelector } = constructorSlice.selectors;

export default constructorSlice.reducer;