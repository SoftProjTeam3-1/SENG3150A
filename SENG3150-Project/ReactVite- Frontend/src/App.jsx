import { useState, useEffect } from 'react'

import './App.css'

function App() {
    //  public User(String firstName, String surname, String email, boolean verified, String password) {


  const [firstName, setFirstName] = useState('')
  
  const [name, setName] = useState('')

  const [email, setEmail] = useState('')
  
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')

  const handleSubmit = async e => {

    e.preventDefault()
    try {
      const response = await fetch('api/user/submits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      })
      const data = await response.json()
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
    <>
  
     

      <div>
      <h2>{name? "Welcome" : "Login"} </h2>

      <p className="read-the-docs">
        {name ? `Hello, ${name}!` : 'ERROr: No user found'}
      </p>


      <form  onSubmit={handleSubmit}>

        <h2>Login</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />


        <br />

        <h2>Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
         <br />
         <br />
         <input
          type="text"
          placeholder="name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <br />
       
        <br />
        <br />
     



        <button type="submit">Submit</button>
      </form>
    
      {message && <p>{message}</p>}
    </div>
    </>
  )
}

export default App
