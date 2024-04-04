import { Locator, Page } from "@playwright/test"

export class NavMenu {
  page: Page
  navMenuButton: Locator
  navMenu: Locator
  navAccountLink: Locator
  homeLink: Locator
  storeLink: Locator
  searchLink: Locator
  accountLink: Locator
  cartLink: Locator
  closeButton: Locator
  shippingToLink: Locator
  shippingToMenu: Locator

  constructor(page: Page) {
    this.page = page
    this.navMenuButton = page.getByTestId("nav-menu-button")
    this.navMenu = page.getByTestId("nav-menu-popup")
    this.navAccountLink = page.getByTestId("nav-account-link")
    this.homeLink = this.navMenu.getByTestId("home-link")
    this.storeLink = this.navMenu.getByTestId("store-link")
    this.searchLink = this.navMenu.getByTestId("search-link")
    this.accountLink = this.navMenu.getByTestId("account-link")
    this.cartLink = this.navMenu.getByTestId("nav-cart-link")
    this.closeButton = this.navMenu.getByTestId("close-menu-button")
    this.shippingToLink = this.navMenu.getByTestId("shipping-to-button")
    this.shippingToMenu = this.navMenu.getByTestId("shipping-to-choices")
  }

  async selectShippingCountry(country: string) {
    if (!(await this.navMenu.isVisible())) {
      throw {
        error:
          `You cannot call ` +
          `NavMenu.selectShippingCountry("${country}") without having the ` +
          `navMenu visible first!`,
      }
    }
    const countryLink = this.navMenu.getByTestId(
      `select-${country.toLowerCase()}-choice`
    )
    await this.shippingToLink.hover()
    await this.shippingToMenu.waitFor({
      state: "visible",
    })
    await countryLink.click()
  }

  async open() {
    await this.navMenuButton.click()
    await this.navMenu.waitFor({ state: "visible" })
  }
}
