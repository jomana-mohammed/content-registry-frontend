"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/authContext";
import Link from "next/link";


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {register} = useAuth();

  const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!email || !password || !username) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
    //   const response = await api.post('/auth/register', {email, password, username});
    //   console.log('✅ Registration successful:', response.data);
      
    //   // Store token and user data
    //   if (response.data.token) {
    //     localStorage.setItem('token', response.data.token);
    //     localStorage.setItem('user', JSON.stringify(response.data.user));
    //   }
      
      register(email, password, username);
      router.push('/home');

    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      // More detailed error messages
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure the backend is running at http://localhost:5000');
      } else if (error.response?.status === 409) {
        setError('Email or username already exists. Please try different credentials.');
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Invalid registration data. Please check your inputs.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(`Registration failed: ${error.message || 'Please make sure the backend server is running.'}`);
      }
      
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex w-[500px] flex-col justify-center items-center px-6 py-12 lg:px-8 bg-white rounded-lg shadow-lg">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-[#111827]">Create your account</h2>
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
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Enter your username"
                />
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
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Enter your email"
                />
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
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Minimum 6 characters"
                />
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
  )
}

export default Register;
