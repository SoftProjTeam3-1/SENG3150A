import React, { useState } from 'react';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });

      const data = await response.json();
      setMessage(data.message || data.error);
      if (data.message) window.location.href = "/login";
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  return (
    <form onSubmit={handleReset}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code" required />
      <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" type="password" required />
      <button type="submit">Reset Password</button>
      <p>{message}</p>
    </form>
  );
};

export default ResetPasswordForm;
