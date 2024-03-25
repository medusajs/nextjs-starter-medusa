import { test as setup } from "@playwright/test"
import { seedData } from "../../data/seed"
import { OverviewPage as AccountOverviewPage } from "../../fixtures/account/overview-page"
import { LoginPage } from "../../fixtures/account/login-page"
import { STORAGE_STATE } from "../../../playwright.config"

setup(
  "Seed data and create session for authenticated user",
  async ({ page }) => {
    const seed = await seedData()
    const user = seed.user

    const loginPage = new LoginPage(page)
    const accountPage = new AccountOverviewPage(page)
    await loginPage.goto()
    await loginPage.emailInput.fill(user?.email!)
    await loginPage.passwordInput.fill(user?.password!)
    await loginPage.signInButton.click()
    await accountPage.welcomeMessage.waitFor({ state: "visible" })

    await page.context().storageState({
      path: STORAGE_STATE,
    })
  }
)
