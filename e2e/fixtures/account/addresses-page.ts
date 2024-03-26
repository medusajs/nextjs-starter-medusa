import { Locator, Page } from "@playwright/test"
import { AccountPage } from "./account-page"
import { AddAddressModal } from "./modals/add-address-modal"

export class AddressesPage extends AccountPage {
  addAddressModal: AddAddressModal
  constructor(page: Page) {
    super(page)
    this.addAddressModal = new AddAddressModal(page)
  }

  getAddressContainer(text: string) {
    const container = this.page
      .getByTestId("address-container")
      .filter({ hasText: text })
    return {
      container,
      editButton: container.getByTestId("address-edit-button"),
      deleteButton: container.getByTestId("address-delete-button"),
      name: container.getByTestId("address-name"),
      company: container.getByTestId("address-company"),
      address: container.getByTestId("address-address"),
      postalCity: container.getByTestId("address-postal-city"),
      provinceCountry: container.getByTestId("address-province-country"),
    }
  }
}
