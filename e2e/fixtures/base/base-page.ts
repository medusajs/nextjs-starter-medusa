import { CartDropdown } from "./cart-dropdown"
import { NavMenu } from "./nav-menu"
import { Page, Locator } from "@playwright/test"

export class BasePage {
  page: Page
  navMenu: NavMenu
  cartDropdown: CartDropdown
  accountLink: Locator
  searchLink: Locator
  storeLink: Locator
  categoriesList: Locator

  constructor(page: Page) {
    this.page = page
    this.navMenu = new NavMenu(page)
    this.cartDropdown = new CartDropdown(page)
    this.accountLink = page.getByTestId("nav-account-link")
    this.storeLink = page.getByTestId("nav-store-link")
    this.searchLink = page.getByTestId("nav-search-link")
    this.categoriesList = page.getByTestId("footer-categories")
  }

  async clickCategoryLink(category: string) {
    const link = this.categoriesList.getByTestId("category-link")
    await link.click()
  }
}
