"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/authContext";
import Link from "next/link";
import Spinner from "../components/spinner";
import { registerSchema } from "@/src/lib/validationSchemas";
import { z } from "zod";


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    username?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {register} = useAuth();

  const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    
    // Validate with Zod
    try {
      const validatedData = registerSchema.parse({
        email,
        password,
        username
      });

      // If validation passes, attempt registration
      try {
        await register(validatedData.email, validatedData.password, validatedData.username);
        // Only navigate on successful registration
        router.push('/');
      } catch (registerError: any) {
        // Handle registration errors (duplicate email/username, server errors, etc.)
        //console.error('❌ Registration error:', registerError);
        setError(registerError.response?.data?.message || registerError.message || 'Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFieldErrors(errors);
      }
    }
  }

  return (
    <>
      {loading && (
        <Spinner fullScreen size="xl" message="Creating your account..." />
      )}
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex max-w-[500px] flex-col justify-center items-center px-14 sm:px-10 py-12 lg:px-8 bg-white rounded-lg shadow-lg">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-[#111827]">Create your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm/6 font-medium">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`block w-full rounded-md border ${
                    fieldErrors.username ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                    fieldErrors.username ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
                  } focus:border-transparent sm:text-sm`}
                  placeholder="Enter your username"
                />
                {fieldErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full rounded-md border ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                    fieldErrors.email ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
                  } focus:border-transparent sm:text-sm`}
                  placeholder="Enter your email"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-md border ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                    fieldErrors.password ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
                  } focus:border-transparent sm:text-sm`}
                  placeholder="Minimum 6 characters"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 ">
            Already have an account?{' '}
            <a href="./login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Register;
