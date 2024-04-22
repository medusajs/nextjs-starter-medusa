import { Locator, Page } from "@playwright/test"
import { BasePage } from "./base/base-page"

export class CartPage extends BasePage {
  container: Locator
  emptyCartMessage: Locator
  signInButton: Locator
  productRow: Locator
  productTitle: Locator
  productVariant: Locator
  productDeleteButton: Locator
  productQuantitySelect: Locator
  discountButton: Locator
  discountInput: Locator
  discountApplyButton: Locator
  discountErrorMessage: Locator
  discountRow: Locator
  giftCardRow: Locator
  giftCardCode: Locator
  giftCardAmount: Locator
  giftCardRemoveButton: Locator
  cartSubtotal: Locator
  cartDiscount: Locator
  cartGiftCardAmount: Locator
  cartShipping: Locator
  cartTaxes: Locator
  cartTotal: Locator
  checkoutButton: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.getByTestId("cart-container")
    this.emptyCartMessage = this.container.getByTestId("empty-cart-message")
    this.signInButton = this.container.getByTestId("sign-in-button")
    this.productRow = this.container.getByTestId("product-row")
    this.productTitle = this.container.getByTestId("product-title")
    this.productVariant = this.container.getByTestId("product-variant")
    this.productDeleteButton = this.container.getByTestId(
      "product-delete-button"
    )
    this.productQuantitySelect = this.container.getByTestId(
      "product-quantity-select"
    )
    this.checkoutButton = this.container.getByTestId("checkout-button")
    this.discountButton = this.container.getByTestId("add-discount-button")
    this.discountInput = this.container.getByTestId("discount-input")
    this.discountApplyButton = this.container.getByTestId(
      "discount-apply-button"
    )
    this.discountErrorMessage = this.container.getByTestId(
      "discount-error-message"
    )
    this.discountRow = this.container.getByTestId("discount-row")
    this.giftCardRow = this.container.getByTestId("gift-card")
    this.giftCardCode = this.container.getByTestId("gift-card-code")
    this.giftCardAmount = this.container.getByTestId("gift-card-amount")
    this.giftCardRemoveButton = this.container.getByTestId(
      "remove-gift-card-button"
    )
    this.cartSubtotal = this.container.getByTestId("cart-subtotal")
    this.cartDiscount = this.container.getByTestId("cart-discount")
    this.cartGiftCardAmount = this.container.getByTestId(
      "cart-gift-card-amount"
    )
    this.cartShipping = this.container.getByTestId("cart-shipping")
    this.cartTaxes = this.container.getByTestId("cart-taxes")
    this.cartTotal = this.container.getByTestId("cart-total")
  }

  async getProduct(title: string, variant: string) {
    const productRow = this.productRow
      .filter({
        hasText: title,
      })
      .filter({
        hasText: `Variant: ${variant}`,
      })
    return {
      productRow,
      title: productRow.getByTestId("product-title"),
      variant: productRow.getByTestId("product-variant"),
      deleteButton: productRow.getByTestId("delete-button"),
      quantitySelect: productRow.getByTestId("product-select-button"),
      price: productRow.getByTestId("product-unit-price"),
      total: productRow.getByTestId("product-price"),
    }
  }

  async getGiftCard(code: string) {
    const giftCardRow = this.giftCardRow.filter({
      hasText: code,
    })
    const amount = giftCardRow.getByTestId("gift-card-amount")
    return {
      locator: giftCardRow,
      code: giftCardRow.getByTestId("gift-card-code"),
      amount,
      amountValue: await amount.getAttribute("data-value"),
      removeButton: giftCardRow.getByTestId("remove-gift-card-button"),
    }
  }

  async getDiscount(code: string) {
    const discount = this.discountRow
    const amount = discount.getByTestId("discount-amount")
    return {
      locator: discount,
      code: discount.getByTestId("discount-code"),
      amount,
      amountValue: await amount.getAttribute("data-value"),
      removeButton: discount.getByTestId("remove-discount-button"),
    }
  }

  async goto() {
    await this.cartLink.click({ clickCount: 2 })
    await this.container.waitFor({ state: "visible" })
  }
}
