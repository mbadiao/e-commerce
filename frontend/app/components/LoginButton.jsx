"use client";
import React from "react";
import { GOOGLE } from "../config";
const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = GOOGLE;
  };

  return (
    <button onClick={handleLogin} className="btn-primary">
      Sign in with Google
    </button>
  );
};

export default LoginButton;
