describe('Edit Advertisement Flow', () => {
  beforeEach(() => {
    cy.login('test@fant.org', 'password');
    cy.visit('/profile');
  });

  it('should allow a user to edit an existing advertisement', () => {
    const updatedTitle = 'Updated Test Item';
    const updatedDescription = 'Updated description for test item.';

    // Click the first advertisement preview
    cy.get('.advertisement').eq(1).click();

    cy.url().should('include', '/advertisement/');

    // Click the Edit button
    cy.contains('Edit').click();

    cy.get('input[placeholder="Title"]').clear().type(updatedTitle);
    cy.get('textarea[placeholder="Description"]').clear().type(updatedDescription);

    cy.get('button#edit-button').click();
    cy.wait(4000)
    cy.url().should('include', '/advertisement/');

    // Confirm updated info is visible
    cy.contains(updatedTitle).should('exist');
    cy.contains(updatedDescription).should('exist');
  });
});
