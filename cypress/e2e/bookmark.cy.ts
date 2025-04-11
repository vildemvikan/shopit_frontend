describe('Bookmark Flow', () => {
  beforeEach(() => {
    cy.login("test@fant.org", "password");
  });

  it('can bookmark, view, and remove an advertisement', () => {
    // Step 1: Go to search page
    cy.visit('/search');

    // Step 2: Bookmark the first ad
    cy.get('[alt="bookmark"]').first().click();

    // Step 3: Go to bookmarks page
    cy.visit('/bookmarks');

    // Step 4: Verify it's bookmarked
    cy.get('.advertisement').should('have.length.at.least', 1);

    // Optional: Store title for later check
    cy.get('.advertisement h3').first().invoke('text').as('bookmarkTitle');

    // Step 5: Remove the bookmark
    cy.get('[alt="bookmark"]').first().click();

    cy.visit('/bookmarks');

    cy.get('.advertisement').should('have.length.at.least', 0);


  });
});
