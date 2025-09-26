/// <reference types="cypress" />

describe("Activity Update Flow", () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        //then login as standard user
        cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
        cy.get('input[type="password"]').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.contains('Dashboard').should('be.visible');
        cy.visit('http://localhost:5173/manage-activities');
    });

    it("updates an existing activity with the backend active", () => {
        const activityNameChanged = "E2E Activity- edited";
        const activityDescriptionChanged = "This is an activity created during E2E testing -edited";
        const activityDurationChanged = "20";
        const activityPeopleRequiredChanged = "6";
        const activityTypeDescriptionChanged = '';

        cy.intercept('POST', '/api/activity/update').as('updateActivity');

        cy.get('div[data-testid^="category-"]').first().invoke('text').then((categoryName) => {
            //click on activity to edit it
            cy.get('li').first().click();

            //type in input fields 
            cy.get('input[placeholder="Enter activity name"]').clear().type(activityNameChanged);
            cy.get('textarea[placeholder="Enter activity description"]').clear().type(activityDescriptionChanged);
            cy.get('input[placeholder="Enter the number of people required"]').clear().type(activityPeopleRequiredChanged);
            cy.get('input[placeholder="Enter time in minutes"]').type(activityDurationChanged);
            //submit the form
            cy.contains('button', "Save").click();

            //wait for post request and assert response and requests
            cy.wait('@updateActivity').then((interception) => {
                expect(interception.request.body.changedActivity).to.include({
                    name: activityNameChanged,
                    description: activityDescriptionChanged,
                    duration: activityDurationChanged+"mins",
                    peopleRequired: activityPeopleRequiredChanged,
                });

                expect(interception.request.body.changedActivity.activityType).to.deep.include({
                    name: categoryName,
                    description: null
                });

                expect(interception.response.body).to.have.property('message', "Activity updated successfully");
                expect(interception.response.statusCode).to.equal(200);
            });
        });

    });
});