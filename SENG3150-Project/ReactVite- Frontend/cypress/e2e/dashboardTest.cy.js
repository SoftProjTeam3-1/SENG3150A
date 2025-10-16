/* Tests for dashboard page
   http://localhost:5173/dashboard
*/

const MONTH = new Date().toLocaleString('default', { month: 'short' });
const SESSION1 = MONTH + " 10";
const SESSION2 = MONTH + " 12";

function pickDay(day) {
    const d = String(day).padStart(2, '0'); // "01", "12", ...
    cy.get('.react-datepicker')                // ensure the picker is open
        .should('be.visible')
        .find(`.react-datepicker__day--0${d}`)
        .not('.react-datepicker__day--outside-month') // ignore leading/trailing days
        .click({ force: true });
}

describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    //then login as standard user
    cy.get('input[type="email"]').type('stuart.mendes@gmail.com');
    cy.get('input[type="password"]').type('SENG3150isfun!');
    cy.get('button[type="submit"]').click();
    cy.contains('Dashboard').should('be.visible');

      cy.intercept('PUT', '/api/session/updateSessions').as('updateSessions');
      cy.intercept('POST', '/api/session/fetchSessions').as('fetchSessions')
  });

  // Create a Training Session
    it('creates two training sessions deterministically (10 & 12)', () => {
        // #1 create 10th
        cy.contains('button', 'New Session').click({ force: true });
        cy.contains('Training Session').click({ force: true });
        pickDay(10);
        cy.wait('@updateSessions');

        // verify card shows day 10 (exact day text)
        cy.contains('.text-center .w-32', 10).should('be.visible');

        // #2 create 12th
        cy.contains('button', 'New Session').click({ force: true });
        cy.contains('Training Session').click({ force: true });
        pickDay(12);
        cy.wait('@updateSessions');

        // verify card shows day 12 (avoid matching “12” in “2025” etc.)
        cy.contains('.text-center .w-32', 12).should('be.visible');
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
    cy.get('.text-center > .w-32').contains(SESSION1).should('be.visible');
    cy.get('.text-center > .w-32').contains(SESSION2).should('be.visible');
    
    // click on 10 in class="react-datepicker__month-container"
    //cy.get('.react-datepicker__month-container').contains('10').click();
    // Display the Training Session and Game Session in the dashboard
    cy.get('.text-center > .w-32').contains(SESSION1).click();
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
    it('adds and reorders activities between SESSION1 and SESSION2', () => {
        // open both sessions so both droppable lists are rendered
        openSession(SESSION1);
        openSession(SESSION2);

        // alias panels
        cy.get('#userDisplay .p-5 > .gap-y-5 > .gap-y-3')
            .filter((_, el) => el.textContent?.includes(SESSION1))
            .first().as('sessionA');

        cy.get('#userDisplay .p-5 > .gap-y-5 > .gap-y-3')
            .filter((_, el) => el.textContent?.includes(SESSION2))
            .first().as('sessionB');

        // add an activity to SESSION1
        cy.get('@sessionA').within(() => {
            cy.contains('button', 'New Activity').click({ force: true });
        });
        cy.get('.text-center > :nth-child(2) > .w-full').find('div').contains('Skills').click();
        cy.get('.text-center > :nth-child(1) > .gap-2 > :nth-child(2)').contains('Dribbling').click();
        cy.get('.w-20').clear().type('10');
        cy.get('.fixed > .bg-gray-600 > .bg-white').contains('Confirm').click();

        // give backend time if you intercept these
        cy.intercept('PUT', '/api/session/updateSessions').as('updateSessions');
        cy.wait('@updateSessions');

        // find the DRAGGABLE element for "Dribbling" in SESSION1 (it's also the handle)
        cy.get('@sessionA')
            .find('[data-rbd-draggable-id]')
            .contains('Dribbling')
            .closest('[data-rbd-draggable-id]')
            .as('dragEl');

// pick a DROPPABLE list inside SESSION2 (first row / the empty dashed zone or first row)
        cy.get('@sessionB')
            .find('[data-rbd-droppable-id]')
            .first()
            .as('dropzone');

// make sure both are in view
        cy.get('@dragEl').scrollIntoView();
        cy.get('@dropzone').scrollIntoView();

// compute a drop target (center of dropzone) and perform a real pointer drag
        cy.get('@dropzone').then($dz => {
            const r = $dz[0].getBoundingClientRect();
            const targetX = Math.floor(r.left + r.width / 2);
            const targetY = Math.floor(r.top  + r.height / 2);

            cy.get('@dragEl').realMouseDown();                             // lift from the same element (it's the handle)
            cy.realMouseMove(targetX, targetY, { position: 'client' });    // drag over session B
            cy.realMouseUp();                                              // drop
        });

// if your app persists on drop, wait for it
        cy.intercept('PUT', '/api/session/updateSessions').as('updateSessions');
        cy.wait('@updateSessions');

// assert it moved
        cy.get('@sessionA').find('[data-rbd-draggable-id]').then($rows => {
            const texts = [...$rows].map(r => r.textContent.trim());
            expect(texts.some(t => /Dribbling/.test(t))).to.eq(false);
        });

        cy.get('@sessionB').find('[data-rbd-draggable-id]').then($rows => {
            const texts = [...$rows].map(r => r.textContent.trim());
            expect(texts.some(t => /Dribbling/.test(t))).to.eq(true);
        });
    });



    // Delete an Activity from the Training Session
  it('deletes an activity', () => {
      openSession(SESSION1);

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
      openSession(SESSION1);

      // Grab the May 1 panel
      cy.get('#userDisplay .p-5 .gap-y-5 .gap-y-3')
          .filter((_, el) => el.textContent?.includes(SESSION1))
          .first()
          .as('sessionA');

      // Assert total time (classes chained; scoped to the panel)
      cy.get('@sessionA')
          .find('.text-center.mt-auto.pt-3.text-white.font-bold')
          .should('be.visible')// extra sanity
          .invoke('text')
          .should('match', /Total Time:\s*15\s*Minutes/i);

  });

  // Write notes for the session
  it('writes notes for the session', () => {
      openSession(SESSION1);
      cy.get('#session-notes')
          .should('be.visible')
          .clear()
          .type('This is a test note.');

  });

  // Edit notes for the session and check they are saved
  it('edits notes for the session', () => {
      openSession(SESSION1);
      cy.get('#session-notes')
          .clear()
          .type('This is an edited test note.');

  });

  // Check the session is saved and appears in the dashboard
  it('checks the session is saved and appears in the dashboard', () => {
      openSession(SESSION1);
      cy.wait('@fetchSessions');

      cy.get('#session-notes')
          .should('have.value', 'This is an edited test note.')
    });

});

function openSession(label) {
    cy.contains('.text-center .w-32', label, { timeout: 10000 })
        .scrollIntoView({ ensureScrollable: false }) // if inside a scroller
        .should('be.visible')
        .click({ force: true });
}
