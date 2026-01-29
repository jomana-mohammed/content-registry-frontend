"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/authContext";
import Spinner from "../components/spinner";


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {login} = useAuth();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async(e: React.FormEvent) =>{
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // const response = await api.post('/auth/login', {email, password});
            // console.log(response.data);
            
            // // Store token and user data
            // if (response.data.token) {
            //     localStorage.setItem('token', response.data.token);
            //     localStorage.setItem('user', JSON.stringify(response.data.user));
            // }

            login(email , password);
            router.push('/home');
        } catch (error: any) {
            console.log(error);
            // Use the enhanced error message from API interceptor
            setError(error.userMessage || error.response?.data?.message || 'Invalid email or password');
            setLoading(false);
        }
    }
    
    return (
    <>
      {loading && (
        <Spinner fullScreen size="xl" message="Signing in..." />
      )}
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex w-[500px] flex-col justify-center items-center px-6 py-12 lg:px-8 bg-white rounded-lg shadow-lg">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-[#111827]">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={handleEmailChange}
                  value={email}
                  className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={handlePasswordChange}
                  value={password}
                  className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 ">
            Don't have an account?{' '}
            <a href="./register" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login ;
