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
  const [plainTextPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [viewValidation, changeValidation] = useState(false);
  let [viewErrorLog, changeErrorLog] = useState("");

  const password = sha256(plainTextPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let s = validateRegister({emailId: email, passwordId: plainTextPassword, confirmPasswordId: confirmPassword});
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

      const object = await response.text();
      const data = JSON.parse(object);
      console.log(data);
      console.log(viewValidation);

      if (data.response && viewValidation) {
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
    {text: "Password must be at least 8 characters", isValid: plainTextPassword.length >= 8},
    {text: "Password must contain at least one uppercase letter.", isValid: /[A-Z]/.test(plainTextPassword)},
    {text: "Password must include a special character.", isValid: /[!@#$%^&*(),.?":{}|<>]/.test(plainTextPassword)},
    {text: "Passwords must match.", isValid: plainTextPassword != "" && plainTextPassword === confirmPassword}
  ];

  return (
    <div className="register-card px-4 py-6 sm:px-6 sm:py-8">
      <ToastContainer />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Register
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-white">
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
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Surname */}
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-white">
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
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
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
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <div className="mt-2 flex items-center relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                required
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                onChange={e => setPassword(e.target.value)}
                value={plainTextPassword}
              />
              <img 
                src={eyeClosedIcon} 
                alt="eye" 
                id="hideButton"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-6 h-6"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
              Confirm Password
            </label>
            <div className="mt-2 flex items-center relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="********"
                required
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              <img 
                src={eyeClosedIcon} 
                alt="eye" 
                id="hideButton2"
                onClick={() => {
                  const passwordField = document.getElementById('confirm-password');
                  const imageFile = document.getElementById('hideButton2');

                  if (passwordField.type === 'password') {
                    passwordField.type = 'text'; // Show password
                    imageFile.src = eyeOpenIcon; // Change image to open eye
                  } else {
                    passwordField.type = 'password'; // Hide password
                    imageFile.src = eyeClosedIcon; // Change image to closed eye
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-6 h-6"
              />
            </div>
          </div>

          {/* Already have an account */}
          <div className="text-sm">
            <a href="/login" className="font-semibold text-white hover:text-gray-400">
              Already have an account? Login
            </a>
          </div>

          {/* Buttons */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>

          <div className="mt-4">
            <button
              className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
