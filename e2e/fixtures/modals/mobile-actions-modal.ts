import { Page, Locator } from "@playwright/test"
import { BaseModal } from "../base/base-modal"

export class MobileActionsModal extends BaseModal {
  optionButton: Locator

  constructor(page: Page) {
    super(page, page.getByTestId("mobile-actions-modal"))
    this.optionButton = this.container.getByTestId("option-button")
  }

  getOption(option: string) {
    return this.optionButton.filter({
      hasText: option,
    })
  }

  async selectOption(option: string) {
    const optionButton = this.getOption(option)
    await optionButton.click()
  }
}
