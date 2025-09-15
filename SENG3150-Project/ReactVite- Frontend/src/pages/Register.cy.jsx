import React from 'react'
import Register from './Register'

describe('<Register />', () => {
  beforeEach(() => {
    cy.mount(<Register />)
  })

  it('submits the form', () => {
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="surname"]').type('Doe')
    cy.get('input[name="email"]').type('john.doe@example.com')
    cy.get('input[name="password"]').type('password')
    cy.get('input[name="password2"]').type('password')
    cy.get('button[type="submit"]').click()
  })

  // Checks that hides password when clicking the eye icon
  it('toggles password visibility', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
    cy.get('#hideButton').first().click()
    cy.get('input[name="password"]').should('have.attr', 'type', 'text')
    // click again to toggle back to password
    cy.get('#hideButton').first().click()
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
    cy.get('#hideButton2').click()
    cy.get('input[name="password2"]').should('have.attr', 'type', 'text')
  })
})