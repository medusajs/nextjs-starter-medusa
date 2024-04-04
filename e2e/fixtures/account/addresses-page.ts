import { Locator, Page } from "@playwright/test"
import { AccountPage } from "./account-page"
import { AddressModal } from "./modals/address-modal"

export class AddressesPage extends AccountPage {
  addAddressModal: AddressModal
  editAddressModal: AddressModal
  addressContainer: Locator
  addressesWrapper: Locator
  newAddressButton: Locator

  constructor(page: Page) {
    super(page)
    this.addAddressModal = new AddressModal(page, "add")
    this.editAddressModal = new AddressModal(page, "edit")
    this.addressContainer = this.container.getByTestId("address-container")
    this.addressesWrapper = page.getByTestId("addresses-page-wrapper")
    this.newAddressButton = this.container.getByTestId("add-address-button")
  }

  getAddressContainer(text: string) {
    const container = this.page
      .getByTestId("address-container")
      .filter({ hasText: text })
    return {
      container,
      editButton: container.getByTestId('address-edit-button'),
      deleteButton: container.getByTestId("address-delete-button"),
      name: container.getByTestId("address-name"),
      company: container.getByTestId("address-company"),
      address: container.getByTestId("address-address"),
      postalCity: container.getByTestId("address-postal-city"),
      provinceCountry: container.getByTestId("address-province-country"),
    }
  }

  async goto() {
    await super.goto()
    await this.addressesLink.click()
    await this.addressesWrapper.waitFor({ state: "visible" })
  }
}
