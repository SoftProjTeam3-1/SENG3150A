import React, { useState } from 'react';
import { validateForgotPasswordEmail } from "../../lib/validation.js";
import './forgotPassword.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { sha256 } from 'js-sha256';
import eyeClosedIcon from '../../assets/eye-closed.svg';
import eyeOpenIcon from '../../assets/eye-open.svg';


const ForgetPasswordEmailEntryForm = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [viewValidation, changeValidation] = useState(false);
  const [step, setStep] = useState(1); // 1 = email, 2 = code, 3 = password

  const [plainTextPassword, setPassword] = useState('');
  

  const passwordHints = [
    {text: "Password must be at least 8 characters", isValid: plainTextPassword.length >= 8},
    {text: "Password must contain at least one uppercase letter.", isValid: /[A-Z]/.test(plainTextPassword)},
    {text: "Password must include a special character.", isValid: /[!@#$%^&*(),.?":{}|<>]/.test(plainTextPassword)},
  ];
  const isPasswordValid = passwordHints.every(hint => hint.isValid);



  const handleEmailSubmit = async (e) => {
    e.preventDefault();



    changeValidation(validateForgotPasswordEmail({ email }));

    try {
      const response = await fetch('/api/user/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setMessage(data.message);
      if (data.error) {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setStep(2);
      }
    } catch (err) {
      toast.error('Error submitting email: ' + err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      console.error('Error submitting email:', err);
    }``
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/user/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
      } else {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
        setStep(3);
      }
    } catch (err) {
      toast.error('Error verifying code: ' + err.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      console.error('Error verifying code:', err);
    }
  };
  const handlePasswordReset = async (e) => {
    
    e.preventDefault();

    const isPasswordValid = passwordHints.every(hint => hint.isValid);
    if (!isPasswordValid) {
      toast.error("Password doesn't meet all the requirements.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    const hashedPassword = sha256(newPassword);

    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: hashedPassword }) 
      });

      const data = await response.json();
      setMessage(data.message);
      if (data.error) {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        window.location.href = '/';
      }
    } catch (err) {
      toast.error('Error resetting password: ' + err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      console.error('Error resetting password:', err);
    }
  };

  return (
    <div className="forgotPassword-card">
      <ToastContainer />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Reset Password
        </h2>
      </div>

      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-8">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="joe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 mt-2"
            />
          </div>
          <button type="submit" className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold mt-4">
            Send Code
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleCodeSubmit} className="space-y-8">
          <div className="mb-6">
            <label htmlFor="code" className="block text-sm font-medium text-white">
              Enter 4-digit Code
            </label>
            <input
              type="text"
              maxLength="4"
              placeholder="1234"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 mt-2"
            />
          </div>
          <button type="submit" className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold mt-4">
            Verify Code
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordReset} className="space-y-8">
          <div className="mb-6">
          
            <div>
                          
              <div className="mt-2 flex items-center relative">
                <input
                  onChange={e => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  value={plainTextPassword}
                  type="password"
                  placeholder='********'
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pr-10"
                />
                <img 
                  src={eyeClosedIcon} 
                  alt='eye' 
                  id='hideButton' 
                  className="absolute right-3 cursor-pointer" 
                  style={{ width: '22px', height: '22px' }}
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
              <div>
              {/* Password Hints */}
              <ul className="space-y-1 text-sm text-white mt-4">
                {passwordHints.map((hint, index) => (
                    <li key={index} className="flex items-center">
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
           </div>

            </div>
          </div>
          <button
          type="submit"
          disabled={!passwordHints.every(hint => hint.isValid)}
          className={`w-full py-2 rounded-md text-white font-semibold mt-4 ${passwordHints.every(hint => hint.isValid) ? 'bg-orange-400' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Reset Password
        </button>
        </form>
      )}

      <div className="flex flex-col gap-4 mt-4">
        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          className="w-full bg-orange-400 py-2 rounded-md text-white font-semibold"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ForgetPasswordEmailEntryForm;
