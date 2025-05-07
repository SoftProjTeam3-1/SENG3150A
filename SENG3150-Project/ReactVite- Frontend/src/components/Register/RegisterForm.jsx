/**
 * Author: Harrison Armstrong 
 * Date: 1/4/2025
 * Description: This component is used to render the registration form for the application.
 * It allows the user to enter their first name, surname, username, password, and confirm password to register their account.
 * The form is submitted to the server for processing.
 */

import React, { useState } from 'react';
import { sha256 } from 'js-sha256';
import { Route } from 'react-router-dom'
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [viewValidation, changeValidation] = useState(false);
  let [viewErrorLog, changeErrorLog] = useState("");

  const hashPassword = (password) => sha256(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let s =validateRegister({emailId: email, passwordId: password, confirmPasswordId: confirmPassword});
    changeValidation(s.valid);
    changeErrorLog(s.errors);
    console.log(s.errors);

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

      //setSubmitFailed(!response.ok);

      if (response.ok && viewValidation) {
        console.log('User registered successfully!');
        window.location.href = '/';
      }
    } catch (err) {
      console.log(viewErrorLog);
      console.error('Error submitting user:', err);
    }
    if(viewErrorLog.length > 0){
      toast.error(
          <div>
            <ul className="list-disc pl-5 text-left">
              {viewErrorLog.map((err, i) => (
                  <li key={i}>{err.replace(/^- /, '')}</li>  // removes any "- " at the start
              ))}
            </ul>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
    }else if(viewErrorLog.length == 0 && viewValidation){
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }else{
      toast.error("Unable to Register", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };


  const passwordHints = [
    {text: "Password must be at least 8 characters", isValid: password.length >= 8},
    {text: "Password must contain at least one uppercase letter.", isValid: /[A-Z]/.test(password)},
    {text: "Password must include a special character.", isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password)},
    {text: "Passwords must match.", isValid: password != "" && password === confirmPassword}
  ];

  return (
    <div className={"register-card"}>
      <ToastContainer>

      </ToastContainer>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Register
        </h2>
      </div>
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
                <img 
                  src={eyeClosedIcon} 
                  alt='eye' 
                  id='hideButton' 
                  style={{ width: '5%', height: '5%' }}
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
                  }}/>
              </div>
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm/6 font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                    onChange={e => setConfirmPassword(e.target.value)}
                  id="password2"
                  name="password2"
                  value={confirmPassword}
                  type="password"
                  placeholder='********'
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <img 
                  src={eyeClosedIcon} 
                  alt='eye' 
                  id='hideButton2' 
                  style={{ width: '5%', height: '5%' }}
                  onClick={() => {
                    const passwordField = document.getElementById('password2');
                    const imageFile = document.getElementById('hideButton2');
                    if (passwordField.type === 'password') {
                      passwordField.type = 'text'; // Show password
                      imageFile.src = eyeOpenIcon; // Change image to open eye
                    } else {
                      passwordField.type = 'password'; // Hide password
                      imageFile.src = eyeClosedIcon; // Change image to closed eye
                    }
                  }}/>
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
            
            <br></br>

            <div>
            <button

              className="flex w-full justify-center rounded-md bg-white border-indigo-600 border-dash border-2 px-3 py-1.5 text-sm/6 font-semibold text-indigo-600 shadow-xs hover:border-indigo-500 hover:bg-indigo-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <a href="/">Back</a>
            </button>
          </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
