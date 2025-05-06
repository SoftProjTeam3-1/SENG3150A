import React, { useState } from 'react';
import { validateForgotPasswordEmail } from "../../lib/validation.js";
import './forgotPassword.css';
import 'react-toastify/dist/ReactToastify.css';

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

      const data = await response.json();
      setMessage(data.message);
      if (!data.error) setStep(2);
    } catch (err) {
      console.error('Error submitting email:', err);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    // You can skip this step if you verify in reset endpoint
    setStep(3); // Assume code is valid
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
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
          <button type="submit" className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold">
            Send Code
          </button>
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
          <button type="submit" className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold">
          Verify Code
          </button>
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
          <button type="submit" className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold">
            Reset Password
          </button>
        </form>
      )}

      {message && <p className="text-center text-red-500">{message}</p>}
    </div>
  );
};

export default ForgetPasswordEmailEntryForm;
