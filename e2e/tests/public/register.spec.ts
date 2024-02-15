import { test, expect } from "../../index"

test.describe("User registration functionality", async () => {
  test("registration with existing user shows error message", async ({
    loginPage,
    registerPage,
  }) => {
    await loginPage.accountLink.click()
    await registerPage.container.isVisible()
    await loginPage.registerButton.click()

    await registerPage.firstNameInput.fill("first")
    await registerPage.lastNameInput.fill("last")
    await registerPage.emailInput.fill("test@example.com")
    await registerPage.passwordInput.fill("password")
    await registerPage.registerButton.click()

    await expect(registerPage.registerError).toBeVisible()
  })

  test("registration with empty form data highlights corresponding input", async ({
    accountOverviewPage,
    loginPage,
    registerPage,
  }) => {
    await loginPage.accountLink.click()
    await registerPage.container.isVisible()
    await loginPage.registerButton.click()

    await registerPage.registerButton.click()
    await expect(registerPage.firstNameInput).toBeFocused()
    await registerPage.firstNameInput.fill("first")

    await registerPage.registerButton.click()
    await expect(registerPage.lastNameInput).toBeFocused()
    await registerPage.lastNameInput.fill("last")

    await registerPage.registerButton.click()
    await expect(registerPage.emailInput).toBeFocused()
    await registerPage.emailInput.fill("test-reg-new@example.com")

    await registerPage.registerButton.click()
    await expect(registerPage.passwordInput).toBeFocused()
    await registerPage.passwordInput.fill("password")

    await registerPage.registerButton.click()
    await expect(accountOverviewPage.welcomeMessage).toBeVisible()
  })

  test("successful registration and navigation to account overview", async ({
    loginPage,
    registerPage,
    accountOverviewPage,
  }) => {
    await loginPage.accountLink.click()
    await registerPage.container.isVisible()
    await loginPage.registerButton.click()

    await registerPage.firstNameInput.fill("first")
    await registerPage.lastNameInput.fill("last")
    await registerPage.emailInput.fill("test-reg@example.com")
    await registerPage.passwordInput.fill("password")
    await registerPage.registerButton.click()

    await expect(accountOverviewPage.welcomeMessage).toBeVisible()
  })
})
