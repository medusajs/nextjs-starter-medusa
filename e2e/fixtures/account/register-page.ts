import { Locator, Page } from "@playwright/test"
import { BasePage } from "../base/base-page"

export class RegisterPage extends BasePage {
  container: Locator
  firstNameInput: Locator
  lastNameInput: Locator
  emailInput: Locator
  phoneInput: Locator
  passwordInput: Locator
  registerButton: Locator
  registerError: Locator
  loginLink: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.getByTestId("register-page")
    this.firstNameInput = this.container.getByTestId("first-name-input")
    this.lastNameInput = this.container.getByTestId("last-name-input")
    this.emailInput = this.container.getByTestId("email-input")
    this.phoneInput = this.container.getByTestId("phone-input")
    this.passwordInput = this.container.getByTestId("password-input")
    this.registerButton = this.container.getByTestId("register-button")
    this.registerError = this.container.getByTestId("register-error")
    this.loginLink = this.container.getByTestId("login-link")
  }
}
