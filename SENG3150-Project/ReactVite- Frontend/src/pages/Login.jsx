/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 2025-04-01
 * Description: This component is used to render the login page.
 * It includes the LoginForm component which is used to enter the login credentials.
 */

import React from 'react'
import LoginForm from '../components/Login/LoginForm'

const Login = () => {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <LoginForm />   
      </div> 
    </>
  )
}

export default Login