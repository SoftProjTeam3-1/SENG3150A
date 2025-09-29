/// <reference types="cypress" />

describe("Test Coverage", () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        //then login as standard user
        cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
        cy.get('input[type="password"]').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.contains('Dashboard').should('be.visible');
        cy.visit('http://localhost:5173/manage-activities');
    });

    //TODO Test for coverage
    describe("Activity Update Coverage", () => {
        it("covers all fields in the update process", () => {
            // Click on the first activity to open the edit form
            cy.get('li').first().click();
        });
    });

});