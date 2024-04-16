import { Page, Locator } from "@playwright/test"
import { BaseModal } from "./base-modal"
import { NavMenu } from "./nav-menu"

export class SearchModal extends BaseModal {
  searchInput: Locator
  searchResults: Locator
  noSearchResultsContainer: Locator
  searchResult: Locator
  searchResultTitle: Locator

  constructor(page: Page) {
    super(page, page.getByTestId("search-modal-container"))
    this.searchInput = this.container.getByTestId("search-input")
    this.searchResults = this.container.getByTestId("search-results")
    this.noSearchResultsContainer = this.container.getByTestId(
      "no-search-results-container"
    )
    this.searchResult = this.container.getByTestId("search-result")
    this.searchResultTitle = this.container.getByTestId("search-result-title")
  }

  async open() {
    const menu = new NavMenu(this.page)
    await menu.open()
    await menu.searchLink.click()
    await this.container.waitFor({ state: "visible" })
  }

  async close() {
    const viewport = this.page.viewportSize()
    const y = viewport ? viewport.height / 2 : 100
    await this.page.mouse.click(1, y, { clickCount: 2, delay: 100 })
    await this.container.waitFor({ state: "hidden" })
  }
}
