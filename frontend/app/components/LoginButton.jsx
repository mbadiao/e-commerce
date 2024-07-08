"use client";
import React from "react";

const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/api/auth/provider';
  };

  return (
    <button onClick={handleLogin} className="btn-primary">
      Sign in with Google
    </button>
  );
};

export default LoginButton;
