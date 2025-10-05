/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Security - injection inputs treated as data', () => {
  it('login rejects SQL-injection-like credentials (stubbed 401)', () => {
    cy.visit('/');

    const inj = "' OR '1'='1";

    cy.intercept('POST', '**/api/user/login', (req) => {
      // Ensure UI sends the payload verbatim as JSON
      expect(req.body).to.have.property('email').and.include(inj);
      expect(req.body).to.have.property('password', inj);
      req.reply({ statusCode: 401, body: JSON.stringify({ detail: 'Invalid email or password' }) });
    }).as('login');

    cy.get('#email').type(`attacker${inj}@example.com`);
    cy.get('#password').type(inj);
    cy.get('button[type="submit"]').click();

    cy.wait('@login');
    cy.get('.Toastify__toast--error').should('be.visible');
    cy.location('pathname').should('not.include', '/dashboard');
  });

  it('register accepts suspicious strings as plain text and succeeds (stubbed 200)', () => {
    cy.clock();
    cy.visit('/register');

    const injName = "Robert'); DROP TABLE users;--";

    cy.intercept('POST', '**/api/user/register', (req) => {
      // Assert raw payload is sent (no client-side SQL parsing)
      expect(req.body).to.have.property('firstName', injName);
      expect(req.body).to.have.property('surname', "O'Connor");
      expect(req.body).to.have.property('email').and.include(injName);
      expect(req.body).to.have.property('password', 'Abcdefg!');
      // Backend shape for this app expects a string body JSON.parse()-able
      req.reply({ statusCode: 200, body: JSON.stringify({ response: true, message: 'ok' }) });
    }).as('register');

    cy.get('#firstName').type(injName);
    cy.get('#surname').type("O'Connor");
    cy.get('#email').type(`test${injName}@example.com`);
    cy.get('#password').type('Abcdefg!');
    cy.get('#password2').type('Abcdefg!');
    cy.get('button[type="submit"]').click();

    cy.wait('@register');
    cy.get('.Toastify__toast--success').should('be.visible');
    // Component redirects after a short delay
    cy.tick(2000);
    cy.location('pathname').should('include', '/dashboard');
  });

  it('register with script-like input stays safe (no DOM execution, stubbed 200)', () => {
    cy.clock();
    cy.visit('/register');

    const scriptStr = "<script>alert('xss')</script>";

    cy.intercept('POST', '**/api/user/register', (req) => {
      expect(req.body.email).to.include('xss');
      req.reply({ statusCode: 200, body: JSON.stringify({ response: true }) });
    }).as('register');

    cy.get('#firstName').type('Alice');
    cy.get('#surname').type('Tester');
    cy.get('#email').type(`alice+${scriptStr}@mail.com`);
    cy.get('#password').type('Abcdefg!');
    cy.get('#password2').type('Abcdefg!');
    cy.get('button[type="submit"]').click();

    cy.wait('@register');
    cy.get('.Toastify__toast--success').should('be.visible');
    cy.tick(2000);
    cy.location('pathname').should('include', '/dashboard');
  });
});
