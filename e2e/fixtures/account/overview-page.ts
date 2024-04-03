import { Locator, Page } from "@playwright/test"
import { AccountPage } from "./account-page"

export class OverviewPage extends AccountPage {
  welcomeMessage: Locator
  customerEmail: Locator
  profileCompletion: Locator
  addressesCount: Locator
  noOrdersMessage: Locator
  ordersWrapper: Locator
  orderWrapper: Locator
  overviewWrapper: Locator

  constructor(page: Page) {
    super(page)
    this.overviewWrapper = this.container.getByTestId("overview-page-wrapper")
    this.welcomeMessage = this.container.getByTestId("welcome-message")
    this.customerEmail = this.container.getByTestId("customer-email")
    this.profileCompletion = this.container.getByTestId(
      "customer-profile-completion"
    )
    this.addressesCount = this.container.getByTestId("addresses-count")
    this.noOrdersMessage = this.container.getByTestId("no-orders-message")
    this.ordersWrapper = this.container.getByTestId("orders-wrapper")
    this.orderWrapper = this.container.getByTestId("order-wrapper")
  }

  async getOrder(orderId: string) {
    const order = this.ordersWrapper.locator(
      `[data-testid="order-wrapper"][data-value="${orderId}"]`
    )
    return {
      locator: order,
      id: await order.getAttribute("value"),
      createdDate: await order.getByTestId("order-created-date"),
      displayId: await order.getByTestId("order-id").getAttribute("value"),
      amount: await order.getByTestId("order-amount").textContent(),
      openButton: order.getByTestId("open-order-button"),
    }
  }

  async goto() {
    await this.navMenu.navAccountLink.click()
    await this.container.waitFor({ state: "visible" })
  }
}
