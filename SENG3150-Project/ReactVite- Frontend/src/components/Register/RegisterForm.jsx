/**
 * Author: Harrison Armstrong 
 * Date: 1/4/2025
 * Description: This component is used to render the registration form for the application.
 * It allows the user to enter their first name, surname, username, password, and confirm password to register their account.
 * The form is submitted to the server for processing.
 */

import React, { useState } from 'react';
import { sha256 } from 'js-sha256';
import { validateRegister } from "../../lib/validation.js";
import './register.css';

const RegisterForm = () => {

  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [viewValidation, changeValidation] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const hashPassword = (password) => sha256(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    changeValidation(validateRegister({
      emailId: email,
      passwordId: password,
      confirmPasswordId: confirmPassword
    }));

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          surname,
          email,
          password 
        }),
      });

      setSubmitFailed(response);
  

      if (response.ok && viewValidation) {
        console.log('User registered successfully!');
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Error submitting user:', err);
    }
  };

  const successfullRegistration = () => {

    if(submitFailed){
      return (
        <div className="text-red-500 text-sm mt-2">
          <p>Registration failed. Please try again.</p>
        </div>
      );
    }
    else if (viewValidation) {
      return (
        <div className="text-green-500 text-sm mt-2">
          <p>Registration successful!</p>
        </div>
      );
    }
    return null;

  } 

  const passwordHints = [
    {text: "Password must be at least 8 characters", isValid: password.length >= 8},
    {text: "Password must contain at least one uppercase letter.", isValid: /[A-Z]/.test(password)},
    {text: "Password must include a special character.", isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password)},
    {text: "Passwords must match.", isValid: password === confirmPassword}
  ];

  return (
    <div className={"register-card"}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Register
        </h2>
      </div>
      {successfullRegistration()}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm/6 font-medium text-white">
              First Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Joe"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                id="firstName"
                name="firstName"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Surname */}
          <div>
            <label htmlFor="surname" className="block text-sm/6 font-medium text-white">
              Surname
            </label>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Bloggs"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                id="surname"
                name="surname"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Username (Email) */}
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-white">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
                id="password"
                name="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-white">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                name="confirmPassword"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
                  {/* Password Hints */}
              <ul className="space-y-1 text-sm text-gray-300 text-neutral-500 mt-4">
                {passwordHints.map((hint, index) => (
                    <li key={index} className="flex items-center">
                      {hint.isValid ? (
                          <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L8 11.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                      ) : (
                          <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 011.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 015.05 3.636L10 8.586z" clipRule="evenodd" />
                          </svg>
                      )}
                      <span className="ml-2">{hint.text}</span>
                    </li>
                ))}
              </ul>
            </div>
           </div>

           
          {/* Buttons */}
          <div>
            <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enter
            </button>
          </div>

          <div>
            <button
              className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <a href="/">Back</a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
