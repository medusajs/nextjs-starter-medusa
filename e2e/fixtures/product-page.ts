import { Locator, Page } from "@playwright/test"
import { BasePage } from "./base/base-page"
import { MobileActionsModal } from "./modals/mobile-actions-modal"

export class ProductPage extends BasePage {
  mobileActionsModal: MobileActionsModal

  container: Locator
  productTitle: Locator
  productDescription: Locator
  productOptions: Locator
  addProductButton: Locator
  mobileActionsContainer: Locator
  mobileTitle: Locator
  mobileActionsButton: Locator
  mobileAddToCartButton: Locator

  constructor(page: Page) {
    super(page)

    this.mobileActionsModal = new MobileActionsModal(page)

    this.container = page.getByTestId("product-container")
    this.productTitle = this.container.getByTestId("product-title")
    this.productDescription = this.container.getByTestId("product-description")
    this.productOptions = this.container.getByTestId("product-options")
    this.addProductButton = this.container.getByTestId("add-product-button")
    this.mobileActionsContainer = page.getByTestId("mobile-actions")
    this.mobileTitle = this.mobileActionsContainer.getByTestId("mobile-title")
    this.mobileAddToCartButton = this.mobileActionsContainer.getByTestId(
      "mobile-actions-button"
    )
    this.mobileActionsButton = this.mobileActionsContainer.getByTestId(
      "mobile-actions-select"
    )
  }

  async selectOption(option: string) {
    const optionButton = this.productOptions
      .getByTestId("option-button")
      .filter({ hasText: option })
    await optionButton.click()
  }
}
