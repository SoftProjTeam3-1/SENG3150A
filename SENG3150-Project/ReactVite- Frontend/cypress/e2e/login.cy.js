/// <reference types="cypress" />

describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/');
    });


    it('logs in successfully with valid credentials with backend active', () => {

        cy.get('#email').type('stuart.mendes@gmail.com');
        cy.get('#password').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
    })

    it('logs in successfully with valid credentials with backend stub', () => {
        cy.intercept('POST', '**/api/user/login', {
            statusCode: 200,
            // Don't JSON.stringify here; give Cypress an object
            body: { response: true, user: { id: 1, email: 'stuart.mendes@gmail.com' } },
        }).as('login');

        cy.get('#email').type('stuart.mendes@gmail.com');
        cy.get('#password').type('SENG3150isfun!');
        cy.get('button[type="submit"]').click();

        cy.wait('@login');
        // More robust assert:
        cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
    });


    it('logs in unsuccessfully with invalid credentials with backend stub', () => {

        cy.intercept('POST', '**/api/user/login', {
            statusCode: 401,
            body: JSON.stringify({ response: false })
        }).as('login');

        cy.get('#email').type('stuart.mendes@gmail.com');
        cy.get('#password').type('WrongPass1!');
        cy.get('button[type="submit"]').click();
        cy.wait('@login');
        cy.get('.Toastify__toast--error').should('be.visible');
        cy.url().should('include', '/');
    })

    it('blocks submit with empty fields', () => {
        // optional: prove no network would fire
        it('requires fields before submit (native HTML validation)', () => {
            // intercept the login endpoint
            cy.intercept('POST', '**/api/user/login').as('login');

            // click submit with empty fields (native required prevents submit)
            cy.get('button[type="submit"]').click();

            // prove no network happened
            cy.get('@login.all').should('have.length', 0);

            // still not on dashboard
            cy.location('pathname').should('not.eq', '/dashboard');

            // optional: also assert inputs are invalid via HTML5 API
            cy.get('#email').then(($el) => expect($el[0].checkValidity()).to.eq(false));
            cy.get('#password').then(($el) => expect($el[0].checkValidity()).to.eq(false));
        });

    });

    it('navigates to reset password', () => {
        cy.contains(/forgot password\?/i).click();
        cy.location('pathname').should('eq', '/forget-password');
    });

    it('navigates to register', () => {
        cy.contains(/create an account/i).click();
        cy.location('pathname').should('eq', '/register');
    });


    it('toggles password visibility', () => {
        cy.get('#password').type('Secret123!');
        cy.get('#hideButton').click();
        cy.get('#password').should('have.attr', 'type', 'text');
        cy.get('#hideButton').click();
        cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('shows generic error on 500', () => {
        cy.intercept('POST', '**/api/user/login', { forceNetworkError: true }).as('login');

        // stub BEFORE the action
        cy.window().then(win => {
            cy.stub(win.console, 'error').as('consoleError');
        });

        cy.get('#email').type('user@example.com');
        cy.get('#password').type('Passw0rd!');
        cy.get('button[type="submit"]').click();

        cy.wait('@login');
        cy.get('@consoleError').should('have.been.called');
        cy.location('pathname').should('not.eq', '/dashboard');
    });

    it('sets auth token on success', () => {
        cy.intercept('POST', '**/api/user/login', (req) => {
            // Safely handle both string and object bodies
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

            // Assert payload your app sends, expects cookie
            expect(body).to.have.keys('email', 'password');
            expect(body.email).to.eq('u@e.com');
            expect(body.password).to.match(/^[a-f0-9]{64}$/); // sha256 hex

            // Reply in the shape your frontend treats as success
            req.reply({ statusCode: 200, body: { response: true } });
        }).as('login');

        cy.get('#email').type('u@e.com');
        cy.get('#password').type('Passw0rd!');
        cy.get('button[type="submit"]').click();

        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
    });

    it('blocks /dashboard when logged out', () => {
        cy.visit('http://localhost:5173/dashboard');
        cy.location('pathname').should('match', /^\/($|login)/);
    });

})