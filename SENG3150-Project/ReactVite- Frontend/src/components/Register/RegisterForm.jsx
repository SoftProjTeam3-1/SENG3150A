/**
 * Author: Harrison Armstrong
 * Date: 1/4/2025
 * Description: Registration form that sends plaintext password over HTTPS.
 */

import React, { useState } from 'react';
import { validateRegister } from "../../lib/validation.js";
import './register.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeOpenIcon from '../../assets/eye-open.svg';
import eyeClosedIcon from '../../assets/eye-closed.svg';

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [plainTextPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordHints = [
    {text: "Password must be at least 8 characters", isValid: plainTextPassword.length >= 8},
    {text: "Password must contain at least one uppercase letter.", isValid: /[A-Z]/.test(plainTextPassword)},
    {text: "Password must include a special character.", isValid: /[!@#$%^&*(),.?":{}|<>]/.test(plainTextPassword)},
    {text: "Passwords must match.", isValid: plainTextPassword !== "" && plainTextPassword === confirmPassword}
  ]

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const s = validateRegister({ emailId: email, passwordId: plainTextPassword, confirmPasswordId: confirmPassword });
    if (!s.valid) {
      toast.error(
        <div>
          {s.errors.length > 1 ? (
            <ul className="list-disc pl-5 text-left">
              {s.errors.map((err, i) => (<li key={i}>{err.replace(/^- /, '')}</li>))}
            </ul>
          ) : (
            <div>{s.errors[0].replace(/^- /, '')}</div>
          )}
        </div>,
        { position: "top-right", autoClose: 5000, theme: "colored" }
      );
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          surname,
          email,
          password: plainTextPassword, // send plaintext, server bcrypts it
        }),
      });

      const text = await resp.text();
      const data = text ? JSON.parse(text) : null;

      if (!resp.ok || !data?.response) {
        throw new Error(data?.message || "Unable to Register");
      }

      toast.success("Registration successful!", { position: "top-right", autoClose: 1500, theme: "colored" });
      setTimeout(() => { window.location.href = '/dashboard'; }, 1200);

    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err?.message || "An unexpected error occurred", { position: "top-right", autoClose: 5000, theme: "colored" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="register-card flex flex-col justify-center items-center py-12">      
    <ToastContainer />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Register</h2>
      </div>

      <div className="w-full max-w-sm flex flex-col justify-center mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-center w-full" noValidate>
          <div>
            <label htmlFor="firstName" className="block text-sm/6 font-medium text-white">First Name</label>
            <div className="mt-2">
              <input
                type="text" id="firstName" name="firstName" required
                placeholder="Joe" value={firstName} onChange={e => setFirstName(e.target.value)}
                disabled={submitting}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="surname" className="block text-sm/6 font-medium text-white">Surname</label>
            <div className="mt-2">
              <input
                type="text" id="surname" name="surname" required
                placeholder="Bloggs" value={surname} onChange={e => setSurname(e.target.value)}
                disabled={submitting}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">Email</label>
            <div className="mt-2">
              <input
                type="email" id="email" name="email" required
                placeholder="joe.bloggs@email.com" value={email} onChange={e => setEmail(e.target.value)}
                disabled={submitting}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-white">Password</label>
            <div className="mt-2 flex items-center relative">
              <input
                id="password" name="password" type="password" required autoComplete="new-password"
                placeholder="********" value={plainTextPassword} onChange={e => setPassword(e.target.value)}
                disabled={submitting}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pr-10"
              />
              <img
                src={eyeClosedIcon} alt="eye" id="hideButton"
                className="absolute right-3 cursor-pointer" style={{ width: '22px', height: '22px' }}
                onClick={() => {
                  const passwordField = document.getElementById('password');
                  const imageFile = document.getElementById('hideButton');
                  if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    imageFile.src = eyeOpenIcon;
                  } else {
                    passwordField.type = 'password';
                    imageFile.src = eyeClosedIcon;
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm/6 font-medium text-white">Confirm Password</label>
            <div className="mt-2 flex items-center relative">
              <input
                id="password2" name="password2" type="password" required autoComplete="new-password"
                placeholder="********" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                disabled={submitting}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pr-10"
              />
              <img
                src={eyeClosedIcon} alt="eye" id="hideButton2"
                className="absolute right-3 cursor-pointer" style={{ width: '22px', height: '22px' }}
                onClick={() => {
                  const passwordField = document.getElementById('password2');
                  const imageFile = document.getElementById('hideButton2');
                  if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    imageFile.src = eyeOpenIcon;
                  } else {
                    passwordField.type = 'password';
                    imageFile.src = eyeClosedIcon;
                  }
                }}
              />
            </div>
          </div>

          <ul className="space-y-1 text-sm text-white mt-4">
            {passwordHints.map((hint, i) => (
              <li key={i} className="flex items-center">
                {hint.isValid ? (
                  <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L8 11.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="ml-2">{hint.text}</span>
              </li>
            ))}
          </ul>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2 disabled:opacity-70"
            >
              {submitting ? 'Submitting…' : 'Enter'}
            </button>
          </div>

          <div className="w-full">
            <a href="/" className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2">
              Back
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;