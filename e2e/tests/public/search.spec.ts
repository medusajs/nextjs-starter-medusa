import { test, expect } from "../../index"

test.describe("Search tests", async () => {
  test("Searching for a specific product returns the correct product page", async ({
    productPage,
  }) => {
    const searchModal = productPage.searchModal
    await searchModal.open()
    await searchModal.searchInput.fill("Sweatshirt")
    await searchModal.searchResult
      .filter({ hasText: "Sweatshirt" })
      .first()
      .click()
    await productPage.container.waitFor({ state: "visible" })
    await expect(productPage.productTitle).toContainText("Sweatshirt")
  })

  test("An erroneous search returns an empty result", async ({
    productPage,
  }) => {
    const searchModal = productPage.searchModal
    await searchModal.open()
    await searchModal.searchInput.fill("Does Not Sweatshirt")
    await expect(searchModal.noSearchResultsContainer).toBeVisible()
  })

  test("User can search after an empty search result", async ({
    productPage,
  }) => {
    const searchModal = productPage.searchModal

    await searchModal.open()
    await searchModal.searchInput.fill("Does Not Sweatshirt")
    await expect(searchModal.noSearchResultsContainer).toBeVisible()

    await searchModal.searchInput.fill("Sweat")
    await expect(searchModal.searchResults).toBeVisible()
    await expect(searchModal.searchResult.first()).toBeVisible()
  })

  test("Closing the search page returns user back to their current page", async ({
    storePage,
    productPage,
    loginPage,
  }) => {
    const searchModal = storePage.searchModal
    await test.step("Navigate to the store page and open and close search modal", async () => {
      await storePage.goto()
      await searchModal.open()
      await searchModal.close()
      await expect(storePage.container).toBeVisible()
    })

    await test.step("Navigate to the product page and open and close search modal", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
      await searchModal.open()
      await searchModal.close()
      await expect(productPage.container).toBeVisible()
    })

    await test.step("Navigate to the login page and open and close search modal", async () => {
      await loginPage.goto()
      await searchModal.open()
      await searchModal.close()
      await expect(loginPage.container).toBeVisible()
    })
  })
})
