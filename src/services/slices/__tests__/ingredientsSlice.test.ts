import { describe, test, expect } from '@jest/globals';
import ingredientsReducer, {
  getIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('Тестируем слайс ingredients', () => {
  test('Должен возвращать начальное состояние при undefined', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  test('Должен устанавливать isLoading в true при pending', () => {
    const state = ingredientsReducer(undefined, getIngredients.pending(''));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Должен записывать данные при fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.fulfilled(mockIngredients, '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('Должен записывать ошибку при rejected', () => {
    const errorMessage = 'Ошибка сети';
    const state = ingredientsReducer(
      undefined,
      getIngredients.rejected(new Error(errorMessage), '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('Не должен изменять состояние при неизвестном действии', () => {
    const currentState = {
      items: mockIngredients,
      isLoading: false,
      error: null
    };
    const state = ingredientsReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(currentState);
  });

  describe('Тестируем селекторы ingredients', () => {
    const rootState = {
      ingredients: {
        items: mockIngredients,
        isLoading: false,
        error: null
      }
    };

    test('selectIngredients возвращает items', () => {
      expect(selectIngredients(rootState)).toEqual(mockIngredients);
    });

    test('selectIngredientsLoading возвращает флаг загрузки', () => {
      expect(selectIngredientsLoading(rootState)).toBe(false);
    });

    test('selectIngredientsError возвращает ошибку', () => {
      expect(selectIngredientsError(rootState)).toBeNull();
    });
  });
});