import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:5000/api
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor - runs before every request
api.interceptors.request.use(
    (config) => {
        // Add auth token to every request if it exists
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // console.log('API Request Details:');
        // console.log('  - Method:', config.method?.toUpperCase());
        // console.log('  - URL:', config.url);
        // console.log('  - Base URL:', config.baseURL);
        // console.log('  - Full URL:', `${config.baseURL}${config.url}`);
        // console.log('  - Data:', config.data);
        // console.log('  - Headers:', config.headers);

        return config;
    },
    (error) => {
        //console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
    (response) => {
        // console.log('API Response Success:');
        // console.log('  - Status:', response.status);
        // console.log('  - URL:', response.config.url);
        // console.log('  - Data:', response.data);
        return response;
    },
    (error) => {
        // console.error('API Response Error:');
        // console.error('  - Status:', error.response?.status);
        // console.error('  - URL:', error.config?.url);
        // console.error('  - Error Code:', error.code);
        // console.error('  - Error Message:', error.message);
        // console.error('  - Response Data:', error.response?.data);
        // console.error('  - Full Error:', error);

        // Enhance error object with user-friendly messages
        let userMessage = 'An unexpected error occurred';

        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            // Network/Server connection errors
            userMessage = '⚠️ Cannot connect to the server. Please check your connection or try again later.';
            error.isNetworkError = true;
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            // Timeout errors
            userMessage = '⏱️ Request timed out. The server is taking too long to respond.';
            error.isTimeoutError = true;
        } else if (error.response) {
            // Server responded with error status
            const status = error.response.status;

            if (status === 400) {
                userMessage = error.response.data?.message || '❌ Invalid request. Please check your input.';
            } else if (status === 401) {
                userMessage = error.response.data?.message || '🔒 Authentication required. Please log in again.';
                // Unauthorized - token expired or invalid
                // Only redirect if not already on login or register page
                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    const isAuthPage = currentPath === '/login' || currentPath === '/register';

                    // Only clear tokens and redirect if we're NOT on an auth page
                    if (!isAuthPage) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }
                    // If we're already on login/register, just let the error propagate
                    // so the form can display it
                }
            } else if (status === 403) {
                userMessage = '🚫 You do not have permission to perform this action.';
            } else if (status === 404) {
                userMessage = error.response.data?.message || '🔍 Resource not found.';
            } else if (status === 409) {
                userMessage = error.response.data?.message || '⚠️ Conflict: This resource already exists.';
            } else if (status === 413) {
                userMessage = '📦 File is too large. Please upload a smaller file.';
            } else if (status === 429) {
                userMessage = '⏸️ Too many requests. Please slow down and try again.';
            } else if (status >= 500) {
                userMessage = '🔧 Server error. Our team has been notified. Please try again later.';
                error.isServerError = true;
            } else {
                userMessage = error.response.data?.message || `Error: ${status}`;
            }
        }

        // Attach user-friendly message to error
        error.userMessage = userMessage;

        return Promise.reject(error);
    }
);


export default api;