
/// <reference types="cypress" />

/**
 * Test for creating a new activity type
 */
describe('Activity Type Create Flow',() => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/manage-activities');
    });


    it('creates a new activity type succesfully with backend active', () => {
        const categoryName = 'E2E Category';

        cy.intercept('POST', '/api/activityType/create').as('createActivityType');

        cy.get('input[placeholder="Enter New Category Name"]').clear().type(categoryName);
        cy.get('button[type="submit"]').click();

        cy.wait('@createActivityType').then((interception) => {
            expect(interception.request.body).to.include({ 
                name: categoryName, 
                description: ''
            });
            expect(interception.response.body).to.have.property('message', "ActivityType created successfully");
            expect(interception.response.statusCode).to.equal(200);
        });
    });
});

/**
 * Test for deleting an activity type
 */
describe('Activity Type Delete Flow',() => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/manage-activities');
    })


    it("deletes an activity type successfully with backend active", () => {
        cy.intercept('POST', '/api/activityType/delete').as('deleteActivityType');

        cy.get('span#categoryName').first().invoke('text').then((categoryName) => {
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