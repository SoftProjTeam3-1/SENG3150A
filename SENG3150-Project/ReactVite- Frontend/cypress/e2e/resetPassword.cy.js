// npm install --save-dev cypress-mailslurp

import { MailSlurp } from 'mailslurp-client';

describe('Reset Password Flow', () => {
    const apiKey = 'c263ede172dfd59ae905e0c55bdb358e683403e66d744bdf468c9afa1bba6e32';
    const inboxId = '01aa6d4b-5545-4003-95ca-19551486c8f0';
    beforeEach(() => {
        cy.visit('http://localhost:5173/forget-password'); // adjust if route differs
    });

    // Enter valid email, click on send code, check for success message, get code, enter code and submit, 
    // new password, confirm password, be back in login page and login with new password
    it('Should successfully reset password', function () {
        cy.get('input[type="email"]').type('dannydavino6@gmail.com');
        cy.get('button[type="submit"]').click();

        // Wait for the success message
        cy.contains('Sending...').should('be.visible');
        cy.wait(2000); // wait for 2 seconds to simulate email sending delay
        cy.contains('Password reset code sent').should('be.visible');

        // Use a Cypress task to fetch the email from MailSlurp in the Node context
        cy.mailslurp( {
            apiKey: apiKey,
            inboxId: inboxId
        }).then(function (mailslurp){
            return mailslurp.waitForLatestEmail(inboxId, 30000, true);
        }).then(function (email) {
            expect(email).to.exist;
            expect(email.body).contains('Your password reset code is:');
            //print email body
            cy.log(email.body);
            //get code from email body
            const code = email.body.match(/Your password reset code is:\s*(\d{4})/)[1];
            if (code) {
                cy.log(`Code is ${code}`);
            } else {
                throw new Error('Reset code not found in email body');
            }
        });
    });
});