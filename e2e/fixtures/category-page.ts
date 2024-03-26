import { Locator, Page } from "@playwright/test"
import { BasePage } from "./base/base-page"

export class CategoryPage extends BasePage {
  container: Locator
  sortByContainer: Locator

  pagination: Locator
  productsListLoader: Locator
  productsList: Locator
  productWrapper: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.getByTestId("category-container")
    this.sortByContainer = page.getByTestId("sort-by-container")
    this.productsListLoader = this.container.getByTestId("products-list-loader")
    this.productsList = this.container.getByTestId("products-list")
    this.productWrapper = this.productsList.getByTestId("product-wrapper")
    this.pagination = this.container.getByTestId("product-pagination")
  }

  async getProduct(name: string) {
    const productTitle = await this.container
      .getByTestId("product-title")
      .filter({
        hasText: name,
      })
    const product = this.productWrapper.filter({ has: productTitle })
    return {
      product,
      title: product.getByTestId("product-title"),
      price: product.getByTestId("price"),
      originalPrice: product.getByTestId("original-price"),
    }
  }

  async sortBy(sortString: string) {
    const link = this.sortByContainer.getByTestId("sort-by-link").filter({
      hasText: sortString,
    })
    await link.click()
    // wait for page change
    await this.page.waitForFunction((linkElement) => {
      if (!linkElement) {
        return true
      }
      return linkElement.dataset.active === "true"
    }, await link.elementHandle())
  }
}
