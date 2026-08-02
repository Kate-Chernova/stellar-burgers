import { describe, test, expect } from '@jest/globals';
import ingredientsReducer, {
  getIngredients,
  ingredientsInitialState,
  getIngredientsFromState,
  getIngredientsIsLoading,
  getIngredientsIsRequested,
  getIngredientsError
} from '../ingredients';
import { TIngredient } from '../../../utils/types';

type TResponse = {
  __v: number;
};

const mockIngredientsData: (TResponse & TIngredient)[] = [
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
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
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
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  }
];

describe('Тестируем слайс ingredients', () => {
  test('Должен возвращать начальное состояние при undefined', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(ingredientsInitialState);
  });

  test('Должен устанавливать ingredientsIsLoading в true при pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.ingredientsIsLoading).toBe(true);
    expect(state.ingredientsIsRequested).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Должен записывать данные при fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredientsData
    };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.ingredientsIsLoading).toBe(false);
    expect(state.ingredientsIsRequested).toBe(true);
    expect(state.items).toEqual(mockIngredientsData);
    expect(state.error).toBeNull();
  });

  test('Должен записывать ошибку при rejected', () => {
    const errorMessage = 'Ошибка сети';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.ingredientsIsLoading).toBe(false);
    expect(state.ingredientsIsRequested).toBe(true);
    expect(state.error).toBe(errorMessage);
  });

  test('Должен устанавливать дефолтное сообщение при rejected без message', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: {}
    };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.error).toBe('Unknown error');
  });

  test('Не должен изменять состояние при неизвестном действии', () => {
    const currentState = {
      ...ingredientsInitialState,
      ingredientsIsLoading: true
    };
    const state = ingredientsReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(currentState);
  });

  describe('Тестируем селекторы ingredients', () => {
    const rootState = {
      ingredients: {
        ...ingredientsInitialState,
        items: mockIngredientsData,
        ingredientsIsLoading: false,
        ingredientsIsRequested: true,
        error: null
      }
    };

    test('getIngredientsFromState возвращает items', () => {
      expect(getIngredientsFromState(rootState)).toEqual(mockIngredientsData);
    });

    test('getIngredientsIsLoading возвращает флаг загрузки', () => {
      expect(getIngredientsIsLoading(rootState)).toBe(false);
    });

    test('getIngredientsIsRequested возвращает флаг запроса', () => {
      expect(getIngredientsIsRequested(rootState)).toBe(true);
    });

    test('getIngredientsError возвращает ошибку', () => {
      expect(getIngredientsError(rootState)).toBeNull();
    });
  });
});