import { MailSlurp } from 'mailslurp-client';

describe('Reset Password Flow', () => {
    const apiKey = 'f52c5d5d7a333551087dd13d6978c6d5c336054fec0711740ad095b038a6ed38';
    const inboxId = '59cf25eb-83f8-429e-bbb5-73c136d6c0c2';
    beforeEach(() => {
        cy.visit('http://localhost:5173/forget-password'); // adjust if route differs
        // Delete mailslurp emails
        cy.mailslurp({ apiKey }).then((mailslurp) => {
            // Empty the inbox before each test
            return mailslurp.emptyInbox(inboxId);
        });
    });

    afterEach(() => {
        // Clean up inbox
        cy.mailslurp({
            apiKey: apiKey,
            inboxId: inboxId
        }).then(function (mailslurp) {
            mailslurp.emptyInbox(inboxId);
        });
    });

    // Test NewPassword invalid
    it('Should show error for invalid new password', function () {
        cy.get('input[type="email"]').type('dannydavino6@gmail.com');
        cy.get('button[type="submit"]').click();

        // Wait for the success message
        cy.contains('Sending...').should('be.visible');
        cy.wait(3000); // wait for 3 seconds to simulate email sending delay
        cy.contains('Password reset code sent').should('be.visible');

        // Use a Cypress task to fetch the email from MailSlurp in the Node context
        cy.mailslurp({
            apiKey: apiKey,
            inboxId: inboxId
        }).then(function (mailslurp) {
            return mailslurp.waitForLatestEmail(inboxId, 60000, true);
        }).then(function (email) {
            expect(email).to.exist;
            expect(email.body).contains('Your password reset code is:');
            cy.log(email.body);
            const code = email.body.match(/Your password reset code is:\s*(\d{4})/)[1];
            if (code) {
                cy.log(`Code is ${code}`);
                // Enter the code and submit
                cy.get('input[type="text"]').type(code);
                cy.get('button[type="submit"]').click();
                cy.contains('Code verified successfully.').should('be.visible');
            } else {
                throw new Error('Reset code not found in email body');
            }
        });

        // Enter invalid new password
        cy.get('input[name="password"]').type('short');

        // Submit should be disabled
        cy.get('button[type="submit"]').should('be.disabled');
    });

    // Test entering wrong code
    it('Should show error for wrong code', function () {
        cy.get('input[type="email"]').type('dannydavino6@gmail.com');
        cy.get('button[type="submit"]').click();

        // Wait for the success message
        cy.contains('Sending...').should('be.visible');
        cy.wait(3000); // wait for 3 seconds to simulate email sending delay
        cy.contains('Password reset code sent').should('be.visible');

        // enter 0000 as wrong code
        cy.get('input[type="text"]').type('0000');
        cy.get('button[type="submit"]').click();
        cy.contains('Invalid or expired reset code.').should('be.visible');

        // Clean up inbox
        cy.mailslurp({
            apiKey: apiKey,
            inboxId: inboxId
        }).then(function (mailslurp) {
        });
    });

    // Tests all types of inputs
    // Email doesnt exist
    it('Should show error for non-existent email', function () {
        cy.get('input[type="email"]').type('nonexistent-email@example.com');
        cy.get('button[type="submit"]').click();
        cy.contains('No account found for that email').should('be.visible');
    });

});