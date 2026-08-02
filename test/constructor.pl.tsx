import { test, expect, Page } from '@playwright/test';

const mockIngredients = {
  success: true,
  data: [
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
    },
    {
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      __v: 0
    }
  ]
};

const mockUser = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Test User'
  }
};

const mockOrder = {
  success: true,
  name: 'Краторный био-марсианский бургер',
  order: {
    number: 12345
  }
};

async function setupMocks(page: Page) {
  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockIngredients)
    });
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser)
    });
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockOrder)
    });
  });
}

async function setAuthTokens(page: Page) {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'mock-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);
  await page.evaluate(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
}

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await setAuthTokens(page);
    await page.goto('/');
    await page.waitForSelector('text=Соберите бургер');
  });

  test('Добавление булки в конструктор', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка' });
    await expect(bunCard).toBeVisible();

    const addButton = bunCard.locator('button:has-text("Добавить")');
    await addButton.click();

    const constructor = page.locator('section').filter({ hasText: 'Краторная булка' }).first();
    await expect(constructor).toContainText('Краторная булка');
  });

  test('Добавление начинки в конструктор', async ({ page }) => {
    const mainCard = page.locator('li', { hasText: 'Биокотлета' });
    const addButton = mainCard.locator('button:has-text("Добавить")');
    await addButton.click();

    const constructor = page.locator('section').filter({ hasText: 'Биокотлета' }).first();
    await expect(constructor).toContainText('Биокотлета');
  });

  test('Добавление соуса в конструктор', async ({ page }) => {
    const sauceCard = page.locator('li', { hasText: 'Соус Spicy-X' });
    const addButton = sauceCard.locator('button:has-text("Добавить")');
    await addButton.click();

    const constructor = page.locator('section').filter({ hasText: 'Соус Spicy-X' }).first();
    await expect(constructor).toContainText('Соус Spicy-X');
  });

  test('Открытие модального окна ингредиента', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка' });
    await bunCard.click();

    const modal = page.locator('div').filter({ hasText: 'Детали ингредиента' }).first();
    await expect(modal).toBeVisible();
    await expect(page.locator('text=Краторная булка N-200i')).toBeVisible();
  });

  test('Закрытие модального окна по крестику', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка' });
    await bunCard.click();

    const closeButton = page.locator('button svg').first();
    await closeButton.click();

    const modal = page.locator('div').filter({ hasText: 'Детали ингредиента' }).first();
    await expect(modal).not.toBeVisible();
  });

  test('Закрытие модального окна по оверлею', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка' });
    await bunCard.click();

    await page.keyboard.press('Escape');

    const modal = page.locator('div').filter({ hasText: 'Детали ингредиента' }).first();
    await expect(modal).not.toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка' });
    await bunCard.locator('button:has-text("Добавить")').click();

    const mainCard = page.locator('li', { hasText: 'Биокотлета' });
    await mainCard.locator('button:has-text("Добавить")').click();

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    const orderModal = page.locator('div').filter({ hasText: '12345' }).first();
    await expect(orderModal).toBeVisible();
    await expect(page.locator('text=12345')).toBeVisible();

    const constructorBun = page.locator('text=Выберите булки');
    await expect(constructorBun).toBeVisible();

    const closeButton = page.locator('button svg').first();
    await closeButton.click();

    await expect(orderModal).not.toBeVisible();
  });
});