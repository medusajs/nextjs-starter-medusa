import { Locator, Page } from "@playwright/test"
import { AccountPage } from "./account-page"

export class OrdersPage extends AccountPage {
  ordersWrapper: Locator
  noOrdersContainer: Locator
  continueShoppingButton: Locator
  orderCard: Locator
  orderDisplayId: Locator

  constructor(page: Page) {
    super(page)
    this.ordersWrapper = page.getByTestId("orders-page-wrapper")
    this.noOrdersContainer = page.getByTestId("no-orders-container")
    this.continueShoppingButton = page.getByTestId("continue-shopping-button")
    this.orderCard = page.getByTestId("order-card")
    this.orderDisplayId = page.getByTestId("order-display-id")

    this.orderCard = page.getByTestId("order-card")
    this.orderDisplayId = page.getByTestId("order-display-id")
  }

  async getOrder(text: string) {
    const card = this.orderCard.filter({ hasText: "text" }).first()
    const items = (await card.getByTestId("order-item").all()).map(
      (orderItem) => {
        return {
          item: orderItem,
          title: orderItem.getByTestId("item-title"),
          quantity: orderItem.getByTestId("item-quantity"),
        }
      }
    )
    return {
      card,
      displayId: card.getByTestId("order-display-id"),
      createdAt: card.getByTestId("order-created-at"),
      amount: card.getByTestId("order-amount"),
      detailsLink: card.getByTestId("order-details-link"),
      items,
    }
  }

  async goto() {
    await super.goto()
    await this.ordersLink.click()
    await this.ordersWrapper.waitFor({ state: "visible" })
  }
}
