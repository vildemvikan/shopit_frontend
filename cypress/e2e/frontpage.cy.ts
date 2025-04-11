describe('Front Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the search input and button', () => {
    cy.get('input[placeholder="Search for anything ..."]').should('exist');
    cy.get('button').contains(/search/i).should('exist');
  });

  it('should search when clicking the search button with input text', () => {
    cy.get('input[placeholder="Search for anything ..."]').type('bike');
    cy.get('button').contains(/search/i).click();

    cy.url().should('include', '/search');
    cy.url().should('include', 'search=bike');
  });

  it('should show popular categories and click one', () => {
    cy.get('.categories .category')
      .should('have.length.greaterThan', 0)
      .eq(2)
      .click();

    cy.url().should('include', '/search');
    cy.url().should('include', 'category=');
  });

  it('should show newest advertisements', () => {
    cy.get('.advertisements .new-advertisement')
      .should('have.length.greaterThan', 0);
  });
});
