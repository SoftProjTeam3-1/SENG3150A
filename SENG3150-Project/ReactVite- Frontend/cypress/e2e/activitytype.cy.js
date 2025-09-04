
/// <reference types="cypress" />

describe('Activity Type Create Flow',() => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/manage-activities'); // adjust if route differs
    });

    it('creates a new activity type succesfully with backend active', () => {
        const categoryName = 'E2E Category';

        cy.intercept('POST', '/api/activityType/create').as('createActivtyType');

        cy.get('input[placeholder="Enter New Category Name"]').type(categoryName);
        cy.get('button[type="submit"]').click();

        cy.wait('@createActivtyType').then((interception) => {
            expect(interception.request.body).to.deep.equal({ 
                name: categoryName, 
                description: '' 
            });
            expect(interception.response.body).to.have.property('message', "ActivityType created successfully");
            expect(interception.response.statusCode).to.equal(200);
        });
    });
});