
/// <reference types="cypress" />



/**
 * Test for deleting an activity type
 */
describe('Activity Type Delete Flow',() => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        //then login as standard user
        cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
        cy.get('input[type="password"]').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.contains('Dashboard').should('be.visible');
        cy.visit('http://localhost:5173/manage-activities');
    });


    it("deletes an activity type successfully with backend active", () => {
        cy.intercept('POST', '/api/activityType/delete').as('deleteActivityType');

        cy.get('div[data-testid^="category-"]').first().invoke('text').then((categoryName) => {
            cy.get('button[title="Remove"]').first().click();
            cy.get('button').contains('Confirm').click();

            cy.wait('@deleteActivityType').then((interception) => {
                expect(interception.request.body).to.have.property('name', categoryName);
                expect(interception.response.body.message.trim()).to.equal("ActivityType deleted successfully");
                expect(interception.response.statusCode).to.equal(200);
            });
        });
    });
});