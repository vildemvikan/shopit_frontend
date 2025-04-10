describe('User Registration Flow', () => {
  it('should register a new user successfully', () => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const email = `test${randomSuffix}@test.com`;
    const password = 'Test1234!';

    cy.visit('/auth/signup');

    cy.get('input[placeholder="First name"]').type('Test');
    cy.get('input[placeholder="Last name"]').type('User');
    cy.get('input[placeholder="Email address"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('input[placeholder="Confirm password"]').type(password);

    cy.contains('Register account').click();

    // Success message then redirect
    cy.url().should('include', '/login');
  });
});


describe('User Login Flow', () => {
  it('should log in a valid user', () => {
    const email = 'test@fant.org'; // Replace with a real test account
    const password = 'password';

    cy.visit('/auth/login');

    cy.get('input[placeholder="Email address"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.contains('button', 'Sign in').click();

    cy.url().should('include', '/'); // or your authenticated route
  });

  it('should show error on wrong credentials', () => {
    cy.visit('/auth/login');

    cy.get('input[placeholder="Email address"]').type('wrong@example.com');
    cy.get('input[placeholder="Password"]').type('wrongpass');
    cy.contains('button', 'Sign in').click();

    cy.contains('The email address or password you entered is incorrect').should('exist');
  });
});
