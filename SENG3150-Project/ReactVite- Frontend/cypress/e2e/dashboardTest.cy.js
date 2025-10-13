/* Tests for dashboard page
   http://localhost:5173/dashboard
*/
describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    //then login as standard user
    cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
    cy.get('input[type="password"]').type('SENG3150isfun!');
    cy.get('button[type="submit"]').click();
    cy.contains('Dashboard').should('be.visible');
  });

  // Create a Training Session
  it('creates a new training session', () => {
    cy.contains('button', 'New Session').click({ force: true });
    cy.contains('Training Session').click({ force: true });
    // click on 10 in class="react-datepicker__month-container"
    cy.get('.react-datepicker__month-container').contains('10').click();
    // check if its created in the dashboard
    cy.get('.text-center > .w-32').contains('10').should('be.visible');
  });

  it('creates a new game session', () => {
    // Check if Training Session from previous test is still there
    cy.get('.text-center > .w-32').contains('10').should('be.visible');
    // Create a Game Session
    cy.contains('button', 'New Session').click({ force: true });
    cy.contains('Game Session').click({ force: true });
    // click on 16 in class="react-datepicker__month-container"
    cy.get('.react-datepicker__month-container').contains('16').click();
    // check if its created in the dashboard
    cy.get('.text-center > .w-32').contains('16').should('be.visible');
  });

  it('displays sessions and adds activities', () => {
    // Check if Sessions from previous test is still there
    cy.get('.text-center > .w-32').contains('10').should('be.visible');
    cy.get('.text-center > .w-32').contains('16').should('be.visible');
    
    // click on 10 in class="react-datepicker__month-container"
    //cy.get('.react-datepicker__month-container').contains('10').click();
    // Display the Training Session and Game Session in the dashboard
    cy.get('.text-center > .w-32').contains('10').click();
    cy.get('#userDisplay > .p-5 > .gap-y-5 > .gap-y-3').contains('10');
    cy.get('.text-center > .w-32').contains('16').click();
    cy.get('#userDisplay > .p-5 > :nth-child(2) > .border-white').contains('16');

    // Add a New Activity to the Training Session
    cy.get('.text-4xl').contains('New Activity').click();
    cy.get('.text-center > :nth-child(1) > .w-full').find("div").contains('Warmup').click();
    cy.get('.text-center > :nth-child(1) > .gap-2 > :nth-child(1)').contains('Laps').click();
    cy.get('.w-20').type('5');
    cy.get('.fixed > .bg-gray-600 > .bg-white').contains('Confirm').click();
  
    // Check if the inputted Activity is displayed in the session
    cy.get('#userDisplay > .p-5 > :nth-child(1) > .gap-y-3 > .overflow-y-auto > :nth-child(1) > .flex > .flex-1 > :nth-child(2)').should('have.text', 'Laps');
    cy.get('.flex-1 > :nth-child(4)').should('have.text', '05 minutes');
  });

  // Reorder activities in the Training Session
  it('add and reorders activities', () => {
    // Check if Sessions from previous test is still there
    cy.get('.text-center > .w-32').contains('May 1').click();
    cy.get('.text-center > .w-32').contains('May 6').click();
    // Add another Activity to the Training Session then drag and drop to reorder and parallel

      cy.get('#userDisplay .p-5 > .gap-y-5 > .gap-y-3')
          .filter((_, el) => el.textContent?.includes('May 1'))
          .first()
          .as('sessionA');

      cy.get('#userDisplay .p-5 > .gap-y-5 > .gap-y-3')
          .filter((_, el) => el.textContent?.includes('May 6'))
          .first()
          .as('sessionB');

      cy.get('@sessionA').within(() => {
          cy.contains('button', 'New Activity').click();       // <-- key change
      });

    cy.get('.text-center > :nth-child(2) > .w-full').find("div").contains('Skills').click();
    cy.get('.text-center > :nth-child(1) > .gap-2 > :nth-child(2)').contains('Dribbling').click();
    cy.get('.w-20').type('10');
    cy.get('.fixed > .bg-gray-600 > .bg-white').contains('Confirm').click();

    // Move Activity


    // Check Activity
  });


  // Delete an Activity from the Training Session
  it('deletes an activity', () => {
      cy.contains('.text-center .w-32', 'May 1').click();

      const list = '#userDisplay .p-5 > .gap-y-5 > .gap-y-3 .overflow-y-auto';

      cy.contains(`${list} .flex .flex-1`, 'Laps')
          .closest('.flex')
          .as('row');

      cy.get('@row').trigger('mouseover', { force: true });
      cy.get('@row').find('.text-red-600').first().click({ force: true });

// assert by text so we’re not tied to structure
      cy.get(list).should('not.contain', 'Laps');

  });

  // Check times are calculated correctly
  it('checks time calculations', () => {
      cy.contains('.text-center .w-32', 'May 1').click();

      // Grab the May 1 panel
      cy.get('#userDisplay .p-5 .gap-y-5 .gap-y-3')
          .filter((_, el) => el.textContent?.includes('May 1'))
          .first()
          .as('sessionA');

      // Assert total time (classes chained; scoped to the panel)
      cy.get('@sessionA')
          .find('.text-center.mt-auto.pt-3.text-white.font-bold')
          .should('be.visible')// extra sanity
          .invoke('text')
          .should('match', /Total Time:\s*50\s*Minutes/i);
  });

  // Write notes for the session
  it('writes notes for the session', () => {
    cy.get('.text-4xl').contains('Notes').click();
    cy.get('.w-full').type('This is a test note.');
    cy.get('.fixed > .bg-gray-600 > .bg-white').contains('Confirm').click();
  });

  // Edit notes for the session and check they are saved
  it('edits notes for the session', () => {
    cy.get('.text-4xl').contains('Notes').click();
    cy.get('.w-full').clear().type('This is an edited test note.');
    cy.get('.fixed > .bg-gray-600 > .bg-white').contains('Confirm').click();
  });

  // Check the session is saved and appears in the dashboard
  it('checks the session is saved and appears in the dashboard', () => {
    cy.get('.text-4xl').contains('Notes').click();
    cy.get('.w-full').should('have.value', 'This is an edited test note.');
    });
});

