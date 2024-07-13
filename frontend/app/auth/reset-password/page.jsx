"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RESET_PSW } from '@/app/config';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(RESET_PSW, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.log(error)
      setMessage(error.message || 'An error occurred.');
    }

    setLoading(false);
  };

  return (
    <div className='flex pt-20 min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8' >
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <Input
        className='my-2'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
