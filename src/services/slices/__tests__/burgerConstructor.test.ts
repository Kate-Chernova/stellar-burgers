import { describe, test, expect } from '@jest/globals';
import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  burgerConstructorInitialState
} from '../burgerConstructor';
import { TIngredient } from '../../../utils/types';

const mockBun: TIngredient = {
  _id: 'bun1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockMain: TIngredient = {
  _id: 'main1',
  name: 'Биокотлета',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockSauce: TIngredient = {
  _id: 'sauce1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('Тестируем слайс burgerConstructor', () => {
  test('Должен возвращать начальное состояние при undefined', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(burgerConstructorInitialState);
  });

  test('Должен добавлять булку в конструктор', () => {
    const action = addIngredient(mockBun);
    const state = burgerConstructorReducer(burgerConstructorInitialState, action);

    expect(state.bun).not.toBeNull();
    expect(state.bun?._id).toBe(mockBun._id);
    expect(state.bun?.name).toBe(mockBun.name);
    expect(state.ingredients).toHaveLength(0);
  });

  test('Должен добавлять начинку в конструктор', () => {
    const action = addIngredient(mockMain);
    const state = burgerConstructorReducer(burgerConstructorInitialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe(mockMain.name);
    expect(state.ingredients[0].id).toBeDefined();
    expect(state.bun).toBeNull();
  });

  test('Должен добавлять соус в конструктор', () => {
    const action = addIngredient(mockSauce);
    const state = burgerConstructorReducer(burgerConstructorInitialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].type).toBe('sauce');
  });

  test('Должен заменять булку при добавлении новой', () => {
    let state = burgerConstructorReducer(burgerConstructorInitialState, addIngredient(mockBun));
    const newBun = { ...mockBun, _id: 'bun2', name: 'Флюоресцентная булка' };
    state = burgerConstructorReducer(state, addIngredient(newBun));

    expect(state.bun?._id).toBe('bun2');
    expect(state.ingredients).toHaveLength(0);
  });

  test('Должен удалять ингредиент по id', () => {
    let state = burgerConstructorReducer(burgerConstructorInitialState, addIngredient(mockMain));
    const id = state.ingredients[0].id;
    state = burgerConstructorReducer(state, removeIngredient(id));

    expect(state.ingredients).toHaveLength(0);
  });

  test('Должен перемещать ингредиент в конструкторе', () => {
    const main1 = { ...mockMain, _id: 'm1', name: 'Ингредиент 1' };
    const main2 = { ...mockMain, _id: 'm2', name: 'Ингредиент 2' };
    const main3 = { ...mockMain, _id: 'm3', name: 'Ингредиент 3' };

    let state = burgerConstructorReducer(burgerConstructorInitialState, addIngredient(main1));
    state = burgerConstructorReducer(state, addIngredient(main2));
    state = burgerConstructorReducer(state, addIngredient(main3));

    expect(state.ingredients[0].name).toBe('Ингредиент 1');
    expect(state.ingredients[1].name).toBe('Ингредиент 2');
    expect(state.ingredients[2].name).toBe('Ингредиент 3');

    state = burgerConstructorReducer(state, moveIngredient({ fromIndex: 0, toIndex: 2 }));

    expect(state.ingredients[0].name).toBe('Ингредиент 2');
    expect(state.ingredients[1].name).toBe('Ингредиент 3');
    expect(state.ingredients[2].name).toBe('Ингредиент 1');
  });

  test('Должен очищать конструктор', () => {
    let state = burgerConstructorReducer(burgerConstructorInitialState, addIngredient(mockBun));
    state = burgerConstructorReducer(state, addIngredient(mockMain));
    state = burgerConstructorReducer(state, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  test('Не должен изменять состояние при неизвестном действии', () => {
    const currentState = {
      bun: mockBun,
      ingredients: [{ ...mockMain, id: 'test-id' }]
    };
    const state = burgerConstructorReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(currentState);
  });
});