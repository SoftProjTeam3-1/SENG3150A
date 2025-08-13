import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import LoginForm from '../src/components/Login/LoginForm.jsx'

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn((jsx) => {
      if (typeof jsx === 'string') return jsx;

      // Flatten nested JSX into a single string
      const flatten = (node) =>
        Array.isArray(node)
          ? node.map(flatten).join(' ')
          : typeof node === 'string'
          ? node
          : flatten(node.props?.children);

      return flatten(jsx);
    })
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
    fireEvent.click(screen.getByRole('button', { name: 'Enter' }))

    const { toast } = await import('react-toastify')

    // Wait for the toast to be called
    await waitFor(() => {
        expect(toast.error).toHaveBeenCalled()
        expect(toast.error.mock.results[0].value).toContain('Email must contain @')
    });
  })
})
