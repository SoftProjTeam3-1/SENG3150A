import React, { useState } from 'react';

function Register() {

    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/user/submits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, surname, email, password }),
        });
        const text = await response.text();
        setMessage(text);
        setName(firstName);
      } catch (err) {
        console.error('Error submitting user:', err);
      }
    };

    const getEmails = async () => {
        try {
            const response = await fetch('/api/user/getEmails');
            const data = await response.json();
            console.log('Fetched emails:', data);
        } catch (err) {
            console.error('Error fetching emails:', err);
        }
    }
  
    return (
      <>
        <div>
          <h2>{name ? 'Welcome' : 'Register'}</h2>
          <p className="read-the-docs">
            {message ? message : 'Fill out the form below'}
          </p>
  
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="new-firstname"
            />
            <br /><br />
  
            <input
              type="text"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              autoComplete="new-surname"
            />
            <br /><br />
  
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="new-email"
            />
            <br /><br />
  
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <br /><br />
  
            <button type="submit">Submit</button>
          </form>
        </div>

        <div>
          <button onClick={getEmails}>Get Emails</button>
          <p>Check the console for fetched emails</p>
        </div>

        
      </>
    );
    



}
export default Register;
// import React, { useState } from 'react';