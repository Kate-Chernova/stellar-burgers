import { describe, test, expect } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '../../../utils/types';

const mockBun: TIngredient = {
  _id: 'bun1', name: 'Краторная булка', type: 'bun',
  proteins: 80, fat: 24, carbohydrates: 53, calories: 420, price: 1255,
  image: '', image_large: '', image_mobile: ''
};

const mockMain: TIngredient = {
  _id: 'main1', name: 'Биокотлета', type: 'main',
  proteins: 420, fat: 142, carbohydrates: 242, calories: 4242, price: 424,
  image: '', image_large: '', image_mobile: ''
};

const mockSauce: TIngredient = {
  _id: 'sauce1', name: 'Соус Spicy-X', type: 'sauce',
  proteins: 30, fat: 20, carbohydrates: 40, calories: 30, price: 90,
  image: '', image_large: '', image_mobile: ''
};

describe('Тестируем слайс constructor', () => {
  test('Должен возвращать начальное состояние при undefined', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('Должен добавлять булку в конструктор', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));
    expect(state.bun?._id).toBe(mockBun._id);
    expect(state.ingredients).toHaveLength(0);
  });

  test('Должен добавлять начинку в конструктор', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe(mockMain.name);
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('Должен добавлять соус в конструктор', () => {
    const state = constructorReducer(undefined, addIngredient(mockSauce));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].type).toBe('sauce');
  });

  test('Должен заменять булку при добавлении новой', () => {
    let state = constructorReducer(undefined, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient({ ...mockBun, _id: 'bun2', name: 'Флюоресцентная булка' }));
    expect(state.bun?._id).toBe('bun2');
  });

  test('Должен удалять ингредиент по id', () => {
    let state = constructorReducer(undefined, addIngredient(mockMain));
    const id = state.ingredients[0].id;
    state = constructorReducer(state, removeIngredient(id));
    expect(state.ingredients).toHaveLength(0);
  });

  test('Должен перемещать ингредиент в конструкторе', () => {
    const main1 = { ...mockMain, _id: 'm1', name: 'Ингредиент 1' };
    const main2 = { ...mockMain, _id: 'm2', name: 'Ингредиент 2' };
    const main3 = { ...mockMain, _id: 'm3', name: 'Ингредиент 3' };

    let state = constructorReducer(undefined, addIngredient(main1));
    state = constructorReducer(state, addIngredient(main2));
    state = constructorReducer(state, addIngredient(main3));

    state = constructorReducer(state, moveIngredient({ fromIndex: 0, toIndex: 2 }));
    expect(state.ingredients[0].name).toBe('Ингредиент 2');
    expect(state.ingredients[1].name).toBe('Ингредиент 3');
    expect(state.ingredients[2].name).toBe('Ингредиент 1');
  });

  test('Должен очищать конструктор', () => {
    let state = constructorReducer(undefined, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockMain));
    state = constructorReducer(state, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  test('Не должен изменять состояние при неизвестном действии', () => {
    const currentState = { bun: mockBun, ingredients: [{ ...mockMain, id: 'test-id' }] };
    const state = constructorReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(currentState);
  });
});