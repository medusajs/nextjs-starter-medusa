describe("Product page", () => {
  it("fetches product with handle [t-shirt]", () => {
    cy.visit("/products/t-shirt")

    cy.get("h1").contains("Medusa T-Shirt")
  })

  it("adds a product to the cart", () => {
    cy.visit("/products/t-shirt")

    cy.get("button").click()

    cy.get("[data-cy=cart_quantity]").contains("1")
  })

  it("adds a product twice to the cart", () => {
    cy.visit("/products/t-shirt")

    cy.get("button").click()
    cy.get("button").click()

    cy.get("[data-cy=cart_quantity]").contains("2")
  })

  it("changes the current image by clicking a thumbnail", () => {
    cy.visit("/products/t-shirt")

    cy.get("[data-cy=current_image]")
      .should("have.attr", "src")
      .and("match", /.+(tee\-black\-front).+/)

    cy.get("[data-cy=product_image_2]").click()

    cy.get("[data-cy=current_image]")
      .should("have.attr", "src")
      .and("match", /.+(tee\-black\-back).+/)
  })
})
