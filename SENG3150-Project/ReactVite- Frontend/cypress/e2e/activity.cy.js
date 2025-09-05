/// <reference types="cypress" />

describe("Activity Create Flow", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173/manage-activities");
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

describe("Activity Update Flow", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173/manage-activities");
    });

    it("updates an existing activity with the backend active", () => {
        const activityNameChanged = "E2E Activity- edited";
        const activityDescriptionChanged = "This is an activity created during E2E testing -edited";
        const activityDurationChanged = "20";
        const activityPeopleRequiredChanged = "6";
        const activityTypeDescriptionChanged = null;

        cy.intercept('POST', '/api/activity/update').as('updateActivity');

        cy.get('span#categoryName').first().invoke('text').then((categoryName) => {
            //click on activity to edit it
            cy.get('li').first().click();

            //type in input fields 
            cy.get('input[placeholder="Enter activity name"]').type(activityNameChanged);
            cy.get('textarea[placeholder="Enter activity description"]').type(activityDescriptionChanged);
            cy.get('input[placeholder="Enter the number of people required"]').type(activityPeopleRequiredChanged);
            cy.get('input[placeholder="Enter time in minutes"]').type(activityDurationChanged);
            //submit the form
            cy.contains('button', "Save").click();

            //wait for post request and assert response and requests
            cy.wait('@updateActivity').then((interception) => {
                expect(interception.request.body).to.include({
                    name: activityNameChanged,
                    description: activityDescriptionChanged,
                    duration: activityDurationChanged,
                    peopleRequired: activityPeopleRequiredChanged,
                });

                expect(interception.request.body.activityType).to.deep.include({
                    name: categoryName,
                    description: null
                });

                expect(interception.response.body).to.have.property('message', "Activity updated successfully");
                expect(interception.response.statusCode).to.equal(200);
            });
        });

    });
});