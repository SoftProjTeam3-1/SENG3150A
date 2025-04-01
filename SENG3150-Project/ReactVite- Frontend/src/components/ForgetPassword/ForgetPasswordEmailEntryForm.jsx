/*
  Author: Harrison Armstrong
  Date: 1/4/2025
  Description: This component is used to render the email entry form for the forget password feature.
  It allows the user to enter their email address and submit it to receive a password reset link.
*/

import React from 'react';
import { useState, useEffect } from 'react';

const ForgetPasswordEmailEntryForm = () => {
    //  public User(String firstName, String surname, String email, boolean verified, String password) {
  const [firstName, setFirstName] = useState('')
  const [name, setName] = useState('')

  const [email, setEmail] = useState('')
  
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')

  const handleSubmit = async e => {

    e.preventDefault()
    try {
      const response = await fetch('api/user/submits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      })
      const data = await response.json()
      setMessage(data.message)
    } catch (err) {
      console.error('Error submitting user:', err)
    }
  }

  //Use effect runs every time the component is rendered
  //The empty array at the end of the useEffect function means that it will only run once
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('api/user')
        console.log(response)
        const data = await response.json()
        setName(data.firstName	)
        setEmail(data.email)

      } catch (err) {
        console.error('Error fetching user:', err)
      }

    }

    fetchUser()
  }, [message])

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Reset Password
            </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="Username" className="block text-sm/6 font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                type="email"
                placeholder="joe.bloggs@email.com"
                value={name}
                onChange={e => setName(e.target.value)}
                id="email"
                name="email"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <a href="/">Back</a>
            </button>
            <br></br>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
  )
}

export default ForgetPasswordEmailEntryForm