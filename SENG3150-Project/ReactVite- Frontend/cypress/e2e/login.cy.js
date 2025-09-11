/// <reference types="cypress" />

describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/');
    });


    it('logs in successfully with valid credentials with backend active', () => {

        cy.get('#email').type('stuart.mendes@gmail.com');
        cy.get('#password').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
    })

    it('logs in successfully with valid credentials with backend stub', () => {

        cy.intercept('POST', '**/api/user/login', {
            statusCode: 200,
            body: JSON.stringify({ response: true })
        }).as('login');

        cy.get('#email').type('stuart.mendes@gmail.com');
        cy.get('#password').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.wait('@login');
        cy.url().should('include', '/dashboard');
    })

    it('logs in unsuccessfully with invalid credentials with backend stub', () => {

        cy.intercept('POST', '**/api/user/login', {
            statusCode: 401,
            body: JSON.stringify({ response: false })
        }).as('login');

        cy.get('#email').type('stuart.mendes@gmail.com');
        cy.get('#password').type('WrongPass1!');
        cy.get('button[type="submit"]').click();
        cy.wait('@login');
        cy.get('.Toastify__toast--error').should('be.visible');
        cy.url().should('include', '/');
    })

})