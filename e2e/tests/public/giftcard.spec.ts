import { first } from "lodash"
import { seedGiftcard, seedUser } from "../../data/seed"
import { test, expect } from "../../index"

test.describe("Gift card tests", async () => {
  let giftcard = {
    id: "",
    code: "",
    value: 0,
    amount: "0",
    balance: "",
  }
  test.beforeEach(async () => {
    giftcard = await seedGiftcard()
  })

  test("Make sure giftcard can be used to pay for transaction", async ({
    cartPage,
    checkoutPage,
    orderPage,
    productPage,
    storePage,
  }) => {
    let cartSubtotal = ""
    await test.step("Go through purchasing process, upto the cart page", async () => {
      await test.step("Navigate to a product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.cartDropdown.close()
        cartSubtotal =
          (await cartPage.cartTotal.getAttribute("data-value")) || ""
      })
      await test.step("Navigate to the checkout page", async () => {
        await cartPage.checkoutButton.click()
        await checkoutPage.container.waitFor({ state: "visible" })
      })
    })

    await test.step("Enter in the giftcard and assert value works", async () => {
      await checkoutPage.discountButton.click()
      await expect(checkoutPage.discountInput).toBeVisible()
      await checkoutPage.discountInput.fill(giftcard.code)
      await checkoutPage.discountApplyButton.click()
      const paymentGiftcard = await checkoutPage.getGiftCard(giftcard.code)
      await expect(paymentGiftcard.locator).toBeVisible()
      await expect(paymentGiftcard.code).toHaveText(giftcard.code)
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
      expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    let shippingTotal = ""
    await test.step("Go through checkout process", async () => {
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
          await checkoutPage.submitAddressButton.click()
        })
      })

      await test.step("Complete the rest of the payment process", async () => {
        await checkoutPage.selectDeliveryOption("FakeEx Standard")
        await checkoutPage.submitDeliveryOptionButton.click()
        shippingTotal =
          (await checkoutPage.cartShipping.getAttribute("data-value")) || ""
        await checkoutPage.submitPaymentButton.click()
      })

      await test.step("Make sure the giftcard still has the total as zero after selecting shipping", async () => {
        expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe(
          "0"
        )
      })

      await test.step("Finish completing the order", async () => {
        await checkoutPage.submitOrderButton.click()
        await orderPage.container.waitFor({ state: "visible" })
      })
    })
    const cartTotal = (Number(cartSubtotal) + Number(shippingTotal)).toString()

    await test.step("Assert the order page shows the total was 0", async () => {
      expect(await orderPage.cartTotal.getAttribute("data-value")).toBe("0")
      expect(await orderPage.cartSubtotal.getAttribute("data-value")).toBe(
        cartSubtotal
      )
      expect(
        await orderPage.cartGiftCardAmount.getAttribute("data-value")
      ).toBe(cartTotal)
    })
  })

  test("Make sure giftcard can be used when entered in from cart", async ({
    cartPage,
    checkoutPage,
    orderPage,
    productPage,
    storePage,
  }) => {
    let cartSubtotal = ""
    await test.step("Go through purchasing process, upto the cart page", async () => {
      await test.step("Navigate to a product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.cartDropdown.close()
        cartSubtotal =
          (await cartPage.cartTotal.getAttribute("data-value")) || ""
      })
    })

    await test.step("Enter in the giftcard and assert value works", async () => {
      await cartPage.discountButton.click()
      await expect(cartPage.discountInput).toBeVisible()
      await cartPage.discountInput.fill(giftcard.code)
      await cartPage.discountApplyButton.click()
      const paymentGiftcard = await cartPage.getGiftCard(giftcard.code)
      await expect(paymentGiftcard.locator).toBeVisible()
      await expect(paymentGiftcard.code).toHaveText(giftcard.code)
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
      expect(await cartPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    await test.step("Go to checkout and assert the value is still 0", async () => {
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    let shippingTotal = ""
    await test.step("Go through checkout process", async () => {
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
          await checkoutPage.submitAddressButton.click()
        })
      })

      await test.step("Complete the rest of the payment process", async () => {
        await checkoutPage.selectDeliveryOption("FakeEx Standard")
        await checkoutPage.submitDeliveryOptionButton.click()
        shippingTotal =
          (await checkoutPage.cartShipping.getAttribute("data-value")) || ""
        await checkoutPage.submitPaymentButton.click()
        await checkoutPage.submitOrderButton.click()
        await orderPage.container.waitFor({ state: "visible" })
      })
    })
    const cartTotal = (Number(cartSubtotal) + Number(shippingTotal)).toString()

    await test.step("Assert the order page shows the total was 0", async () => {
      expect(await orderPage.cartTotal.getAttribute("data-value")).toBe("0")
      expect(await orderPage.cartSubtotal.getAttribute("data-value")).toBe(
        cartSubtotal
      )
      expect(
        await orderPage.cartGiftCardAmount.getAttribute("data-value")
      ).toBe(cartTotal)
    })
  })

  test("Ensure adding and removing a giftcard does not impact checkout amount", async ({
    cartPage,
    checkoutPage,
    orderPage,
    productPage,
    storePage,
  }) => {
    let cartSubtotal = ""
    await test.step("Go through purchasing process, upto the cart page", async () => {
      await test.step("Navigate to a product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.cartDropdown.close()
        cartSubtotal =
          (await cartPage.cartTotal.getAttribute("data-value")) || ""
      })
    })

    await test.step("Enter in the giftcard and assert value works", async () => {
      await cartPage.discountButton.click()
      await expect(cartPage.discountInput).toBeVisible()
      await cartPage.discountInput.fill(giftcard.code)
      await cartPage.discountApplyButton.click()
      const paymentGiftcard = await cartPage.getGiftCard(giftcard.code)
      await expect(paymentGiftcard.locator).toBeVisible()
      await expect(paymentGiftcard.code).toHaveText(giftcard.code)
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
      expect(await cartPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    await test.step("Go to checkout and assert the value is still 0", async () => {
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe("0")
      const paymentGiftcard = await checkoutPage.getGiftCard(giftcard.code)
      await paymentGiftcard.removeButton.click()
      await expect(paymentGiftcard.locator).not.toBeVisible()
      expect(await checkoutPage.cartTotal.getAttribute("data-value")).not.toBe(
        "0"
      )
    })

    let shippingTotal = ""
    await test.step("Go through checkout process", async () => {
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
          await checkoutPage.submitAddressButton.click()
        })
      })

      await test.step("Complete the rest of the payment process", async () => {
        await checkoutPage.selectDeliveryOption("FakeEx Standard")
        await checkoutPage.submitDeliveryOptionButton.click()
        shippingTotal =
          (await checkoutPage.cartShipping.getAttribute("data-value")) || ""
        await checkoutPage.submitPaymentButton.click()
        await checkoutPage.submitOrderButton.click()
        await orderPage.container.waitFor({ state: "visible" })
      })
    })
    const cartTotal = (Number(cartSubtotal) + Number(shippingTotal)).toString()

    await test.step("Assert the order page shows the total was 0", async () => {
      expect(await orderPage.cartTotal.getAttribute("data-value")).toBe(
        cartTotal
      )
      expect(await orderPage.cartSubtotal.getAttribute("data-value")).toBe(
        cartSubtotal
      )
    })
  })

  test("Make sure a fake gift card displays an error message on the cart page", async ({
    cartPage,
    productPage,
    storePage,
  }) => {
    await test.step("Go through purchasing process, upto the cart page", async () => {
      await test.step("Navigate to a product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.cartDropdown.close()
      })
    })
    await test.step("Enter in the fake giftcard", async () => {
      await cartPage.discountButton.click()
      await expect(cartPage.discountInput).toBeVisible()
      await cartPage.discountInput.fill("__FAKE_GIFT_CARD_DNE_1111111")
      await cartPage.discountApplyButton.click()
      await expect(cartPage.discountErrorMessage).toBeVisible()
    })
  })

  test("Make sure a fake gift card displays an error message on the checkout page", async ({
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Go through purchasing process, upto the cart page", async () => {
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
        await cartPage.cartDropdown.close()
        await cartPage.checkoutButton.click()
        await checkoutPage.container.waitFor({ state: "visible" })
      })
    })
    await test.step("Enter in the fake giftcard", async () => {
      await checkoutPage.discountButton.click()
      await expect(checkoutPage.discountInput).toBeVisible()
      await checkoutPage.discountInput.fill("__FAKE_GIFT_CARD_DNE_1111111")
      await checkoutPage.discountApplyButton.click()
      await expect(checkoutPage.discountErrorMessage).toBeVisible()
    })
  })

  test("Adding a giftcard and then accessing the cart at a later point keeps the giftcard amount", async ({
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Go through purchasing process, upto the cart page", async () => {
      await test.step("Navigate to a product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.cartDropdown.close()
      })
    })

    await test.step("Enter in the giftcard and assert value works", async () => {
      await cartPage.discountButton.click()
      await cartPage.discountInput.fill(giftcard.code)
      await cartPage.discountApplyButton.click()
      const paymentGiftcard = await cartPage.getGiftCard(giftcard.code)
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
      expect(await cartPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    await test.step("Navigate away from the cart page and return to it", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatpants")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
      await cartPage.goto()
    })

    await test.step("Verify the giftcard is still on the cart page", async () => {
      const paymentGiftcard = await cartPage.getGiftCard(giftcard.code)
      await expect(paymentGiftcard.locator).toBeVisible()
      await expect(paymentGiftcard.code).toContainText(giftcard.code)
      expect(await cartPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    await test.step("Verify the giftcard is still on the checkout page", async () => {
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      const paymentGiftcard = await checkoutPage.getGiftCard(giftcard.code)
      await expect(paymentGiftcard.locator).toBeVisible()
      await expect(paymentGiftcard.code).toContainText(giftcard.code)
      expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe("0")
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
    })
  })

  test("Adding a giftcard and then adding another item to the cart keeps the giftcard", async ({
    cartPage,
    checkoutPage,
    productPage,
    storePage,
  }) => {
    await test.step("Go through purchasing process, upto the cart page", async () => {
      await test.step("Navigate to a product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.cartDropdown.close()
      })
    })

    await test.step("Enter in the giftcard and assert value works", async () => {
      await cartPage.discountButton.click()
      await cartPage.discountInput.fill(giftcard.code)
      await cartPage.discountApplyButton.click()
      const paymentGiftcard = await cartPage.getGiftCard(giftcard.code)
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
      expect(await cartPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    await test.step("Navigate away from the cart page and return to it", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatpants")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
      await productPage.selectOption("XL")
      await productPage.clickAddProduct()
      await productPage.cartDropdown.close()
      await cartPage.goto()
    })

    await test.step("Verify the giftcard is still on the cart page", async () => {
      const paymentGiftcard = await cartPage.getGiftCard(giftcard.code)
      await expect(paymentGiftcard.locator).toBeVisible()
      await expect(paymentGiftcard.code).toContainText(giftcard.code)
      expect(await cartPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    await test.step("Verify the giftcard is still on the checkout page", async () => {
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
      const paymentGiftcard = await checkoutPage.getGiftCard(giftcard.code)
      await expect(paymentGiftcard.locator).toBeVisible()
      await expect(paymentGiftcard.code).toContainText(giftcard.code)
      expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe("0")
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
    })
  })

  test("Applying a giftcard, deleting cookies, and then reapplying the giftcard works", async ({
    cartPage,
    productPage,
    storePage,
  }) => {
    await test.step("Go through purchasing process, upto the cart page", async () => {
      await test.step("Navigate to a product page", async () => {
        await storePage.goto()
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.cartDropdown.close()
      })
    })

    await test.step("Enter in the giftcard and assert value works", async () => {
      await cartPage.discountButton.click()
      await cartPage.discountInput.fill(giftcard.code)
      await cartPage.discountApplyButton.click()
      const paymentGiftcard = await cartPage.getGiftCard(giftcard.code)
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
      expect(await cartPage.cartTotal.getAttribute("data-value")).toBe("0")
    })

    await test.step("Navigate away from the cart page and delete cookies", async () => {
      const context = storePage.page.context()
      await context.clearCookies()
      await storePage.page.reload()
      await storePage.goto()
    })

    await test.step("Recreate the cart", async () => {
      await test.step("Navigate to a product page", async () => {
        const product = await storePage.getProduct("Sweatshirt")
        await product.locator.click()
        await productPage.container.waitFor({ state: "visible" })
      })

      await test.step("Add the product to the cart and goto checkout", async () => {
        await productPage.selectOption("M")
        await productPage.clickAddProduct()
        await productPage.cartDropdown.navCartLink.click()
        await productPage.cartDropdown.goToCartButton.click()
        await cartPage.container.waitFor({ state: "visible" })
        await cartPage.cartDropdown.close()
      })
    })
    await test.step("Re-enter in the giftcard and assert value works", async () => {
      await cartPage.discountButton.click()
      await cartPage.discountInput.fill(giftcard.code)
      await cartPage.discountApplyButton.click()
      const paymentGiftcard = await cartPage.getGiftCard(giftcard.code)
      expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
      expect(await cartPage.cartTotal.getAttribute("data-value")).toBe("0")
    })
  })

  test("Gift card balance works as expected across transactions", async ({
    cartPage,
    checkoutPage,
    orderPage,
    productPage,
    storePage,
  }) => {
    let firstTransactionTotal = 0
    await test.step("Complete first transaction using the giftcard", async () => {
      let cartSubtotal = ""
      await test.step("Go through purchasing process, upto the cart page", async () => {
        await test.step("Navigate to a product page", async () => {
          await storePage.goto()
          const product = await storePage.getProduct("Sweatshirt")
          await product.locator.click()
          await productPage.container.waitFor({ state: "visible" })
        })

        await test.step("Add the product to the cart and goto checkout", async () => {
          await productPage.selectOption("M")
          await productPage.clickAddProduct()
          await productPage.cartDropdown.navCartLink.click()
          await productPage.cartDropdown.goToCartButton.click()
          await cartPage.container.waitFor({ state: "visible" })
          await cartPage.cartDropdown.close()
          cartSubtotal =
            (await cartPage.cartTotal.getAttribute("data-value")) || ""
        })
        await test.step("Navigate to the checkout page", async () => {
          await cartPage.checkoutButton.click()
          await checkoutPage.container.waitFor({ state: "visible" })
        })
      })

      await test.step("Enter in the giftcard and assert value works", async () => {
        await checkoutPage.discountButton.click()
        await expect(checkoutPage.discountInput).toBeVisible()
        await checkoutPage.discountInput.fill(giftcard.code)
        await checkoutPage.discountApplyButton.click()
        const paymentGiftcard = await checkoutPage.getGiftCard(giftcard.code)
        await expect(paymentGiftcard.locator).toBeVisible()
        await expect(paymentGiftcard.code).toHaveText(giftcard.code)
        expect(paymentGiftcard.amountValue).toBe(giftcard.amount)
        expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe(
          "0"
        )
      })

      let shippingTotal = ""
      await test.step("Go through checkout process", async () => {
        await test.step("Enter in the first step of the checkout process", async () => {
          await test.step("Enter in the shipping address info", async () => {
            await checkoutPage.shippingFirstNameInput.fill("First")
            await checkoutPage.shippingLastNameInput.fill("Last")
            await checkoutPage.shippingCompanyInput.fill("MyCorp")
            await checkoutPage.shippingAddressInput.fill("123 Fake street")
            await checkoutPage.shippingPostalCodeInput.fill("80010")
            await checkoutPage.shippingCityInput.fill("Denver")
            await checkoutPage.shippingProvinceInput.fill("Colorado")
            await checkoutPage.shippingCountrySelect.selectOption(
              "United States"
            )
          })

          await test.step("Enter in the contact info and open the billing info form", async () => {
            await checkoutPage.shippingEmailInput.fill("test@example.com")
            await checkoutPage.shippingPhoneInput.fill("3031112222")
            await checkoutPage.submitAddressButton.click()
          })
        })

        await test.step("Complete the rest of the payment process", async () => {
          await checkoutPage.selectDeliveryOption("FakeEx Standard")
          await checkoutPage.submitDeliveryOptionButton.click()
          shippingTotal =
            (await checkoutPage.cartShipping.getAttribute("data-value")) || ""
          await checkoutPage.submitPaymentButton.click()
        })

        await test.step("Make sure the giftcard still has the total as zero after selecting shipping", async () => {
          expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe(
            "0"
          )
        })

        await test.step("Finish completing the order", async () => {
          await checkoutPage.submitOrderButton.click()
          await orderPage.container.waitFor({ state: "visible" })
        })
      })
      const cartTotal = Number(cartSubtotal) + Number(shippingTotal)
      firstTransactionTotal = cartTotal

      await test.step("Assert the order page shows the total was 0", async () => {
        expect(await orderPage.cartTotal.getAttribute("data-value")).toBe("0")
        expect(await orderPage.cartSubtotal.getAttribute("data-value")).toBe(
          cartSubtotal
        )
        expect(
          await orderPage.cartGiftCardAmount.getAttribute("data-value")
        ).toBe(cartTotal.toString())
      })
    })
    await test.step("Setup the second transaction with the same giftcard", async () => {
      let cartSubtotal = ""
      await test.step("Go through purchasing process, upto the cart page", async () => {
        await test.step("Navigate to a product page", async () => {
          await storePage.goto()
          const product = await storePage.getProduct("Sweatshirt")
          await product.locator.click()
          await productPage.container.waitFor({ state: "visible" })
        })

        await test.step("Add the product to the cart and goto checkout", async () => {
          await productPage.selectOption("M")
          await productPage.clickAddProduct()
          await productPage.cartDropdown.navCartLink.click()
          await productPage.cartDropdown.goToCartButton.click()
          await cartPage.container.waitFor({ state: "visible" })
          await cartPage.cartDropdown.close()
          cartSubtotal =
            (await cartPage.cartTotal.getAttribute("data-value")) || ""
        })
        await test.step("Navigate to the checkout page", async () => {
          await cartPage.checkoutButton.click()
          await checkoutPage.container.waitFor({ state: "visible" })
        })
      })

      await test.step("Enter in the giftcard and assert value works", async () => {
        await checkoutPage.discountButton.click()
        await expect(checkoutPage.discountInput).toBeVisible()
        await checkoutPage.discountInput.fill(giftcard.code)
        await checkoutPage.discountApplyButton.click()
        const paymentGiftcard = await checkoutPage.getGiftCard(giftcard.code)
        await expect(paymentGiftcard.locator).toBeVisible()
        await expect(paymentGiftcard.code).toHaveText(giftcard.code)
        expect(paymentGiftcard.amountValue).toBe(
          (giftcard.value - firstTransactionTotal).toString()
        )
        expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe(
          "0"
        )
      })

      let shippingTotal = ""
      await test.step("Go through checkout process", async () => {
        await test.step("Enter in the first step of the checkout process", async () => {
          await test.step("Enter in the shipping address info", async () => {
            await checkoutPage.shippingFirstNameInput.fill("First")
            await checkoutPage.shippingLastNameInput.fill("Last")
            await checkoutPage.shippingCompanyInput.fill("MyCorp")
            await checkoutPage.shippingAddressInput.fill("123 Fake street")
            await checkoutPage.shippingPostalCodeInput.fill("80010")
            await checkoutPage.shippingCityInput.fill("Denver")
            await checkoutPage.shippingProvinceInput.fill("Colorado")
            await checkoutPage.shippingCountrySelect.selectOption(
              "United States"
            )
          })

          await test.step("Enter in the contact info and open the billing info form", async () => {
            await checkoutPage.shippingEmailInput.fill("test@example.com")
            await checkoutPage.shippingPhoneInput.fill("3031112222")
            await checkoutPage.submitAddressButton.click()
          })
        })

        await test.step("Complete the rest of the payment process", async () => {
          await checkoutPage.selectDeliveryOption("FakeEx Standard")
          await checkoutPage.submitDeliveryOptionButton.click()
          shippingTotal =
            (await checkoutPage.cartShipping.getAttribute("data-value")) || ""
          await checkoutPage.submitPaymentButton.click()
        })

        await test.step("Make sure the giftcard still has the total as zero after selecting shipping", async () => {
          expect(await checkoutPage.cartTotal.getAttribute("data-value")).toBe(
            "0"
          )
        })

        await test.step("Finish completing the order", async () => {
          await checkoutPage.submitOrderButton.click()
          await orderPage.container.waitFor({ state: "visible" })
        })
      })
      const cartTotal = (
        Number(cartSubtotal) + Number(shippingTotal)
      ).toString()

      await test.step("Assert the order page shows the total was 0", async () => {
        expect(await orderPage.cartTotal.getAttribute("data-value")).toBe("0")
        expect(await orderPage.cartSubtotal.getAttribute("data-value")).toBe(
          cartSubtotal
        )
        expect(
          await orderPage.cartGiftCardAmount.getAttribute("data-value")
        ).toBe(cartTotal)
      })
    })
  })
})
