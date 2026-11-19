import { expect, test } from '@playwright/test';

test('a guest reaches signup from the cart', async ({ page }) => {
  await page.addLocatorHandler(page.getByRole('button', { name: 'Consent', exact: true }), async button => {
    await button.click();
  });
  await page.goto('https://www.automationexercise.com/products');

  await test.step('Add Blue Top', async () => {
    await expect(page.getByPlaceholder('Search Product')).toBeVisible();
    await page.locator('div.productinfo a[data-product-id="1"]').click();
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
  });

  await test.step('Verify the cart', async () => {
    await page.getByRole('link', { name: 'Cart' }).click();
    await expect(page.getByRole('link', { name: 'Blue Top', exact: true })).toBeVisible();
  });

  await test.step('Reach signup from checkout', async () => {
    await page.getByText('Proceed To Checkout').click();
    await page.getByRole('link', { name: 'Register / Login' }).click();
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  });
});
