import { test as base, Page } from "@playwright/test"
import { CartPage } from "./cart-page"
import { CategoryPage } from "./category-page"
import { CheckoutPage } from "./checkout-page"
import { OrderPage } from "./order-page"
import { ProductPage } from "./product-page"

export const fixtures = base.extend<{
  cartPage: CartPage
  categoryPage: CategoryPage
  checkoutPage: CheckoutPage
  orderPage: OrderPage
  productPage: ProductPage
}>({
  page: async ({ page }, use) => {
    await page.goto("/")
    use(page)
  },
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
})

export const authFixtures = base.extend<{ page: Page }>({
  page: ({ page }, use) => {
    // TODO
  },
})
