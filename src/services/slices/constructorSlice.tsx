import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TConstructorIngredient, TIngredient} from '../../utils/types';
import {v4 as uuid} from 'uuid';



interface IConstructorSlice {
  bun:  TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IConstructorSlice = {
  bun: null,
  ingredients: []
}

export const constructorSlice = createSlice({
  name: 'burgerSlice',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredients: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = {...action.payload, id: uuid()};
      }
      else {
        state.ingredients.push({...action.payload, id: uuid()})
      }
    },
    // Удаление ингредиента
    removeIngredients: (state, {payload}: PayloadAction<string>) => {
      // если выбрали элемент, то он не попадает в отфильтрованный список
      state.ingredients = state.ingredients.filter((item) => item.id !== payload);
    },
    resetConstructor : (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    // Перемещение ингредиента вверх 
    moveIngredientsUp: (state, action) => {
      const index = state.ingredients.findIndex((item) => item.id === action.payload.id);
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    // Перемещение ингредиента вниз
    moveIngredientsDown: (state, action) => {
      const index = state.ingredients.findIndex((item) => item.id === action.payload.id);
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    // очищение корзины 
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getBunSelector: (state) => state.bun,
    getIngredientsConstructorSelector: (state) => state.ingredients
  }
}
);

export const { addIngredients, removeIngredients, moveIngredientsUp, moveIngredientsDown, clearConstructor } = constructorSlice.actions;
export const { getBunSelector, getIngredientsConstructorSelector } = constructorSlice.selectors;

export default constructorSlice.reducer;
