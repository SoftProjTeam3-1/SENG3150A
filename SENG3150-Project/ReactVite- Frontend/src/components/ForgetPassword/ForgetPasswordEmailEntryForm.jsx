import React, { useState } from 'react';
import { validateForgotPasswordEmail } from "../../lib/validation.js";
import './forgotPassword.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { href } from 'react-router-dom';
import { sha256 } from 'js-sha256';

const ForgetPasswordEmailEntryForm = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [viewValidation, changeValidation] = useState(false);
  const [step, setStep] = useState(1); // 1 = email, 2 = code, 3 = password

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    changeValidation(validateForgotPasswordEmail({ email }));

    try {
      const response = await fetch('/api/user/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      let data = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: true, message: text };
      }
      setMessage(data.error);
      if (!data.error) {
        setStep(2);
        if (data.message) {
          import('react-toastify').then(({ toast }) => toast.info(data.error));
        }
      } else {
        // Show toast for API error (e.g., "No account found for that email.")
        import('react-toastify').then(({ toast }) => toast.error(data.message || 'An error occurred.'));
      }
    } catch (err) {
      import('react-toastify').then(({ toast }) => toast.error('Error submitting email: ' + err));
      console.error('Error submitting email:', err);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    // skip this step if you verify in reset endpoint
    setStep(3); // Assume code is valid
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const hashedPassword = sha256(newPassword); // keep this

    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: hashedPassword }) 
      });

      const data = await response.json();
      setMessage(data.message);
      if (!data.error) window.location.href = '/';
    } catch (err) {
      console.error('Error resetting password:', err);
    }
  };

  return (
    <div className="forgotPassword-card">
      <ToastContainer />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Reset Password
        </h2>
      </div>

      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="joe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button type="submit" className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold">
              Send Code
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="w-full bg-white border-indigo-600 border-2 px-3 py-1.5 rounded-md text-indigo-600 font-semibold hover:border-indigo-500 hover:bg-indigo-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleCodeSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-white">
              Enter 4-digit Code
            </label>
            <input
              type="text"
              maxLength="4"
              placeholder="1234"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button type="submit" className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold">
              Verify Code
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="w-full bg-white border-indigo-600 border-2 px-3 py-1.5 rounded-md text-indigo-600 font-semibold hover:border-indigo-500 hover:bg-indigo-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-white">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button type="submit" className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold">
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="w-full bg-white border-indigo-600 border-2 px-3 py-1.5 rounded-md text-indigo-600 font-semibold hover:border-indigo-500 hover:bg-indigo-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {message && <p className="text-center text-red-500">{message}</p>}
    </div>
  );
};

export default ForgetPasswordEmailEntryForm;
