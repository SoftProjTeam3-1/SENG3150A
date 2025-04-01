import React from 'react'
import LoginForm from '../components/Login/LoginForm'

const Login = () => {
  return (
    <>
      <script type="module" src="./validation-loader.js"></script>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <LoginForm />   
      </div> 
    </>
  )
}

export default Login