import { test as base, Page } from "@playwright/test"
import { resetDatabase } from "../data/reset"
import { CartPage } from "./cart-page"
import { CategoryPage } from "./category-page"
import { CheckoutPage } from "./checkout-page"
import { OrderPage } from "./order-page"
import { ProductPage } from "./product-page"
import { StorePage } from "./store-page"

export const fixtures = base.extend<{
  resetDatabaseFixture: void
  cartPage: CartPage
  categoryPage: CategoryPage
  checkoutPage: CheckoutPage
  orderPage: OrderPage
  productPage: ProductPage
  storePage: StorePage
}>({
  page: async ({ page }, use) => {
    await page.goto("/")
    use(page)
  },
  resetDatabaseFixture: [
    async function ({}, use) {
      await resetDatabase()
      await use()
    },
    { auto: true, timeout: 10000 },
  ],
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page)
    await use(cartPage)
  },
  categoryPage: async ({ page }, use) => {
    const categoryPage = new CategoryPage(page)
    await use(categoryPage)
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page)
    await use(checkoutPage)
  },
  orderPage: async ({ page }, use) => {
    const orderPage = new OrderPage(page)
    await use(orderPage)
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page)
    await use(productPage)
  },
  storePage: async ({ page }, use) => {
    const storePage = new StorePage(page)
    await use(storePage)
  },
})
