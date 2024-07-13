'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.pathname.split('/').pop();
    setToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/verify-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      setMessage(data.message);
      router.push('/auth/login')
    } catch (error) {
      setMessage(error.message || 'An error occurred.');
    }

    setLoading(false);
  };

  return (
    <div className='flex pt-20 min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8'>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <Input
          className='my-2'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Send Reset Email'}
        </Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
