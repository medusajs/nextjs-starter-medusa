import { Locator, Page } from "@playwright/test"

export class CartDropdown {
  page: Page
  navCartLink: Locator
  cartDropdown: Locator
  cartSubtotal: Locator
  goToCartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.navCartLink = page.getByTestId("nav-cart-link")
    this.cartDropdown = page.getByTestId("nav-cart-dropdown")
    this.cartSubtotal = this.cartDropdown.getByTestId("cart-subtotal")
    this.goToCartButton = this.cartDropdown.getByTestId("go-to-cart-button")
  }

  async displayCart() {
    await this.navCartLink.hover()
  }

  async getCartItem(name: string) {
    const cartItem = this.cartDropdown.getByTestId("cart-item").filter({
      hasText: name,
    })
    const quantity = cartItem
      .getByTestId("cart-item-quantity")
      .getAttribute("data-value")
    const variant = cartItem
      .getByTestId("cart-item-variant")
      .getAttribute("data-value")
    return {
      locator: cartItem,
      productLink: cartItem.getByTestId("product-link"),
      removeButton: cartItem.getByTestId("cart-item-remove-button"),
      name,
      quantity,
      variant,
    }
  }
}
