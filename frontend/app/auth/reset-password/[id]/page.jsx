'use client'

// pages/reset-password/[token].js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/api/reset-password/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || 'An error occurred.');
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Reset Password'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
