describe('Create and Delete Advertisement Flow', () => {
  beforeEach(() => {
    cy.login("test@fant.org", "password");
    cy.visit('/create-advertisement');
  });

  it('should allow a user to create, publish, and delete an advertisement', () => {
    const title = 'Test Item';

    // Fill out basic info
    cy.get('input[placeholder="Title"]').type(title);
    cy.get('textarea[placeholder="Description"]').type('This is a test item for sale');

    cy.get('select#dropdown').eq(0).select('Good - In good condition'); // condition
    cy.get('select#dropdown').eq(1).select('Clothes'); // category
    cy.get('select#dropdown').eq(2).select('Jackets');  // subcategory

    cy.get('input[placeholder="Tag"]').type('Winter');
    cy.contains('Add tag').click();

    // Upload image
    const filePath = 'images/sample-image.png';
    cy.contains('Add image').click();
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filePath}`, { force: true });

    // Price & Payment
    cy.get('input[type="number"]').clear().type('500');
    cy.contains('Allow direct sale with VIPPS').click();

    // Postal code
    cy.get('input[placeholder="Postal code"]').type('7010');
    cy.wait(2000);

    // Publish
    cy.get('button#publish-button').click();
    cy.url().should('include', '/profile');
    cy.contains(title).should('exist');

    // Click on the item
    cy.contains(title).click();

    // Wait for navigation to detail view
    cy.url().should('include', '/advertisement/');

    // Open delete popup
    cy.contains('Delete').click();

    // Confirm delete in popup
    cy.get('.popup button.delete-btn').click();

    // Back on profile and check it's gone
    cy.url().should('include', '/profile');
    cy.contains(title).should('not.exist');
  });
});
