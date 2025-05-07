import React, { useState, useEffect } from 'react';
import { validateResetPassword } from '../../lib/validation.js';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const [viewValidation, changeValidation] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const t = query.get('token');
    setToken(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateResetPassword({ password1: password, password2: confirmPassword });
    changeValidation(valid);

    if (!valid) {
      setMessage("Password validation failed.");
      return;
    }

    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }

    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();
      setMessage(data.message || data.error);

      if (response.ok) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Reset Password
        </h2>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              New Password
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                value={password}
                type="password"
                placeholder="********"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                type="password"
                placeholder="********"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <a href="/" className="flex-1 text-center rounded-md bg-gray-400 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-gray-500">
              Back
            </a>
            <button
              type="submit"
              className="flex-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordForm;
