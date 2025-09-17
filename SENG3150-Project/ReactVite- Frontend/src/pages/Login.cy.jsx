import { AuthProvider } from '../components/Auth/AuthProvider.jsx';
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'

describe('<Login />', () => {
  beforeEach(() => {
    cy.mount(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );
  })

  it('submits the form', () => {
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
  })

  // Checks that hides password when clicking the eye icon
  it('toggles password visibility', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
    cy.get('.absolute').click()
    cy.get('input[name="password"]').should('have.attr', 'type', 'text')
    cy.get('.absolute').click()
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
  })

  // Checks if Forgot password link redirects to /forget-password and Create account link redirects to /register
  it('shows Forgot password link pointing to /forget-password', () => {
    cy.get('a[href="/forget-password"]').should('contain.text', 'Forgot password?')
  })

  it('shows Create account link pointing to /register', () => {
    cy.get('a[href="/register"]').should('contain.text', 'Create an Account')
  })
})