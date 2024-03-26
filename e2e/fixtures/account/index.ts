import { test as base } from "@playwright/test"
import { AddressesPage } from "./addresses-page"
import { LoginPage } from "./login-page"
import { OrderPage } from "./order-page"
import { OrdersPage } from "./orders-page"
import { OverviewPage } from "./overview-page"
import { ProfilePage } from "./profile-page"
import { RegisterPage } from "./register-page"

export const accountFixtures = base.extend<{
  accountAddressesPage: AddressesPage
  accountOrderPage: OrderPage
  accountOrdersPage: OrdersPage
  accountOverviewPage: OverviewPage
  accountProfilePage: ProfilePage
  loginPage: LoginPage
  registerPage: RegisterPage
}>({
  accountAddressesPage: async ({ page }, use) => {
    const addressesPage = new AddressesPage(page)
    await use(addressesPage)
  },
  accountOrderPage: async ({ page }, use) => {
    const orderPage = new OrderPage(page)
    await use(orderPage)
  },
  accountOrdersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page)
    await use(ordersPage)
  },
  accountOverviewPage: async ({ page }, use) => {
    const overviewPage = new OverviewPage(page)
    await use(overviewPage)
  },
  accountProfilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page)
    await use(profilePage)
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page)
    await use(registerPage)
  },
})
