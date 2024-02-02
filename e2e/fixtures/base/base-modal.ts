import { Page, Locator } from "@playwright/test"

export class BaseModal {
  page: Page
  container: Locator
  closeButton: Locator

  constructor(page: Page, container: Locator) {
    this.page = page
    this.container = container
    this.closeButton = this.container.getByTestId("close-modal-button")
  }

  async close() {
    const button = this.container.getByTestId("close-modal-button")
    await button.click()
  }

  async isOpen() {
    return await this.container.isVisible()
  }
}
