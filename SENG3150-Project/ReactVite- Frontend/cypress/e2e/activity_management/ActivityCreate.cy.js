/// <reference types="cypress" />

describe("Activity Create Flow", () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        //then login as standard user
        cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
        cy.get('input[type="password"]').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.contains('Dashboard').should('be.visible');
        cy.visit('http://localhost:5173/manage-activities');
    });

    it("creates a new activity with the backend active", () => {
        // declare example variables
        // name, description, duration, people required, activityType{name, description}
        const activityName = "E2E Activity";
        const activityDescription = "This is an activity created during E2E testing.";
        const activityDuration = "15";
        const activityPeopleRequired = "5";
        const activityTypeDescription = null;

        // intercept post request
        cy.intercept('POST', '/api/activity/create').as('createActivity');

        cy.get('span#categoryName').first().invoke('text').then((categoryName) => {
            //type in input fields
            //submit the form
            cy.contains('button', "Add Activity").first().click();

            cy.get('input[placeholder="Enter activity name"]').type(activityName);
            cy.get('textarea[placeholder="Enter activity description"]').type(activityDescription);
            cy.get('input[placeholder="Enter the number of people required"]').type(activityPeopleRequired);
            cy.get('input[placeholder="Enter time in minutes"]').type(activityDuration);
            cy.get('button#addActivitySubmitButton').click();
            
            //wait for post request and assert response and requests
            cy.wait('@createActivity').then((interception) => {
                expect(interception.request.body).to.include({
                    name: activityName,
                    description: activityDescription,
                    duration: activityDuration,
                    peopleRequired: activityPeopleRequired,
                });

                expect(interception.request.body.activityType).to.deep.include({
                    name: categoryName,
                    description: null
                });

                expect(interception.response.body).to.have.property('message', "Activity created successfully");
                expect(interception.response.statusCode).to.equal(200);
            });
        });
    });
});