# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: constructor.pl.tsx >> Конструктор бургера >> Добавление соуса в конструктор
- Location: test\constructor.pl.tsx:58:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-cy="constructor"]') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]: "Ошибка: Failed to fetch"
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | import path from 'path';
  3   | 
  4   | async function setupMocks(page: Page) {
  5   |   await page.routeFromHAR(path.join(__dirname, 'hars/ingredients.har'), {
  6   |     url: '**/api/ingredients',
  7   |     update: false
  8   |   });
  9   |   await page.routeFromHAR(path.join(__dirname, 'hars/user.har'), {
  10  |     url: '**/api/auth/user',
  11  |     update: false
  12  |   });
  13  |   await page.routeFromHAR(path.join(__dirname, 'hars/order.har'), {
  14  |     url: '**/api/orders',
  15  |     update: false
  16  |   });
  17  | }
  18  | 
  19  | async function setAuthTokens(page: Page) {
  20  |   await page.context().addCookies([
  21  |     {
  22  |       name: 'accessToken',
  23  |       value: 'mock-access-token',
  24  |       domain: 'localhost',
  25  |       path: '/'
  26  |     }
  27  |   ]);
  28  |   await page.addInitScript(() => {
  29  |     localStorage.setItem('refreshToken', 'mock-refresh-token');
  30  |   });
  31  | }
  32  | 
  33  | test.describe('Конструктор бургера', () => {
  34  |   test.beforeEach(async ({ page }) => {
  35  |     await setupMocks(page);
  36  |     await setAuthTokens(page);
  37  |     await page.goto('/');
> 38  |     await page.waitForSelector('[data-cy="constructor"]', { timeout: 10000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  39  |   });
  40  | 
  41  |   test('Добавление булки в конструктор', async ({ page }) => {
  42  |     const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
  43  |     await expect(bunCard).toBeVisible();
  44  |     await bunCard.locator('button').click();
  45  | 
  46  |     const constructorBun = page.locator('[data-cy="orderBunTop"]');
  47  |     await expect(constructorBun).toContainText('Краторная булка');
  48  |   });
  49  | 
  50  |   test('Добавление начинки в конструктор', async ({ page }) => {
  51  |     const mainCard = page.locator('[data-cy="643d69a5c3f7b9001cfa0941"]');
  52  |     await mainCard.locator('button').click();
  53  | 
  54  |     const constructorMain = page.locator('[data-cy="orderMain"]');
  55  |     await expect(constructorMain).toContainText('Биокотлета');
  56  |   });
  57  | 
  58  |   test('Добавление соуса в конструктор', async ({ page }) => {
  59  |     const sauceCard = page.locator('[data-cy="643d69a5c3f7b9001cfa0942"]');
  60  |     await sauceCard.locator('button').click();
  61  | 
  62  |     const constructorMain = page.locator('[data-cy="orderMain"]');
  63  |     await expect(constructorMain).toContainText('Соус Spicy-X');
  64  |   });
  65  | 
  66  |   test('Открытие модального окна ингредиента', async ({ page }) => {
  67  |     const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
  68  |     await bunCard.click();
  69  | 
  70  |     const modal = page.locator('[data-cy="modal"]');
  71  |     await expect(modal).toBeVisible();
  72  |     await expect(modal.locator('text=Краторная булка N-200i')).toBeVisible();
  73  |     await expect(modal.locator('text=80')).toBeVisible();
  74  |     await expect(modal.locator('text=420')).toBeVisible();
  75  |   });
  76  | 
  77  |   test('Закрытие модального окна по крестику', async ({ page }) => {
  78  |     const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
  79  |     await bunCard.click();
  80  | 
  81  |     const modal = page.locator('[data-cy="modal"]');
  82  |     await expect(modal).toBeVisible();
  83  | 
  84  |     const closeButton = page.locator('[data-cy="modalClose"]');
  85  |     await closeButton.click();
  86  |     await expect(modal).not.toBeVisible();
  87  |   });
  88  | 
  89  |   test('Закрытие модального окна по оверлею', async ({ page }) => {
  90  |     const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
  91  |     await bunCard.click();
  92  | 
  93  |     const modal = page.locator('[data-cy="modal"]');
  94  |     await expect(modal).toBeVisible();
  95  | 
  96  |     const overlay = page.locator('[data-cy="modalOverlay"]');
  97  |     await overlay.click();
  98  |     await expect(modal).not.toBeVisible();
  99  |   });
  100 | 
  101 |   test('Создание заказа', async ({ page }) => {
  102 |     const bunCard = page.locator('[data-cy="643d69a5c3f7b9001cfa093c"]');
  103 |     await bunCard.locator('button').click();
  104 | 
  105 |     const mainCard = page.locator('[data-cy="643d69a5c3f7b9001cfa0941"]');
  106 |     await mainCard.locator('button').click();
  107 | 
  108 |     const orderButton = page.locator('button:has-text("Оформить заказ")');
  109 |     await orderButton.click();
  110 | 
  111 |     const orderModal = page.locator('[data-cy="modal"]');
  112 |     await expect(orderModal).toBeVisible();
  113 | 
  114 |     const orderNumber = page.locator('[data-cy="number"]');
  115 |     await expect(orderNumber).toHaveText('12345');
  116 | 
  117 |     const constructorBunTop = page.locator('[data-cy="orderBunTop"]');
  118 |     await expect(constructorBunTop).toContainText('Выберите булки');
  119 | 
  120 |     const constructorBunBottom = page.locator('[data-cy="orderBunBottom"]');
  121 |     await expect(constructorBunBottom).toContainText('Выберите булки');
  122 | 
  123 |     const constructorMain = page.locator('[data-cy="orderMain"]');
  124 |     await expect(constructorMain).toContainText('Выберите начинку');
  125 | 
  126 |     const closeButton = page.locator('[data-cy="modalClose"]');
  127 |     await closeButton.click();
  128 |     await expect(orderModal).not.toBeVisible();
  129 |   });
  130 | });
```