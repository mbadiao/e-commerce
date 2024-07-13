"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RiLoginCircleFill } from "react-icons/ri";
import { useProductStore } from "@/app/store/getUserFromCookie";
import { useRouter } from "next/navigation";
import LoginButton from "@/app/components/LoginButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const setUser = useProductStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const route = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Login Error",
        description: error,
      });
    }
  }, [error, toast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title:"Login Succes",
          description:'your are succesfully logged'
        })
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setUser(data);
        route.push("/");
      } else {
        toast({
          title:"Login Error",
          description:`${data.message}`
        })
      }
    } catch (e) {
      toast({
        title:"Login Error",
        description:`${e.message}`
      })
      retrun
    }
  };

  return (
    <>
      <div className="flex pt-20 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <RiLoginCircleFill className="mx-auto h-10 w-auto text-primary-blue" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md p-3 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link href="reset-password" className="font-semibold text-primary-blue">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md p-3 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="flex mx-auto">
                Sign in
              </Button>
            </div>
          </form>
          <div className="mt-5">
            <div className="mt-5 flex gap-2 items-center">
              <p>Don't have an account?</p>
              <Link href="/auth">
                <Button>Register</Button>
              </Link>
            </div>
            <div>
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
