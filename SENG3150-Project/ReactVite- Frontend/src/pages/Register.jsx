import React from 'react'
import RegisterForm from '../components/Register/RegisterForm'

const Register = () => {
  return (
    <>
      <script type="module" src="./validation-loader.js"></script>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <RegisterForm />   
      </div> 
    </>
  )
}

export default Register
