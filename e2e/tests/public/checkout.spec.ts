import { test, expect } from "../../index"
import { compareFloats, getFloatValue } from "../../utils"

test.describe("Checkout flow tests", async () => {
  test("Default checkout flow", async ({
    cartPage,
    checkoutPage,
    orderPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to a product page", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.highlight()
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the product to the cart and goto checkout", async () => {
      await productPage.selectOption("M")
      await productPage.clickAddProduct()
      await productPage.cartDropdown.navCartLink.click()
      await productPage.cartDropdown.goToCartButton.click()
      await cartPage.container.waitFor({ state: "visible" })
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
    })

    await test.step("Enter in the first step of the checkout process", async () => {
      await test.step("Enter in the shipping address info", async () => {
        await checkoutPage.shippingFirstNameInput.fill("First")
        await checkoutPage.shippingLastNameInput.fill("Last")
        await checkoutPage.shippingCompanyInput.fill("MyCorp")
        await checkoutPage.shippingAddressInput.fill("123 Fake street")
        await checkoutPage.shippingPostalCodeInput.fill("80010")
        await checkoutPage.shippingCityInput.fill("Denver")
        await checkoutPage.shippingProvinceInput.fill("Colorado")
        await checkoutPage.shippingCountrySelect.selectOption("United States")
      })

      await test.step("Enter in the contact info and open the billing info form", async () => {
        await checkoutPage.shippingEmailInput.fill("test@example.com")
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.billingAddressCheckbox.uncheck()
      })

      await test.step("Enter in the billing address info", async () => {
        await checkoutPage.billingFirstNameInput.fill("First")
        await checkoutPage.billingLastNameInput.fill("Last")
        await checkoutPage.billingCompanyInput.fill("MyCorp")
        await checkoutPage.billingAddressInput.fill("123 Fake street")
        await checkoutPage.billingPostalInput.fill("80010")
        await checkoutPage.billingCityInput.fill("Denver")
        await checkoutPage.billingProvinceInput.fill("Colorado")
        await checkoutPage.billingCountrySelect.selectOption("United States")
        await checkoutPage.submitAddressButton.click()
      })
    })

    await test.step("Complete the rest of the payment process", async () => {
      await checkoutPage.selectDeliveryOption("FakeEx Standard")
      await checkoutPage.submitDeliveryOptionButton.click()
      await checkoutPage.submitPaymentButton.click()
      await checkoutPage.submitOrderButton.click()
      await orderPage.container.waitFor({ state: "visible" })
    })

    await test.step("Verify the products ordered are correct", async () => {
      const product = await orderPage.getProduct("Sweatshirt", "M")
      await expect(product.name).toContainText("Sweatshirt")
      await expect(product.variant).toContainText("M")
      await expect(product.quantity).toContainText("1")
    })

    await test.step("Verify the shipping info is correct", async () => {
      const address = orderPage.shippingAddressSummary
      await expect(address).toContainText("First")
      await expect(address).toContainText("Last")
      await expect(address).toContainText("123 Fake street")
      await expect(address).toContainText("80010")
      await expect(address).toContainText("Denver")
      await expect(address).toContainText("US")

      const contact = orderPage.shippingContactSummary
      await expect(contact).toContainText("test@example.com")
      await expect(contact).toContainText("3031112222")

      const method = orderPage.shippingMethodSummary
      await expect(method).toContainText("FakeEx Standard")
    })
  })

  test("Editing checkout steps works as expected", async ({
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to a product page", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.highlight()
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the product to the cart and goto checkout", async () => {
      await productPage.selectOption("M")
      await productPage.clickAddProduct()
      await productPage.cartDropdown.navCartLink.click()
      await productPage.cartDropdown.goToCartButton.click()
      await cartPage.container.waitFor({ state: "visible" })
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
    })

    await test.step("Enter in the first step of the checkout process", async () => {
      await test.step("Enter in the shipping address info", async () => {
        await checkoutPage.shippingFirstNameInput.fill("First")
        await checkoutPage.shippingLastNameInput.fill("Last")
        await checkoutPage.shippingCompanyInput.fill("MyCorp")
        await checkoutPage.shippingAddressInput.fill("123 Fake street")
        await checkoutPage.shippingPostalCodeInput.fill("80010")
        await checkoutPage.shippingCityInput.fill("Denver")
        await checkoutPage.shippingProvinceInput.fill("Colorado")
        await checkoutPage.shippingCountrySelect.selectOption("United States")
      })

      await test.step("Enter in the contact info and open the billing info form", async () => {
        await checkoutPage.shippingEmailInput.fill("test@example.com")
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.billingAddressCheckbox.uncheck()
      })

      await test.step("Enter in the billing address info", async () => {
        await checkoutPage.billingFirstNameInput.fill("First")
        await checkoutPage.billingLastNameInput.fill("Last")
        await checkoutPage.billingCompanyInput.fill("MyCorp")
        await checkoutPage.billingAddressInput.fill("123 Fake street")
        await checkoutPage.billingPostalInput.fill("80010")
        await checkoutPage.billingCityInput.fill("Denver")
        await checkoutPage.billingProvinceInput.fill("Colorado")
        await checkoutPage.billingCountrySelect.selectOption("United States")
        await checkoutPage.submitAddressButton.click()
      })
    })

    await test.step("Submit the delivery and payment options", async () => {
      await checkoutPage.selectDeliveryOption("FakeEx Standard")
      await checkoutPage.submitDeliveryOptionButton.click()
      await checkoutPage.submitPaymentButton.click()
    })

    await test.step("Edit the shipping info", async () => {
      await checkoutPage.editAddressButton.click()
      await test.step("Edit the shipping address", async () => {
        await checkoutPage.shippingFirstNameInput.fill("First1")
        await checkoutPage.shippingLastNameInput.fill("Last1")
        await checkoutPage.shippingCompanyInput.fill("MeCorp")
        await checkoutPage.shippingAddressInput.fill("123 Fake Road")
        await checkoutPage.shippingPostalCodeInput.fill("80011")
        await checkoutPage.shippingCityInput.fill("Donver")
        await checkoutPage.shippingProvinceInput.fill("CO")
        await checkoutPage.shippingCountrySelect.selectOption("Canada")
      })

      await test.step("Edit the shipping contact info", async () => {
        await checkoutPage.shippingEmailInput.fill("tester@example.com")
        await checkoutPage.shippingPhoneInput.fill("3231112222")
      })

      await test.step("Edit the billing info", async () => {
        await checkoutPage.billingFirstNameInput.fill("Farst")
        await checkoutPage.billingLastNameInput.fill("List")
        await checkoutPage.billingCompanyInput.fill("MistCorp")
        await checkoutPage.billingAddressInput.fill("321 Fake street")
        await checkoutPage.billingPostalInput.fill("80110")
        await checkoutPage.billingCityInput.fill("Denvur")
        await checkoutPage.billingProvinceInput.fill("AB")
        await checkoutPage.billingCountrySelect.selectOption("Canada")
      })
      await checkoutPage.submitAddressButton.click()
    })

    await test.step("Make sure the edits are reflected in the container", async () => {
      await test.step("Check shipping address summary", async () => {
        const shippingColumn = checkoutPage.shippingAddressSummary
        await expect(shippingColumn).toContainText("First1")
        await expect(shippingColumn).toContainText("Last1")
        await expect(shippingColumn).toContainText("123 Fake Road")
        await expect(shippingColumn).toContainText("80011")
        await expect(shippingColumn).toContainText("Donver")
        await expect(shippingColumn).toContainText("CA")
      })

      await test.step("Check shipping contact summary", async () => {
        const contactColumn = checkoutPage.shippingContactSummary
        await expect(contactColumn).toContainText("tester@example.com")
        await expect(contactColumn).toContainText("3231112222")
      })

      await test.step("Check billing summary", async () => {
        const billingColumn = checkoutPage.billingAddressSummary
        await expect(billingColumn).toContainText("Farst")
        await expect(billingColumn).toContainText("List")
        await expect(billingColumn).toContainText("321 Fake street")
        await expect(billingColumn).toContainText("Denvur")
        await expect(billingColumn).toContainText("CA")
      })
    })
  })

  test("Shipping info saved is filled back into the forms after clicking edit", async ({
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to a product page", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.highlight()
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the product to the cart and goto checkout", async () => {
      await productPage.selectOption("M")
      await productPage.clickAddProduct()
      await productPage.cartDropdown.navCartLink.click()
      await productPage.cartDropdown.goToCartButton.click()
      await cartPage.container.waitFor({ state: "visible" })
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
    })

    await test.step("Enter in the first step of the checkout process", async () => {
      await test.step("Enter in the shipping address info", async () => {
        await checkoutPage.shippingFirstNameInput.fill("First")
        await checkoutPage.shippingLastNameInput.fill("Last")
        await checkoutPage.shippingCompanyInput.fill("MyCorp")
        await checkoutPage.shippingAddressInput.fill("123 Fake street")
        await checkoutPage.shippingPostalCodeInput.fill("80010")
        await checkoutPage.shippingCityInput.fill("Denver")
        await checkoutPage.shippingProvinceInput.fill("Colorado")
        await checkoutPage.shippingCountrySelect.selectOption("United States")
      })

      await test.step("Enter in the contact info and open the billing info form", async () => {
        await checkoutPage.shippingEmailInput.fill("test@example.com")
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.billingAddressCheckbox.uncheck()
      })

      await test.step("Enter in the billing address info", async () => {
        await checkoutPage.billingFirstNameInput.fill("First")
        await checkoutPage.billingLastNameInput.fill("Last")
        await checkoutPage.billingCompanyInput.fill("MyCorp")
        await checkoutPage.billingAddressInput.fill("123 Fake street")
        await checkoutPage.billingPostalInput.fill("80010")
        await checkoutPage.billingCityInput.fill("Denver")
        await checkoutPage.billingProvinceInput.fill("Colorado")
        await checkoutPage.billingCountrySelect.selectOption("United States")
        await checkoutPage.submitAddressButton.click()
      })
    })

    await test.step("Click the edit address form and ensure the fields are filled correctly", async () => {
      await checkoutPage.editAddressButton.click()
      await test.step("Check the shipping address", async () => {
        await expect(checkoutPage.shippingFirstNameInput).toHaveValue("First")
        await expect(checkoutPage.shippingLastNameInput).toHaveValue("Last")
        await expect(checkoutPage.shippingCompanyInput).toHaveValue("MyCorp")
        await expect(checkoutPage.shippingAddressInput).toHaveValue(
          "123 Fake street"
        )
        await expect(checkoutPage.shippingPostalCodeInput).toHaveValue("80010")
        await expect(checkoutPage.shippingCityInput).toHaveValue("Denver")
        await expect(checkoutPage.shippingProvinceInput).toHaveValue("Colorado")
        await expect(checkoutPage.shippingCountrySelect).toHaveValue("us")
      })

      await test.step("Check the shipping contact", async () => {
        await expect(checkoutPage.shippingEmailInput).toHaveValue(
          "test@example.com"
        )
        await expect(checkoutPage.shippingPhoneInput).toHaveValue("3031112222")
      })

      await test.step("Check the billing address", async () => {
        await expect(checkoutPage.billingFirstNameInput).toHaveValue("First")
        await expect(checkoutPage.billingLastNameInput).toHaveValue("Last")
        await expect(checkoutPage.billingCompanyInput).toHaveValue("MyCorp")
        await expect(checkoutPage.billingAddressInput).toHaveValue(
          "123 Fake street"
        )
        await expect(checkoutPage.billingPostalInput).toHaveValue("80010")
        await expect(checkoutPage.billingCityInput).toHaveValue("Denver")
        await expect(checkoutPage.billingProvinceInput).toHaveValue("Colorado")
        await expect(checkoutPage.billingCountrySelect).toHaveValue("us")
      })
    })

    await test.step("Set the billing info to the same as checked and perform checks", async () => {
      await checkoutPage.billingAddressCheckbox.check()
      await checkoutPage.submitAddressButton.click()
      await checkoutPage.editAddressButton.click()
      await expect(checkoutPage.billingAddressCheckbox).toBeChecked()
    })
  })

  test("Shipping info in the checkout page is correctly reflected in the summary", async ({
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to a product page", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.highlight()
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the product to the cart and goto checkout", async () => {
      await productPage.selectOption("M")
      await productPage.clickAddProduct()
      await productPage.cartDropdown.navCartLink.click()
      await productPage.cartDropdown.goToCartButton.click()
      await cartPage.container.waitFor({ state: "visible" })
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
    })

    await test.step("Enter in the first step of the checkout process", async () => {
      await test.step("Enter in the shipping address info", async () => {
        await checkoutPage.shippingFirstNameInput.fill("First")
        await checkoutPage.shippingLastNameInput.fill("Last")
        await checkoutPage.shippingCompanyInput.fill("MyCorp")
        await checkoutPage.shippingAddressInput.fill("123 Fake street")
        await checkoutPage.shippingPostalCodeInput.fill("80010")
        await checkoutPage.shippingCityInput.fill("Denver")
        await checkoutPage.shippingProvinceInput.fill("Colorado")
        await checkoutPage.shippingCountrySelect.selectOption("United States")
      })

      await test.step("Enter in the contact info and open the billing info form", async () => {
        await checkoutPage.shippingEmailInput.fill("test@example.com")
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.billingAddressCheckbox.uncheck()
      })

      await test.step("Enter in the billing address info", async () => {
        await checkoutPage.billingFirstNameInput.fill("First")
        await checkoutPage.billingLastNameInput.fill("Last")
        await checkoutPage.billingCompanyInput.fill("MyCorp")
        await checkoutPage.billingAddressInput.fill("123 Fake street")
        await checkoutPage.billingPostalInput.fill("80010")
        await checkoutPage.billingCityInput.fill("Denver")
        await checkoutPage.billingProvinceInput.fill("Colorado")
        await checkoutPage.billingCountrySelect.selectOption("United States")
        await checkoutPage.submitAddressButton.click()
      })
    })

    await test.step("Ensure the shipping column reflects the entered data", async () => {
      const shippingColumn = checkoutPage.shippingAddressSummary
      await expect(shippingColumn).toContainText("First")
      await expect(shippingColumn).toContainText("Last")
      await expect(shippingColumn).toContainText("123 Fake street")
      await expect(shippingColumn).toContainText("80010")
      await expect(shippingColumn).toContainText("Denver")
      await expect(shippingColumn).toContainText("US")
    })

    await test.step("Ensure the contact column reflects the entered data", async () => {
      const contactColumn = checkoutPage.shippingContactSummary
      await expect(contactColumn).toContainText("test@example.com")
      await expect(contactColumn).toContainText("3031112222")
    })

    await test.step("Ensure the billing column reflects the entered data", async () => {
      const billingColumn = checkoutPage.billingAddressSummary
      await expect(billingColumn).toContainText("First")
      await expect(billingColumn).toContainText("Last")
      await expect(billingColumn).toContainText("123 Fake street")
      await expect(billingColumn).toContainText("Denver")
      await expect(billingColumn).toContainText("US")
    })

    await test.step("Edit the billing info so it is the same as the billing address", async () => {
      await checkoutPage.editAddressButton.click()
      await checkoutPage.billingAddressCheckbox.check()
      await checkoutPage.submitAddressButton.click()
      const billingColumn = checkoutPage.billingAddressSummary
      await expect(billingColumn).toContainText("are the same.")
    })
  })

  test("Entering checkout, leaving, then returning takes you back to the correct checkout spot", async ({
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to a product page", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.highlight()
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the product to the cart and goto checkout", async () => {
      await productPage.selectOption("M")
      await productPage.clickAddProduct()
      await productPage.cartDropdown.navCartLink.click()
      await productPage.cartDropdown.goToCartButton.click()
      await cartPage.container.waitFor({ state: "visible" })
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
    })

    await test.step("Navigate away and back to the checkout page", async () => {
      await checkoutPage.backToCartLink.click()
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      await expect(checkoutPage.submitAddressButton).toBeVisible()
    })

    await test.step("Enter in the first step of the checkout process", async () => {
      await test.step("Enter in the shipping address info", async () => {
        await checkoutPage.shippingFirstNameInput.fill("First")
        await checkoutPage.shippingLastNameInput.fill("Last")
        await checkoutPage.shippingCompanyInput.fill("MyCorp")
        await checkoutPage.shippingAddressInput.fill("123 Fake street")
        await checkoutPage.shippingPostalCodeInput.fill("80010")
        await checkoutPage.shippingCityInput.fill("Denver")
        await checkoutPage.shippingProvinceInput.fill("Colorado")
        await checkoutPage.shippingCountrySelect.selectOption("United States")
      })

      await test.step("Enter in the contact info and open the billing info form", async () => {
        await checkoutPage.shippingEmailInput.fill("test@example.com")
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.billingAddressCheckbox.uncheck()
      })

      await test.step("Enter in the billing address info", async () => {
        await checkoutPage.billingFirstNameInput.fill("First")
        await checkoutPage.billingLastNameInput.fill("Last")
        await checkoutPage.billingCompanyInput.fill("MyCorp")
        await checkoutPage.billingAddressInput.fill("123 Fake street")
        await checkoutPage.billingPostalInput.fill("80010")
        await checkoutPage.billingCityInput.fill("Denver")
        await checkoutPage.billingProvinceInput.fill("Colorado")
        await checkoutPage.billingCountrySelect.selectOption("United States")
      })
      await checkoutPage.submitAddressButton.click()
      await checkoutPage.deliveryOptionRadio
        .first()
        .waitFor({ state: "visible" })
    })

    await test.step("Navigate away and back to the checkout page", async () => {
      await checkoutPage.backToCartLink.click()
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      await expect(checkoutPage.submitDeliveryOptionButton).toBeVisible()
    })

    await test.step("Submit the delivery choice and navigate back and forth", async () => {
      await checkoutPage.selectDeliveryOption("FakeEx Standard")
      await checkoutPage.submitDeliveryOptionButton.click()
      await checkoutPage.submitPaymentButton.waitFor({ state: "visible" })
      await checkoutPage.backToCartLink.click()
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      await expect(checkoutPage.submitPaymentButton).toBeVisible()
    })

    await test.step("Submit the payment info and navigate back and forth", async () => {
      await checkoutPage.submitPaymentButton.click()
      await checkoutPage.submitOrderButton.waitFor({ state: "visible" })
      await checkoutPage.backToCartLink.click()
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      await expect(checkoutPage.submitPaymentButton).toBeVisible()
    })

    await test.step("Click edit on the shipping info and navigate back and forth", async () => {
      await checkoutPage.editAddressButton.click()
      await checkoutPage.backToCartLink.click()
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      await expect(checkoutPage.submitPaymentButton).toBeVisible()
    })

    await test.step("Click edit on the shipping choice and navigate back and forth", async () => {
      await checkoutPage.editDeliveryButton.click()
      await checkoutPage.backToCartLink.click()
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      await expect(checkoutPage.submitPaymentButton).toBeVisible()
    })
  })

  test("Verify the prices carries over to checkout", async ({
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to the product page - go to the store page and click on the Sweatshirt product", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    let sweatshirtSmallPrice = 0
    let sweatshirtMediumPrice = 0
    await test.step("Add the sweatshirts to the cart", async () => {
      await productPage.selectOption("S")
      sweatshirtSmallPrice = getFloatValue(
        (await productPage.productPrice.getAttribute("data-value")) || "0"
      )
      await productPage.clickAddProduct()
      await productPage.cartDropdown.close()
      await productPage.selectOption("M")
      sweatshirtMediumPrice = getFloatValue(
        (await productPage.productPrice.getAttribute("data-value")) || "0"
      )
      await productPage.clickAddProduct()
      await productPage.cartDropdown.close()
    })

    await test.step("Navigate to another product - Sweatpants", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatpants")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    let sweatpantsSmallPrice = 0
    await test.step("Add the small sweatpants to the cart", async () => {
      await productPage.selectOption("S")
      sweatpantsSmallPrice = getFloatValue(
        (await productPage.productPrice.getAttribute("data-value")) || "0"
      )
      await productPage.clickAddProduct()
      await productPage.cartDropdown.close()
      await productPage.selectOption("S")
      await productPage.clickAddProduct()
      await productPage.cartDropdown.goToCartButton.click()
      await productPage.cartDropdown.close()
      await cartPage.container.waitFor({ state: "visible" })
    })

    await test.step("Verify the price in the cart is the expected value", async () => {
      const total = getFloatValue(
        (await cartPage.cartSubtotal.getAttribute("data-value")) || "0"
      )
      const calculatedTotal =
        2 * sweatpantsSmallPrice + sweatshirtSmallPrice + sweatshirtMediumPrice
      expect(compareFloats(total, calculatedTotal)).toBe(0)
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
    })

    await test.step("Go to checkout and verify the price in the checkout is the expected value", async () => {
      const total = getFloatValue(
        (await checkoutPage.cartSubtotal.getAttribute("data-value")) || "0"
      )
      const calculatedTotal =
        2 * sweatpantsSmallPrice + sweatshirtSmallPrice + sweatpantsSmallPrice
      expect(compareFloats(total, calculatedTotal)).toBe(0)
    })
  })
})
