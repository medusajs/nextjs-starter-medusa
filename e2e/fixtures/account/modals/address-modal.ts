import { Page, Locator } from "@playwright/test"
import { BaseModal } from "../../base/base-modal"

export class AddressModal extends BaseModal {
  saveButton: Locator
  cancelButton: Locator

  firstNameInput: Locator
  lastNameInput: Locator
  companyInput: Locator
  address1Input: Locator
  address2Input: Locator
  postalCodeInput: Locator
  cityInput: Locator
  stateInput: Locator
  countrySelect: Locator
  phoneInput: Locator

  constructor(page: Page, modalType: "add" | "edit") {
    if (modalType === "add") {
      super(page, page.getByTestId("add-address-modal"))
    } else {
      super(page, page.getByTestId("edit-address-modal"))
    }

    this.saveButton = this.container.getByTestId("save-button")
    this.cancelButton = this.container.getByTestId("cancel-button")

    this.firstNameInput = this.container.getByTestId("first-name-input")
    this.lastNameInput = this.container.getByTestId("last-name-input")
    this.companyInput = this.container.getByTestId("company-input")
    this.address1Input = this.container.getByTestId("address-1-input")
    this.address2Input = this.container.getByTestId("address-2-input")
    this.postalCodeInput = this.container.getByTestId("postal-code-input")
    this.cityInput = this.container.getByTestId("city-input")
    this.stateInput = this.container.getByTestId("state-input")
    this.countrySelect = this.container.getByTestId("country-select")
    this.phoneInput = this.container.getByTestId("phone-input")
  }
}
