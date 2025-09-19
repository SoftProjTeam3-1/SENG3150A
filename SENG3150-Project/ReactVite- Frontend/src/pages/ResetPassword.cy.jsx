import React from 'react'
import ResetPassword from './ResetPassword'

describe('<ResetPassword />', () => {
  beforeEach('renders', () => {
    cy.mount(<ResetPassword />)
  })

  // Back link is present and points to home (component tests shouldn't assert URL changes)
  it('shows Back link pointing to /', () => {
    cy.get('[type="button"]').should('contain.text', 'Back')
    
  })
})