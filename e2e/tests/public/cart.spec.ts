/*
Test List
- login from the sign in page redirects you page to the cart
*/
import { test, expect } from "../../index"
import { compareFloats, getFloatValue } from "../../utils"

test.describe("Cart tests", async () => {
  test("Ensure adding multiple items from a product page adjusts the cart accordingly", async ({
    page,
    cartPage,
    productPage,
    storePage,
  }) => {
    // Assuming we have access to our page objects here
    const cartDropdown = cartPage.cartDropdown

    await test.step("Navigate to the product page", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the small size to the cart and verify the data", async () => {
      await productPage.selectOption("S")
      await productPage.addProductButton.click()
      await expect(cartDropdown.navCartLink).toContainText("(1)")
      const cartItem = await cartDropdown.getCartItem("Sweatshirt", "S")
      await expect(cartItem.locator).toBeVisible()
      await expect(cartItem.variant).toContainText("S")
      await expect(cartItem.quantity).toContainText("1")
      await cartDropdown.goToCartButton.click()
      await cartDropdown.close()
      await cartPage.container.waitFor({ state: "visible" })
      const productInCart = await cartPage.getProduct("Sweatshirt", "S")
      await expect(productInCart.productRow).toBeVisible()
      await expect(productInCart.quantitySelect).toHaveValue("1")
      await page.goBack()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the small size to the cart again and verify the data", async () => {
      await productPage.selectOption("S")
      await productPage.addProductButton.click()
      await expect(cartDropdown.navCartLink).toContainText("(2)")
      const cartItem = await cartDropdown.getCartItem("Sweatshirt", "S")
      await expect(cartItem.locator).toBeVisible()
      await expect(cartItem.variant).toContainText("S")
      await expect(cartItem.quantity).toContainText("2")
      await cartDropdown.goToCartButton.click()
      await cartDropdown.close()
      await cartPage.container.waitFor({ state: "visible" })
      const productInCart = await cartPage.getProduct("Sweatshirt", "S")
      await expect(productInCart.productRow).toBeVisible()
      await expect(productInCart.quantitySelect).toHaveValue("2")
      await page.goBack()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the medium size to the cart and verify the data", async () => {
      await productPage.selectOption("M")
      await productPage.addProductButton.click()
      await expect(cartDropdown.navCartLink).toContainText("(3)")
      const mediumCartItem = await cartDropdown.getCartItem("Sweatshirt", "M")
      await expect(mediumCartItem.locator).toBeVisible()
      await expect(mediumCartItem.variant).toContainText("M")
      await expect(mediumCartItem.quantity).toContainText("1")
      await cartDropdown.goToCartButton.click()
      await cartDropdown.close()
      await cartPage.container.waitFor({ state: "visible" })
      const mediumProductInCart = await cartPage.getProduct("Sweatshirt", "M")
      await expect(mediumProductInCart.productRow).toBeVisible()
      await expect(mediumProductInCart.quantitySelect).toHaveValue("1")
      const smallProductInCart = await cartPage.getProduct("Sweatshirt", "S")
      await expect(smallProductInCart.productRow).toBeVisible()
      await expect(smallProductInCart.quantitySelect).toHaveValue("2")
    })
  })

  test("Ensure adding two products into the cart and verify the quantities", async ({
    cartPage,
    productPage,
    storePage,
  }) => {
    const cartDropdown = cartPage.cartDropdown

    await test.step("Navigate to the product page - go to the store page and click on the Sweatshirt product", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the small sweatshirt to the cart", async () => {
      await productPage.selectOption("S")
      await productPage.addProductButton.click()
      await expect(cartDropdown.navCartLink).toContainText("(1)")
      const sweatshirtItem = await cartDropdown.getCartItem("Sweatshirt", "S")
      await expect(sweatshirtItem.locator).toBeVisible()
      await expect(sweatshirtItem.variant).toHaveText("Variant: S")
      await expect(sweatshirtItem.quantity).toContainText("1")
      await cartDropdown.close()
    })

    await test.step("Navigate to another product - Sweatpants", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatpants")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the small sweatpants to the cart", async () => {
      await productPage.selectOption("S")
      await productPage.addProductButton.click()
      await expect(cartDropdown.navCartLink).toContainText("(2)")
      const sweatpantsItem = await cartDropdown.getCartItem("Sweatpants", "S")
      await expect(sweatpantsItem.locator).toBeVisible()
      await expect(sweatpantsItem.variant).toHaveText("Variant: S")
      await expect(sweatpantsItem.quantity).toContainText("1")
      const sweatshirtItem = await cartDropdown.getCartItem("Sweatshirt", "S")
      await expect(sweatshirtItem.locator).toBeVisible()
      await expect(sweatshirtItem.quantity).toContainText("1")
      await cartDropdown.goToCartButton.click()
      await cartDropdown.close()
      await cartPage.container.waitFor({ state: "visible" })
    })

    await test.step("Verify the quantities in the cart", async () => {
      const sweatpantsProduct = await cartPage.getProduct("Sweatpants", "S")
      await expect(sweatpantsProduct.productRow).toBeVisible()
      await expect(sweatpantsProduct.quantitySelect).toHaveValue("1")
      const sweatshirtProduct = await cartPage.getProduct("Sweatshirt", "S")
      await expect(sweatshirtProduct.productRow).toBeVisible()
      await expect(sweatshirtProduct.quantitySelect).toHaveValue("1")
    })
  })

  test("Verify the prices carries over to checkout", async ({
    cartPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to the product page - go to the store page and click on the Hoodie product", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Hoodie")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    let hoodieSmallPrice = 0
    let hoodieMediumPrice = 0
    await test.step("Add the hoodie to the cart", async () => {
      await productPage.selectOption("S")
      hoodieSmallPrice = getFloatValue(
        (await productPage.productPrice.getAttribute("data-value")) || "0"
      )
      await productPage.clickAddProduct()
      await productPage.cartDropdown.close()
      await productPage.selectOption("M")
      hoodieMediumPrice = getFloatValue(
        (await productPage.productPrice.getAttribute("data-value")) || "0"
      )
      await productPage.clickAddProduct()

      await productPage.cartDropdown.close()
    })

    await test.step("Navigate to another product - Longsleeve", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Longsleeve")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    let longsleeveSmallPrice = 0
    await test.step("Add the small longsleeve to the cart", async () => {
      await productPage.selectOption("S")
      longsleeveSmallPrice = getFloatValue(
        (await productPage.productPrice.getAttribute("data-value")) || "0"
      )
      await productPage.clickAddProduct()
      await productPage.cartDropdown.close()
      await productPage.selectOption("S")
      await productPage.clickAddProduct()
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
        3 * longsleeveSmallPrice + hoodieSmallPrice + hoodieMediumPrice
      expect(compareFloats(total, calculatedTotal)).toBe(0)
    })
  })
})
