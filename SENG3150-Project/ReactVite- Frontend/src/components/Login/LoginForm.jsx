/**
 * Author: Harrison Armstrong
 * Date: 1/4/2025
 * Description: Login form that authenticates via backend, stores access token
 * in AuthContext (persisted), and relies on HttpOnly refresh cookie for renewals.
 */

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeOpenIcon from '../../assets/eye-open.svg';
import eyeClosedIcon from '../../assets/eye-closed.svg';
import './login.css';

import { useAuth } from '../Auth/AuthProvider.jsx';

import { useNavigate, Link } from 'react-router-dom';
import { validateLogin } from '../../lib/validation.js';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [plainTextPassword, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();            
  const navigate = useNavigate();

  async function parseResponse(resp) {
    const text = await resp.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text ? { message: text } : null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent double submit

    const validation = validateLogin({ emailId: email, passwordId: plainTextPassword });
    if (!validation.valid) {
      toast.error(
        <div>
          {validation.errors.length > 1 ? (
            <ul className="list-disc pl-5 text-left">
              {validation.errors.map((err, i) => (
                <li key={i}>{err.replace(/^- /, '')}</li>
              ))}
            </ul>
          ) : (
            <div>{validation.errors[0].replace(/^- /, '')}</div>
          )}
        </div>,
        { position: 'top-right', autoClose: 5000, theme: 'colored' }
      );
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include', // ensures refresh cookie is set on success
        body: JSON.stringify({
          email: email.trim(),
          password: plainTextPassword.trim(), // MUST be "password"
        }),
      });

      const data = await parseResponse(resp);

      if (!resp.ok) {
        const msg =
          (data && (data.message || data.error || data.detail)) ||
          (resp.status === 401 ? 'Invalid email or password.' : `Login failed (${resp.status})`);
        throw new Error(msg);
      }

      const accessToken =
        (data && data.accessToken) ||
        (data && data.data && data.data.accessToken) ||
        null;

      if (!accessToken) throw new Error('No access token returned by server.');

      // store token in AuthContext (and localStorage via provider)
      login(accessToken);

      toast.success('Logged in successfully!', { autoClose: 900 });
      setTimeout(() => navigate('/dashboard', { replace: true }), 250);
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err?.message || 'Login failed', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-card">
      <ToastContainer />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="joe.bloggs@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={submitting}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-70"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Password
              </label>
            </div>

            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                required
                autoComplete="current-password"
                value={plainTextPassword}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-70"
              />

              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5"
                disabled={submitting}
              >
                <img
                  src={showPassword ? eyeOpenIcon : eyeClosedIcon}
                  alt=""
                  className="w-5 h-5 pointer-events-none"
                />
              </button>
            </div>
          </div>

          <div className="text-sm flex flex-col gap-1">
            <Link to="/forget-password" className="font-semibold text-white hover:text-gray-400">
              Forgot password?
            </Link>
            <Link to="/register" className="font-semibold text-white hover:text-gray-400">
              Create an Account
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
            >
              {submitting ? 'Signing in…' : 'Enter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
