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

        console.log('API Request Details:');
        console.log('  - Method:', config.method?.toUpperCase());
        console.log('  - URL:', config.url);
        console.log('  - Base URL:', config.baseURL);
        console.log('  - Full URL:', `${config.baseURL}${config.url}`);
        console.log('  - Data:', config.data);
        console.log('  - Headers:', config.headers);

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
    (response) => {
        console.log('API Response Success:');
        console.log('  - Status:', response.status);
        console.log('  - URL:', response.config.url);
        console.log('  - Data:', response.data);
        return response;
    },
    (error) => {
        console.error('API Response Error:');
        console.error('  - Status:', error.response?.status);
        console.error('  - URL:', error.config?.url);
        console.error('  - Error Code:', error.code);
        console.error('  - Error Message:', error.message);
        console.error('  - Response Data:', error.response?.data);
        console.error('  - Full Error:', error);

        // Handle common errors globally
        if (error.response?.status === 401) {
            // Unauthorized - token expired or invalid
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;