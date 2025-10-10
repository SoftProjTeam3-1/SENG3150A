/// <reference types="cypress" />

describe("Activity Delete Flow", () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        //then login as standard user
        cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
        cy.get('input[type="password"]').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.contains('Dashboard').should('be.visible');
        cy.visit('http://localhost:5173/manage-activities');
    });

    it("deletes an existing activity with the backend active", () => {
        //intercept delete hook
        cy.intercept('POST', '/api/activity/delete').as('deleteActivity');        
        
        //click delete buttons on the first activity in the first category
        cy.get('li').first().within(() => {
            cy.get('button[title="Remove"]').click();
        });
            
        cy.get('button:contains("Confirm")').first().click({ force: true });

        cy.wait('@deleteActivity').then((interception) => {
            expect(interception.response.body).to.have.property('message', "Activity deleted successfully");
            expect(interception.response.statusCode).to.equal(200);
        });
    });
});