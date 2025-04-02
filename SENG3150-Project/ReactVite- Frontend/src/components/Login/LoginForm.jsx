/**
 * Author: Harrison Armstrong
 * Date: 1/4/2025
 * Description: This component is used to render the login form for the application.
 * It allows the user to enter their username and password to log in. 
 */

import { useState, useEffect } from 'react'
import React from 'react'
import { sha256 } from 'js-sha256';


const LoginForm = () => {
    //  public User(String firstName, String surname, String email, boolean verified, String password) {

  const [email, setEmail] = useState('')
  
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')

  const hashPassword = (password) => {
        return sha256(password); // Hash the password using SHA-256
  }

  const handleSubmit = async e => {

    e.preventDefault()
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password: hashPassword(password) })
      })
      const data = await response.json()
      
      if(data == true){
        console.log('User logged in successfully!')
        window.location.href = '/dashboard' // Redirect to the dashboard page
      }

   
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
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="Username" className="block text-sm/6 font-medium text-gray-900">
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder='********'
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>
          <div className="text-sm">
            <a href="/forget-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>

            <br></br>

            <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an Account{' '}
            </a>
          </div>
          <div>
            <button
              onClick={handleSubmit}
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

export default LoginForm