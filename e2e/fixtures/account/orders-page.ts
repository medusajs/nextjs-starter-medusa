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

  async getOrderById(orderId: string) {
    const orderIdLocator = this.page
      .getByTestId("order-display-id")
      .filter({
        hasText: orderId,
      })
      .first()
    const card = this.orderCard.filter({ has: orderIdLocator }).first()
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
      orderId: card.getByTestId("order-display-id"),
      amount: card.getByTestId("order-amount"),
      detailsLink: card.getByTestId("order-details-link"),
      itemsLocator: card.getByTestId("order-item"),
      items,
    }
  }

  async goto() {
    await super.goto()
    await this.ordersLink.click()
    await this.ordersWrapper.waitFor({ state: "visible" })
  }
}
