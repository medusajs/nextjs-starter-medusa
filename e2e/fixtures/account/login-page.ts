import { Locator, Page } from "@playwright/test"
import { BasePage } from "../base/base-page"

export class LoginPage extends BasePage {
  container: Locator
  emailInput: Locator
  passwordInput: Locator
  signInButton: Locator
  registerButton: Locator
  errorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.getByTestId("login-page")
    this.emailInput = this.container.getByTestId("email-input")
    this.passwordInput = this.container.getByTestId("password-input")
    this.signInButton = this.container.getByTestId("sign-in-button")
    this.registerButton = this.container.getByTestId("register-button")
    this.errorMessage = this.container.getByTestId("login-error-message")
  }

  async goto() {
    await this.page.goto("/account")
    await this.container.waitFor({ state: "visible" })
  }
}
