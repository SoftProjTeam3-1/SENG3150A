/* Tests for dashboard page
   http://localhost:5173/dashboard
*/
describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    //then login as standard user
    cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
    cy.get('input[type="password"]').type('StuartMendes123#');
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

    // Create a Game Session
    cy.contains('button', 'New Session').click({ force: true });
    cy.contains('Game Session').click({ force: true });
    // click on 16 in class="react-datepicker__month-container"
    cy.get('.react-datepicker__month-container').contains('16').click();
    // check if its created in the dashboard
    cy.get('.text-center > .w-32').contains('16').should('be.visible');

    // Display the Training Session and Game Session in the dashboard
    cy.get('.text-center > .w-32').contains('10').click();
    cy.get('#userDisplay > .p-5 > .gap-y-5 > .gap-y-3').contains('10');
    cy.get('.text-center > .w-32').contains('16').click();
    cy.get('#userDisplay > .p-5 > :nth-child(2) > .border-white').contains('16');

    // Add a New Activity to the Training Session
    cy.get('.text-4xl').contains('New Activity').click();
    cy.get('.text-center > :nth-child(1) > .w-full').contains('Warm Up').click();
    cy.get('.text-center > :nth-child(1) > .gap-2 > :nth-child(1)').contains('Light Jogging').click();
    cy.get('.w-20').type('5');
    cy.get('.fixed > .bg-gray-600 > .bg-white').contains('Confirm').click();

    // Add another Activity to the Training Session then drag and drop to reorder and parallel
    cy.get('.text-4xl').contains('New Activity').click();
    cy.get('.text-center > :nth-child(1) > .w-full').contains('Warm Up').click();
    cy.get('.text-center > :nth-child(1) > .gap-2 > :nth-child(2)').contains('Arm Circles').click();
    cy.get('.w-20').type('10');
    cy.get('.fixed > .bg-gray-600 > .bg-white').contains('Confirm').click();
  });





  // Delete an Activity from the Training Session

  // Check times are calculated correctly

  // Write notes for the session

  // Edit notes for the session and check they are saved

  // Check the session is saved and appears in the dashboard
});
