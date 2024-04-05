import { AddressesPage } from "../../fixtures/account/addresses-page"
import { test, expect } from "../../index"
import { getSelectedOptionText } from "../../utils/locators"

test.describe("Addresses tests", () => {
  test("Creating a new address is displayed during checkout", async ({
    accountAddressesPage: addressesPage,
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to the new address modal", async () => {
      await addressesPage.goto()
      await addressesPage.newAddressButton.click()
      await addressesPage.addAddressModal.container.waitFor({ state: "visible" })
    })

    await test.step("Inputs and saves the new address", async () => {
      const modal = addressesPage.addAddressModal
      await modal.firstNameInput.fill("First")
      await modal.lastNameInput.fill("Last")
      await modal.companyInput.fill("FirstCorp")
      await modal.address1Input.fill("123 Fake Street")
      await modal.address2Input.fill("Apt 1")
      await modal.postalCodeInput.fill("11111")
      await modal.cityInput.fill("City")
      await modal.stateInput.fill("Colorado")
      await modal.countrySelect.selectOption({
        label: "United States",
      })
      await modal.phoneInput.fill("1112223333")
      await modal.saveButton.click()
      await modal.container.waitFor({ state: "hidden" })
    })

    await test.step("Navigate to a product page and add a product to the cart", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.highlight()
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
      await productPage.selectOption("M")
      await productPage.addProductButton.click()
      await productPage.cartDropdown.navCartLink.click()
      await productPage.cartDropdown.goToCartButton.click()
      await cartPage.container.waitFor({ state: "visible" })
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
    })

    await test.step("Verify the address is correct in the checkout process", async () => {
      await checkoutPage.selectSavedAddress("123 Fake Street")
      await expect(checkoutPage.shippingFirstNameInput).toHaveValue("First")
      await expect(checkoutPage.shippingLastNameInput).toHaveValue("Last")
      await expect(checkoutPage.shippingCompanyInput).toHaveValue("FirstCorp")
      await expect(checkoutPage.shippingAddressInput).toHaveValue(
        "123 Fake Street"
      )
      await expect(checkoutPage.shippingPostalCodeInput).toHaveValue("11111")
      await expect(checkoutPage.shippingCityInput).toHaveValue("City")
      await expect(checkoutPage.shippingProvinceInput).toHaveValue("Colorado")
      expect(
        await getSelectedOptionText(
          checkoutPage.page,
          checkoutPage.shippingCountrySelect
        )
      ).toContain("United States")
    })
  })

  test("Performing all the CRUD actions for an address", async ({
    accountAddressesPage: addressesPage,
  }) => {
    await test.step("Navigate to the new address modal", async () => {
      await addressesPage.goto()
      await addressesPage.newAddressButton.click()
      await addressesPage.addAddressModal.container.waitFor({ state: "visible" })
    })

    await test.step("Input and save a new address", async () => {
      const { addAddressModal } = addressesPage
      await addAddressModal.firstNameInput.fill("First")
      await addAddressModal.lastNameInput.fill("Last")
      await addAddressModal.companyInput.fill("MyCorp")
      await addAddressModal.address1Input.fill("123 Fake Street")
      await addAddressModal.address2Input.fill("Apt 1")
      await addAddressModal.postalCodeInput.fill("80010")
      await addAddressModal.cityInput.fill("Denver")
      await addAddressModal.stateInput.fill("Colorado")
      await addAddressModal.countrySelect.selectOption({ label: "United States" })
      await addAddressModal.phoneInput.fill("3031112222")
      await addAddressModal.saveButton.click()
      await addAddressModal.container.waitFor({ state: "hidden" })
    })

    let addressContainer: ReturnType<AddressesPage["getAddressContainer"]>
    await test.step("Make sure the address container was appended to the page", async () => {
      addressContainer = addressesPage.getAddressContainer("First Last")
      await expect(addressContainer.name).toHaveText("First Last")
      await expect(addressContainer.company).toHaveText("MyCorp")
      await expect(addressContainer.address).toContainText("123 Fake Street")
      await expect(addressContainer.address).toContainText("Apt 1")
      await expect(addressContainer.postalCity).toContainText("80010, Denver")
      await expect(addressContainer.provinceCountry).toContainText("Colorado, US")
    })

    await test.step("Refresh the page and assert address was saved", async () => {
      await addressesPage.page.reload()
      addressContainer = addressesPage.getAddressContainer("First Last")
      await expect(addressContainer.name).toHaveText("First Last")
      await expect(addressContainer.company).toHaveText("MyCorp")
      await expect(addressContainer.address).toContainText("123 Fake Street")
      await expect(addressContainer.address).toContainText("Apt 1")
      await expect(addressContainer.postalCity).toContainText("80010, Denver")
      await expect(addressContainer.provinceCountry).toContainText("Colorado, US")
    })

    await test.step("Edit the address", async () => {
      await addressContainer.editButton.click()
      await addressesPage.editAddressModal.container.waitFor({ state: "visible" })
      await addressesPage.editAddressModal.firstNameInput.fill("Second")
      await addressesPage.editAddressModal.lastNameInput.fill("Final")
      await addressesPage.editAddressModal.companyInput.fill("MeCorp")
      await addressesPage.editAddressModal.address1Input.fill("123 Spark Street")
      await addressesPage.editAddressModal.address2Input.fill("Unit 3")
      await addressesPage.editAddressModal.postalCodeInput.fill("80011")
      await addressesPage.editAddressModal.cityInput.fill("Broomfield")
      await addressesPage.editAddressModal.stateInput.fill("CO")
      await addressesPage.editAddressModal.countrySelect.selectOption({
        label: "Canada",
      })
      await addressesPage.editAddressModal.phoneInput.fill("3032223333")
      await addressesPage.editAddressModal.saveButton.click()
      await addressesPage.editAddressModal.container.waitFor({ state: "hidden" })
    })

    await test.step("Make sure edits were saved on the addressContainer", async () => {
      addressContainer = addressesPage.getAddressContainer("Second Final")
      await expect(addressContainer.name).toContainText("Second Final")
      await expect(addressContainer.company).toContainText("MeCorp")
      await expect(addressContainer.address).toContainText("123 Spark Street, Unit 3")
      await expect(addressContainer.postalCity).toContainText("80011, Broomfield")
      await expect(addressContainer.provinceCountry).toContainText("CO, CA")
    })

    await test.step("Refresh the page and assert edits were saved", async () => {
      await addressesPage.page.reload()
      await expect(addressContainer.name).toContainText("Second Final")
      await expect(addressContainer.company).toContainText("MeCorp")
      await expect(addressContainer.address).toContainText("123 Spark Street, Unit 3")
      await expect(addressContainer.postalCity).toContainText("80011, Broomfield")
      await expect(addressContainer.provinceCountry).toContainText("CO, CA")
    })

    await test.step("Delete the address", async () => {
      await addressContainer.deleteButton.click()
      await addressContainer.container.waitFor({ state: "hidden" })
      await addressesPage.page.reload()
      await expect(addressContainer.container).not.toBeVisible()
    })

    await test.step("Ensure address remains deleted after refresh", async () => {
      await addressesPage.page.reload()
      await expect(addressContainer.container).not.toBeVisible()
    })
  })

  test.skip("Attempt to create duplicate addresses on the address page", async ({
    accountAddressesPage: addressesPage
  }) => {
    await test.step("navigate to the new address modal", async () => {
      await addressesPage.goto()
      await addressesPage.newAddressButton.click()
      await addressesPage.addAddressModal.container.waitFor({ state: "visible" })
    })

    await test.step("Input and save a new address", async () => {
      await addressesPage.addAddressModal.firstNameInput.fill("First")
      await addressesPage.addAddressModal.lastNameInput.fill("Last")
      await addressesPage.addAddressModal.companyInput.fill("MyCorp")
      await addressesPage.addAddressModal.address1Input.fill("123 Fake Street")
      await addressesPage.addAddressModal.address2Input.fill("Apt 1")
      await addressesPage.addAddressModal.postalCodeInput.fill("80010")
      await addressesPage.addAddressModal.cityInput.fill("Denver")
      await addressesPage.addAddressModal.stateInput.fill("Colorado")
      await addressesPage.addAddressModal.countrySelect.selectOption({
        label: "United States",
      })
      await addressesPage.addAddressModal.phoneInput.fill("3031112222")
      await addressesPage.addAddressModal.saveButton.click()
      await addressesPage.addAddressModal.container.waitFor({ state: "hidden" })
    })

    await test.step("Attempt to create the same address", async () => {
      await addressesPage.newAddressButton.click()
      await addressesPage.addAddressModal.container.waitFor({ state: "visible" })
      await addressesPage.addAddressModal.firstNameInput.fill("First")
      await addressesPage.addAddressModal.lastNameInput.fill("Last")
      await addressesPage.addAddressModal.companyInput.fill("MyCorp")
      await addressesPage.addAddressModal.address1Input.fill("123 Fake Street")
      await addressesPage.addAddressModal.address2Input.fill("Apt 1")
      await addressesPage.addAddressModal.postalCodeInput.fill("80010")
      await addressesPage.addAddressModal.cityInput.fill("Denver")
      await addressesPage.addAddressModal.stateInput.fill("Colorado")
      await addressesPage.addAddressModal.countrySelect.selectOption({
        label: "United States",
      })
      await addressesPage.addAddressModal.phoneInput.fill("3031112222")
      await addressesPage.addAddressModal.saveButton.click()
    })

    await test.step("Validate error state", async () => {

    })
  })

  test("Creating multiple tests works correctly", async ({
    accountAddressesPage: addressesPage,
  }) => {
    test.slow()
    await test.step("Navigate to the new address modal", async () => {
      await addressesPage.goto()
    })

    let addressContainer: ReturnType<AddressesPage["getAddressContainer"]>
    for (let i = 0; i < 10; i++) {
      await test.step("Open up the new address modal", async () => {
        await addressesPage.newAddressButton.click()
        await addressesPage.addAddressModal.container.waitFor({ state: "visible" })
      })
      await test.step("Input and save a new address", async () => {
        const { addAddressModal } = addressesPage
        await addAddressModal.firstNameInput.fill(`First-${i}`)
        await addAddressModal.lastNameInput.fill(`Last-${i}`)
        await addAddressModal.companyInput.fill(`MyCorp-${i}`)
        await addAddressModal.address1Input.fill(`123 Fake Street-${i}`)
        await addAddressModal.address2Input.fill("Apt 1")
        await addAddressModal.postalCodeInput.fill("80010")
        await addAddressModal.cityInput.fill("Denver")
        await addAddressModal.stateInput.fill("Colorado")
        await addAddressModal.countrySelect.selectOption({ label: "United States" })
        await addAddressModal.phoneInput.fill("3031112222")
        await addAddressModal.saveButton.click()
        await addAddressModal.container.waitFor({ state: "hidden" })
      })
      await test.step("Make sure the address container was appended to the page", async () => {
        addressContainer = addressesPage.getAddressContainer(`First-${i} Last-${i}`)
        await expect(addressContainer.name).toHaveText(`First-${i} Last-${i}`)
        await expect(addressContainer.company).toHaveText(`MyCorp-${i}`)
        await expect(addressContainer.address).toContainText(`123 Fake Street-${i}`)
        await expect(addressContainer.address).toContainText("Apt 1")
        await expect(addressContainer.postalCity).toContainText("80010, Denver")
        await expect(addressContainer.provinceCountry).toContainText("Colorado, US")
      })
    }
  })
})