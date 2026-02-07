describe('BookDetails', () => {
  it('should go to the home page, because there is no book in the parameters', () => {
    cy.visit("http://localhost:5173/book-details")
    cy.location("pathname").should("eq", "http://localhost:5173/")
  })
})