import { test, expect } from "../../index"

test.describe("Account orders page tests", async () => {
  test.beforeEach(async ({ accountAddressesPage }) => {
    await accountAddressesPage.goto()
    await accountAddressesPage.newAddressButton.click()
    await test.step("Add default address", async () => {
      const modal = accountAddressesPage.addAddressModal
      await modal.container.waitFor({ state: "visible" })
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
  })

  test("Verify account orders page displays empty container", async ({
    accountOrdersPage,
  }) => {
    await accountOrdersPage.goto()
    await expect(accountOrdersPage.noOrdersContainer).toBeVisible()
  })

  test("Order shows up after checkout flow", async ({
    accountOrdersPage,
    accountOrderPage,
    cartPage,
    checkoutPage,
    orderPage: publicOrderPage,
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
      await checkoutPage.selectSavedAddress("123 Fake Street")
      await checkoutPage.shippingEmailInput.fill("test@example.com")
      await checkoutPage.shippingPhoneInput.fill("3031112222")
      await checkoutPage.submitAddressButton.click()
      await checkoutPage.deliveryOptionsContainer.waitFor({ state: "visible" })
    })

    await test.step("Complete the rest of the payment process", async () => {
      await checkoutPage.selectDeliveryOption("FakeEx Standard")
      await checkoutPage.submitDeliveryOptionButton.click()
      await checkoutPage.submitPaymentButton.click()
      await checkoutPage.submitOrderButton.click()
      await publicOrderPage.container.waitFor({ state: "visible" })
    })

    let orderId = ""
    await test.step("Verify the order page information is correct", async () => {
      orderId = (await publicOrderPage.orderId.textContent()) || ""

      await test.step("Verify the products ordered are correct", async () => {
        const product = await publicOrderPage.getProduct("Sweatshirt", "M")
        await expect(product.name).toContainText("Sweatshirt")
        await expect(product.variant).toContainText("M")
        await expect(product.quantity).toContainText("1")
      })

      await test.step("Verify the shipping info is correct", async () => {
        const address = publicOrderPage.shippingAddressSummary
        await expect(address).toContainText("First")
        await expect(address).toContainText("Last")
        await expect(address).toContainText("123 Fake Street")
        await expect(address).toContainText("11111")
        await expect(address).toContainText("City")
        await expect(address).toContainText("US")

        const contact = publicOrderPage.shippingContactSummary
        await expect(contact).toContainText("test@example.com")
        await expect(contact).toContainText("3031112222")

        const method = publicOrderPage.shippingMethodSummary
        await expect(method).toContainText("FakeEx Standard")
      })
    })

    await test.step("Verify the account orders page displays a result", async () => {
      await accountOrdersPage.goto()
      const order = await accountOrdersPage.getOrderById(orderId)
      expect(order.items.length).toBe(1)
      expect(order.items[0].title).toContainText("Sweatshirt")
      expect(order.items[0].quantity).toHaveText("1")
      await order.detailsLink.click()
      await accountOrderPage.container.waitFor({ state: "visible" })
    })

    await test.step("Verify the order page displays the correct information", async () => {
      await test.step("Verify the order id is correct", async () => {
        await expect(accountOrderPage.orderId).toHaveText(orderId)
      })

      await test.step("Verify the products ordered are correct", async () => {
        const product = await accountOrderPage.getProduct("Sweatshirt", "M")
        await expect(product.name).toContainText("Sweatshirt")
        await expect(product.variant).toContainText("M")
        await expect(product.quantity).toContainText("1")
      })

      await test.step("Verify the shipping info is correct", async () => {
        const address = accountOrderPage.shippingAddressSummary
        await expect(address).toContainText("First")
        await expect(address).toContainText("Last")
        await expect(address).toContainText("123 Fake Street")
        await expect(address).toContainText("11111")
        await expect(address).toContainText("City")
        await expect(address).toContainText("US")

        const contact = accountOrderPage.shippingContactSummary
        await contact.highlight()
        await expect(contact.getByText("test@example.com")).toBeVisible()
        await expect(contact.getByText("3031112222")).toBeVisible()

        const method = accountOrderPage.shippingMethodSummary
        await method.highlight()
        await expect(method).toContainText("FakeEx Standard")
      })
    })

    await test.step("Navigate back to the orders page, verifying back button works", async () => {
      await accountOrderPage.backToOverviewButton.click()
      await accountOrdersPage.container.waitFor({ state: "visible" })
    })
  })

  test("Order preserves item count, and variants", async ({
    accountOrdersPage,
    accountOrderPage,
    cartPage,
    checkoutPage,
    orderPage: publicOrderPage,
    productPage,
    storePage,
  }) => {
    await test.step("Add first batch or products to the cart", async () => {
      await test.step("Navigate to the sweatshirt product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.highlight()
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.close()
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.close()
      })
    })

    await test.step("Add second batch of products to the cart", async () => {
      await test.step("Navigate to the sweatshirt product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatpants")
        await product.locator.highlight()
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("S")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.close()
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
      })

      await test.step("Navigate to the checkout process", async () => {
        await productPage.cartDropdown.goToCartButton.click()
        await productPage.cartDropdown.close()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.checkoutButton.click()
        await checkoutPage.container.waitFor({ state: "visible" })
      })
    })

    let orderId = ""
    await test.step("Checkout process", async () => {
      await test.step("Enter in the first step of the checkout process", async () => {
        await checkoutPage.selectSavedAddress("123 Fake Street")
        await checkoutPage.shippingEmailInput.fill("test@example.com")
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.submitAddressButton.click()
        await checkoutPage.deliveryOptionsContainer.waitFor({
          state: "visible",
        })
      })

      await test.step("Complete the rest of the payment process", async () => {
        await checkoutPage.selectDeliveryOption("FakeEx Standard")
        await checkoutPage.submitDeliveryOptionButton.click()
        await checkoutPage.submitPaymentButton.click()
        await checkoutPage.submitOrderButton.click()
        await publicOrderPage.container.waitFor({ state: "visible" })
        orderId = (await publicOrderPage.orderId.textContent()) || ""
      })
    })

    await test.step("Verify the order page information is correct", async () => {
      await test.step("Navigate to the account orders page, verify information, and navigate to the order page", async () => {
        await accountOrdersPage.goto()
        const order = await accountOrdersPage.getOrderById(orderId)
        expect(order.itemsLocator).toHaveCount(3)
        expect(
          order.itemsLocator.filter({ hasText: "Sweatpants" })
        ).toHaveCount(2)
        expect(
          order.itemsLocator.filter({ hasText: "Sweatshirt" })
        ).toHaveCount(1)
        await order.detailsLink.click()
        await accountOrderPage.container.waitFor({ state: "visible" })
      })

      await test.step("Verify information on the order page", async () => {
        const sweatshirt = await accountOrderPage.getProduct("Sweatshirt", "M")
        await expect(sweatshirt.name).toContainText("Sweatshirt")
        await expect(sweatshirt.variant).toContainText("M")
        await expect(sweatshirt.quantity).toContainText("2")

        const smallSweatpants = await accountOrderPage.getProduct(
          "Sweatpants",
          "S"
        )
        await expect(smallSweatpants.name).toContainText("Sweatpants")
        await expect(smallSweatpants.variant).toContainText("S")
        await expect(smallSweatpants.quantity).toContainText("1")

        const mediumSweatpants = await accountOrderPage.getProduct(
          "Sweatpants",
          "M"
        )
        await expect(mediumSweatpants.name).toContainText("Sweatpants")
        await expect(mediumSweatpants.variant).toContainText("M")
        await expect(mediumSweatpants.quantity).toContainText("1")
      })
    })
  })

  test("Multiple orders are stored correctly", async ({
    accountOrdersPage,
    cartPage,
    checkoutPage,
    orderPage: publicOrderPage,
    productPage,
    storePage,
  }) => {
    let firstOrderId = ""
    let secondOrderId = ""
    await test.step("Make the first order", async () => {
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
        await checkoutPage.selectSavedAddress("123 Fake Street")
        await checkoutPage.shippingEmailInput.fill("test@example.com")
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.submitAddressButton.click()
        await checkoutPage.deliveryOptionsContainer.waitFor({
          state: "visible",
        })
      })

      await test.step("Complete the rest of the payment process", async () => {
        await checkoutPage.selectDeliveryOption("FakeEx Standard")
        await checkoutPage.submitDeliveryOptionButton.click()
        await checkoutPage.submitPaymentButton.click()
        await checkoutPage.submitOrderButton.click()
        await publicOrderPage.container.waitFor({ state: "visible" })
        firstOrderId = (await publicOrderPage.orderId.textContent()) || ""
      })
    })

    await test.step("Make the second order", async () => {
      await test.step("Navigate to a product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatpants")
        await product.locator.highlight()
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("S")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.checkoutButton.click()
        await checkoutPage.container.waitFor({ state: "visible" })
      })

      await test.step("Enter in the first step of the checkout process", async () => {
        await checkoutPage.selectSavedAddress("123 Fake Street")
        await checkoutPage.shippingEmailInput.fill("test@example.com")
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.submitAddressButton.click()
        await checkoutPage.deliveryOptionsContainer.waitFor({
          state: "visible",
        })
      })

      await test.step("Complete the rest of the payment process", async () => {
        await checkoutPage.selectDeliveryOption("FakeEx Standard")
        await checkoutPage.submitDeliveryOptionButton.click()
        await checkoutPage.submitPaymentButton.click()
        await checkoutPage.submitOrderButton.click()
        await publicOrderPage.container.waitFor({ state: "visible" })
        secondOrderId = (await publicOrderPage.orderId.textContent()) || ""
      })
    })

    await test.step("Verify there are distinct orders on the orders page", async () => {
      await accountOrdersPage.goto()
      await test.step("Verify the first order info", async () => {
        const order = await accountOrdersPage.getOrderById(firstOrderId)
        await expect(order.itemsLocator).toHaveCount(1)
        await expect(order.items[0].title).toContainText("Sweatshirt")
        await expect(order.items[0].quantity).toHaveText("1")
      })
      await test.step("Verify the second order info", async () => {
        const order = await accountOrdersPage.getOrderById(secondOrderId)
        await expect(order.itemsLocator).toHaveCount(1)
        await expect(order.items[0].title).toContainText("Sweatpants")
        await expect(order.items[0].quantity).toHaveText("1")
      })
    })
  })
})
