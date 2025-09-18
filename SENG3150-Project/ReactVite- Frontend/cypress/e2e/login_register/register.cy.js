
/// <reference types="cypress" />

describe('Register Flow', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/register'); // adjust if route differs
    });

    // 1) Native required: empty submit makes NO network call
    it('requires fields before submit (native HTML validation)', () => {
        cy.intercept('POST', '**/api/user/register').as('register');

        cy.get('button[type="submit"]').click();

        cy.get('@register.all').should('have.length', 0);
        cy.get('#firstName').then(($el) => expect($el[0].checkValidity()).to.eq(false));
        cy.get('#surname').then(($el) => expect($el[0].checkValidity()).to.eq(false));
        cy.get('#email').then(($el) => expect($el[0].checkValidity()).to.eq(false));
        cy.get('#password').then(($el) => expect($el[0].checkValidity()).to.eq(false));
        cy.get('#password2').then(($el) => expect($el[0].checkValidity()).to.eq(false));
    });

    // 2) Client-side validation (invalid but non-empty so submit happens)
    it('shows toast with validation errors for bad email / weak pass / mismatch', () => {
        cy.get('#firstName').type('Joe');
        cy.get('#surname').type('Bloggs');
        cy.get('#email').type('not-an-email');
        cy.get('#password').type('short');              // too short, no uppercase, etc.
        cy.get('#password2').type('different');         // mismatch
        cy.get('button[type="submit"]').click();

        cy.get('.Toastify__toast--error').should('exist');
        // Optional: assert specific messages if validateRegister returns these strings
        // cy.get('.Toastify__toast--error').should('contain.text', 'Password must be at least 8 characters');
        // cy.get('.Toastify__toast--error').should('contain.text', 'Passwords must match.');
    });

    // 3) Password hints flip as user types
    it('updates password hints as rules are satisfied', () => {
        // start: nothing valid
        cy.contains('Password must be at least 8 characters').prev('svg').should('have.class', 'text-red-400');
        cy.contains('Password must contain at least one uppercase letter.').prev('svg').should('have.class', 'text-red-400');
        cy.contains('Password must include a special character.').prev('svg').should('have.class', 'text-red-400');
        cy.contains('Passwords must match.').prev('svg').should('have.class', 'text-red-400');

        // satisfy each rule
        cy.get('#password').type('Abcdefg!'); // 8+, uppercase, special
        cy.get('#password2').type('Abcdefg!');
        cy.contains('Password must be at least 8 characters').prev('svg').should('have.class', 'text-green-400');
        cy.contains('Password must contain at least one uppercase letter.').prev('svg').should('have.class', 'text-green-400');
        cy.contains('Password must include a special character.').prev('svg').should('have.class', 'text-green-400');
        cy.contains('Passwords must match.').prev('svg').should('have.class', 'text-green-400');
    });

    // 4) Toggle password visibility (both fields)
    it('toggles password and confirm visibility', () => {
        cy.get('#password').type('Secret123!');
        cy.get('#hideButton').click();
        cy.get('#password').should('have.attr', 'type', 'text');
        cy.get('#hideButton').click();
        cy.get('#password').should('have.attr', 'type', 'password');

        cy.get('#password2').type('Secret123!');
        cy.get('#hideButton2').click();
        cy.get('#password2').should('have.attr', 'type', 'text');
        cy.get('#hideButton2').click();
        cy.get('#password2').should('have.attr', 'type', 'password');
    });

    // 5) Successful registration with backend stub -> success toast then redirect to / after 3s
    it('registers successfully and redirects after toast delay (stubbed)', () => {
        cy.clock(); // control setTimeout redirect

        cy.intercept('POST', '**/api/user/register', (req) => {
            // Your component does response.text() then JSON.parse(object),
            // so return a string, not an object
            req.reply({
                statusCode: 200,
                body: JSON.stringify({ response: true })
            });
        }).as('register');

        cy.get('#firstName').type('Joe');
        cy.get('#surname').type('Bloggs');
        cy.get('#email').type('joe.bloggs@email.com');
        cy.get('#password').type('Abcdefg!');
        cy.get('#password2').type('Abcdefg!');
        cy.get('button[type="submit"]').click();

        cy.wait('@register');
        cy.get('.Toastify__toast--success').should('contain.text', 'Registration successful!');
        cy.location('pathname').should('not.eq', '/'); // not yet
        cy.tick(3000);
        cy.location('pathname').should('eq', '/');
    });

    // 6) Duplicate email / server validation error (409 or 400)
    it('shows error toast when server rejects (duplicate email)', () => {
        cy.intercept('POST', '**/api/user/register', {
            statusCode: 409,
            body: JSON.stringify({ response: false })
        }).as('register');

        cy.get('#firstName').type('Joe');
        cy.get('#surname').type('Bloggs');
        cy.get('#email').type('joe.bloggs@email.com');
        cy.get('#password').type('Abcdefg!');
        cy.get('#password2').type('Abcdefg!');
        cy.get('button[type="submit"]').click();

        cy.wait('@register');
        cy.get('.Toastify__toast--error').should('contain.text', 'Unable to Register');
        cy.location('pathname').should('not.eq', '/dashboard');
    });

    // 7) Network failure -> catch block -> toast "An unexpected error occurred"
    it('shows error toast on network failure', () => {
        cy.intercept('POST', '**/api/user/register', { forceNetworkError: true }).as('register');

        cy.get('#firstName').type('Joe');
        cy.get('#surname').type('Bloggs');
        cy.get('#email').type('joe.bloggs@email.com');
        cy.get('#password').type('Abcdefg!');
        cy.get('#password2').type('Abcdefg!');
        cy.get('button[type="submit"]').click();

        cy.wait('@register');
        cy.get('.Toastify__toast--error').should('contain.text', 'An unexpected error occurred');
        cy.location('pathname').should('not.eq', '/dashboard');
    });

    // 8) Back button goes to home
    it('navigates back to home', () => {
        cy.contains('Back').click();
        cy.location('pathname').should('eq', '/');
    });
});
