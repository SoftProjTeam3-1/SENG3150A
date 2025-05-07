import React from 'react';
import { useState } from 'react';
import { validateForgotPasswordEmail } from "../../lib/validation.js";
import './forgotPassword.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPasswordEmailEntryForm = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [viewValidation, changeValidation] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false); // New state to toggle code input visibility

  const handleEmailSubmit = async e => {
    e.preventDefault();
    const isValid = validateForgotPasswordEmail({ email });
    changeValidation(isValid);

    if (isValid) {
      setShowCodeInput(true); // Show the code input field
    } else {
      setMessage('Invalid email address.');
    }
  };

  const handleCodeSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch('api/user/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (data && viewValidation) {
        console.log('Password reset request submitted successfully!');
        window.location.href = '/dashboard'; // Redirect to the dashboard page
      }

      setMessage(data.message);
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };

  return (
    <div className="forgotPassword-card">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Reset Password
        </h2>
      </div>

      {!showCodeInput ? (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                placeholder="joe.bloggs@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                id="email"
                name="email"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit Email
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm/6 font-medium text-white">
              4-Digit Code
            </label>
            <div className="mt-2">
              <input
                type="text"
                placeholder="1234"
                value={code}
                onChange={e => setCode(e.target.value)}
                id="code"
                name="code"
                required
                maxLength="4"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit Code
            </button>
          </div>
        </form>
      )}

      {message && <p className="text-center text-red-500">{message}</p>}
    </div>
  );
};

export default ForgetPasswordEmailEntryForm;