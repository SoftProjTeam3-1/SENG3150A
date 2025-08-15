/**
 * Author: Harrison Armstrong
 * Date: 1/4/2025
 * Description: This component is used to render the login form for the application.
 * It allows the user to enter their username and password to log in. 
 */

import { useState } from 'react'
import React from 'react'
import {validateLogin} from "../../lib/validation.js";
import eyeOpenIcon from '../../assets/eye-open.svg';
import eyeClosedIcon from '../../assets/eye-closed.svg';
import './login.css';
import { toast, ToastContainer } from 'react-toastify';
import { sha256 } from 'js-sha256';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [plainTextPassword, setPassword] = useState('')
  let [viewValidation, changeValidation] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault()

    let s = validateLogin({emailId:email,passwordId:plainTextPassword});
    changeValidation(s.valid);

    if (!s.valid) {
      // directly handle client-side validation fail here
      toast.error(
          <div>
            {s.errors.length > 1 ? (
                <ul className="list-disc pl-5 text-left">
                  {s.errors.map((err, i) => (
                      <li key={i}>{err.replace(/^- /, '')}</li>
                  ))}
                </ul>
            ) : (
                <div>{s.errors[0].replace(/^- /, '')}</div>
            )}
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
      );
      return;
    }

    const password = sha256(plainTextPassword)
    console.log("login form", password, plainTextPassword)

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      })

      const object = await response.text();
      const data = JSON.parse(object);
      console.log(data);

      if(data.response){
        console.log('User logged in successfully!')
        login(); // Set isAuthenticated to true
        navigate('/dashboard'); // Redirect using react-router
      } else {
        toast.error("Login Failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        })
      }

    } catch (err) {
      console.error('Error submitting user:', err)
    }
  }

  return (
    <div className={"login-card"}>
      <ToastContainer>

      </ToastContainer>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="Username" className="block text-sm/6 font-medium text-white">
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
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Password
              </label>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder='********'
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={e => setPassword(e.target.value)}
                value={plainTextPassword}
              >
              </input>

              <img 
                src={eyeClosedIcon} 
                alt='eye' 
                id='hideButton'
                onClick={() => {
                  const passwordField = document.getElementById('password');
                  const imageFile = document.getElementById('hideButton');

                  if (passwordField.type === 'password') {
                    passwordField.type = 'text'; // Show password
                    imageFile.src = eyeOpenIcon; // Change image to open eye
                  } else {
                    passwordField.type = 'password'; // Hide password
                    imageFile.src = eyeClosedIcon; // Change image to closed eye
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
              />
            </div>
          </div>
          <div className="text-sm">
            <a href="/forget-password" className="font-semibold text-white hover:text-gray-400">
              Forgot password?
            </a>

            <br></br>

            <a href="/register" className="font-semibold text-white hover:text-gray-400">
              Create an Account{' '}
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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