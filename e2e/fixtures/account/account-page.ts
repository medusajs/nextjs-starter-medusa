import { Locator, Page } from "@playwright/test"
import { BasePage } from "../base/base-page"

export class AccountPage extends BasePage {
  container: Locator
  accountNav: Locator
  mobileAccountNav: Locator
  overviewLink: Locator
  profileLink: Locator
  addressesLink: Locator
  ordersLink: Locator
  logoutLink: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.getByTestId("account-page")
    this.accountNav = this.container.getByTestId("account-nav")
    this.mobileAccountNav = this.container.getByTestId("mobile-account-nav")
    this.overviewLink = this.container.getByTestId("overview-link")
    this.profileLink = this.container.getByTestId("profile-link")
    this.addressesLink = this.container.getByTestId("addresses-link")
    this.ordersLink = this.container.getByTestId("orders-link")
    this.logoutLink = this.container.getByTestId("logout-button")
  }
}
