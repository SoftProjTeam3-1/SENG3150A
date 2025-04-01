import React from 'react'
import LoginForm from '../components/Login/LoginForm'
import Footer from '../components/Footer'
import Header from '../components/Header'

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