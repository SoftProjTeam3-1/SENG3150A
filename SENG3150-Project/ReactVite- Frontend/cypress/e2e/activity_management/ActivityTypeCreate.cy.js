/// <reference types="cypress" />

/**
 * Test for creating a new activity type
 */
describe('Activity Type Create Flow',() => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        //then login as standard user
        cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
        cy.get('input[type="password"]').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.contains('Dashboard').should('be.visible');
        cy.visit('http://localhost:5173/manage-activities');
    });


    it('creates a new activity type succesfully with backend active', () => {
        cy.intercept('POST', '/api/activityType/create').as('createActivityType');

        cy.get('[data-testid="categoryNameInput"]')
        .then($input => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
            ).set;
            nativeInputValueSetter.call($input[0], 'E2E Category');

            $input[0].dispatchEvent(new Event('input', { bubbles: true }));
        });

        cy.get('button[type="submit"]').click();

        cy.wait('@createActivityType').then((interception) => {
            expect(interception.request.body).to.include({ 
                name: 'E2E Category', 
                description: ''
            });
    
            expect(interception.response.body).to.have.property('message', "ActivityType created successfully");
            expect(interception.response.statusCode).to.equal(200);
        });
    });
});