describe('User Profile Info', () => {
  beforeEach(() => {
    cy.login("test@fant.org","password")
    cy.visit('/profile')
  })

  it('should display profile information correctly', () => {
    cy.contains('Your user information')
    cy.get('.input-box').contains('Test')
    cy.get('.input-box').contains('User')
    cy.get('.input-box').contains('@')
    cy.get('#profile-picture .image').should('exist')
  })
})
