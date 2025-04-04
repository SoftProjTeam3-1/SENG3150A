/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 2025-04-01
 * Description: This component is used to render the register page.
 * It includes the RegisterForm component which is used to register a new user.
 */

import React from 'react'
import RegisterForm from '../components/Register/RegisterForm'

const Register = () => {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <RegisterForm />   
      </div> 
    </>
  )
}

export default Register
