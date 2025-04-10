describe('Search View', () => {
  beforeEach(() => {
    cy.visit('/search');
  });

  it('should load search results with no filters', () => {
    cy.get('.result').should('exist');
  });

  it('should update results when using the keyword search', () => {
    cy.get('input[placeholder="Search for anything ..."]').type('bike');
    cy.get('[data-cy="simple-search-button"]').click();

    cy.url().should('include', 'search=bike');
    cy.get('.result').should('exist');
  });

  it('should filter by category', () => {
    // Expand a category with results
    cy.get('.category-option:not(.disabled)').first().click();
    cy.url().should('include', 'category=');
    cy.get('.result').should('exist');
  });

  it('should apply price filter', () => {
    cy.get('#min-price').type('10');
    cy.get('#max-price').type('1000');
    cy.contains('button', /search/i).click();

    cy.url().should('include', 'minPrice=10');
    cy.url().should('include', 'maxPrice=1000');
    cy.get('.result').should('exist');
  });

  it('should change display mode', () => {
    cy.get('#view-option').click();
    cy.get('#list-display').should('exist');
  });

  it('should change sort order', () => {
    cy.get('#filter-dropdown').select('Date: Oldest to Newest');
    cy.url().should('include', 'sortBy=2');
    cy.get('.result').should('exist');
  });

  it('should paginate if multiple pages exist', () => {
    cy.get('.pagination-box').scrollIntoView();
    cy.get('.pagination-box button').contains('2').click();
    cy.get('.result').should('exist');
  });

  it('should navigate to an advertisement detail when clicked', () => {
    cy.get('.result').first().click();
    cy.url().should('include', '/advertisement/');
  });
});
