import { test, expect, Page } from '@playwright/test';
import path from 'path';

async function setupMocks(page: Page) {
  await page.routeFromHAR(path.join(__dirname, 'hars/ingredients.har'), {
    url: '**/api/ingredients',
    update: false
  });
  await page.routeFromHAR(path.join(__dirname, 'hars/user.har'), {
    url: '**/api/auth/user',
    update: false
  });
  await page.routeFromHAR(path.join(__dirname, 'hars/order.har'), {
    url: '**/api/orders',
    update: false
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
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
}

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await setAuthTokens(page);
    await page.goto('/');
    await page.waitForSelector('[data-cy="constructor"]', { timeout: 10000 });
  });

  test('Добавление булки в конструктор', async ({ page }) => {
    const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
    await expect(bunCard).toBeVisible();
    await bunCard.locator('button').click();

    const constructorBun = page.locator('[data-cy="orderBunTop"]');
    await expect(constructorBun).toContainText('Краторная булка');
  });

  test('Добавление начинки в конструктор', async ({ page }) => {
    const mainCard = page.locator('[data-cy="643d69a5c3f7b9001cfa0941"]');
    await mainCard.locator('button').click();

    const constructorMain = page.locator('[data-cy="orderMain"]');
    await expect(constructorMain).toContainText('Биокотлета');
  });

  test('Добавление соуса в конструктор', async ({ page }) => {
    const sauceCard = page.locator('[data-cy="643d69a5c3f7b9001cfa0942"]');
    await sauceCard.locator('button').click();

    const constructorMain = page.locator('[data-cy="orderMain"]');
    await expect(constructorMain).toContainText('Соус Spicy-X');
  });

  test('Открытие модального окна ингредиента', async ({ page }) => {
    const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
    await bunCard.click();

    const modal = page.locator('[data-cy="modal"]');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=Краторная булка N-200i')).toBeVisible();
    await expect(modal.locator('text=80')).toBeVisible();
    await expect(modal.locator('text=420')).toBeVisible();
  });

  test('Закрытие модального окна по крестику', async ({ page }) => {
    const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
    await bunCard.click();

    const modal = page.locator('[data-cy="modal"]');
    await expect(modal).toBeVisible();

    const closeButton = page.locator('[data-cy="modalClose"]');
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  });

  test('Закрытие модального окна по оверлею', async ({ page }) => {
    const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
    await bunCard.click();

    const modal = page.locator('[data-cy="modal"]');
    await expect(modal).toBeVisible();

    const overlay = page.locator('[data-cy="modalOverlay"]');
    await overlay.click();
    await expect(modal).not.toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
    const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
    await bunCard.locator('button').click();

    const mainCard = page.locator('[data-cy="643d69a5c3f7b9001cfa0941"]');
    await mainCard.locator('button').click();

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    const orderModal = page.locator('[data-cy="modal"]');
    await expect(orderModal).toBeVisible();

    const orderNumber = page.locator('[data-cy="number"]');
    await expect(orderNumber).toHaveText('12345');

    const constructorBunTop = page.locator('[data-cy="orderBunTop"]');
    await expect(constructorBunTop).toContainText('Выберите булки');

    const constructorBunBottom = page.locator('[data-cy="orderBunBottom"]');
    await expect(constructorBunBottom).toContainText('Выберите булки');

    const constructorMain = page.locator('[data-cy="orderMain"]');
    await expect(constructorMain).toContainText('Выберите начинку');

    const closeButton = page.locator('[data-cy="modalClose"]');
    await closeButton.click();
    await expect(orderModal).not.toBeVisible();
  });
});