/**
 * Author: Harrison Armstrong 
 * Date: 1/4/2025
 * Description: This component is used to render the registration form for the application.
 * It allows the user to enter their first name, surname, username, password and confirm password to register their account.
 * The form is submitted to the server for processing.
 */

import React from 'react';
import { useState } from 'react';

const RegisterForm = () => {
  
  
      const [firstName, setFirstName] = useState('');
      const [surname, setSurname] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
    
        const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/user/submits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, surname, email, password }),
        });
        const text = await response.text();
        console.log(text);
      } catch (err) {
        console.error('Error submitting user:', err);
      } 

    
      

  return (
<div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Register
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-900">
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

            <div>
                <label htmlFor="surname" className="block text-sm/6 font-medium text-gray-900">
                  Surname
                </label>
                <div className="mt-2">
                <input
                    type="text"
                    placeholder="Bloggs"
                    value={surname}
                    onChange={e => setSurname(e.target.value)}
                    id="firstName"
                    name="firstName"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                </div>
            </div>

            <div>
                <label htmlFor="Username" className="block text-sm/6 font-medium text-gray-900">
                Username
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
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  onChange={e => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  value={password}
                  type="password"
                  placeholder='********'
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder='********'
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

          <div>
            <button

              className="flex w-full justify- center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <a href="/">Back</a>
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm