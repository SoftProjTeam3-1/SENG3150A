import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, vi } from 'vitest'
import LoginForm from '../src/components/Login/LoginForm.jsx'
import { toast } from 'react-toastify'


// Mock react-toastify
// Mock the entire `react-toastify` module
vi.mock('react-toastify', () => ({
  toast: {
    // Simple Vitest mock for toast.error — stores whatever gets passed (string or JSX)
    error: vi.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));



// Mock validation
vi.mock('../../lib/validation.js', () => ({
  validateLogin: ({ emailId }) => {
    const errors = []
    let valid = true
    if (!emailId.includes('@')) {
      errors.push('Email must contain @')
      valid = false
    }
    return { valid, errors }
  }
}))

describe('LoginForm', () => {
  it('shows an error if email does not contain @', async () => {
    render(<LoginForm />)

    // Enter invalid email
    fireEvent.change(screen.getByPlaceholderText('joe.bloggs@email.com'), {
      target: { value: 'invalidemail.com' }
    })

    // Enter password
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'SENG3150isfun!' }
    })

    // Click submit
    fireEvent.submit(screen.getByRole('button', { name: 'Enter' }));
    // Wait for the toast to be called

    await waitFor(() => {
      expect(toast.error.mock.calls[0][0].props.children.props.children)
        .toContain('Please enter a valid email address');
    });
  })
})
