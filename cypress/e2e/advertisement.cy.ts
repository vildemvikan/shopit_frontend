describe('Advertisement Details View', () => {
  it('should display all necessary advertisement details correctly', () => {
    const advertisementId = 1

    cy.visit(`/advertisement/${advertisementId}`)
    cy.get('.display-image').should('exist')
    cy.get('.title').should('not.be.empty')
    cy.get('.price').should('exist')
    cy.contains('Description').should('exist')

    cy.get('#category').should('have.length', 1)

    cy.get('.condition-label').should('exist')
    cy.get('.tag').should('have.length.gte', 1)

    cy.get('.seller-name').should('exist')
  })
})
