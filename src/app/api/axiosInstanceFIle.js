import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../Utils/appConstants';

// Create an Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // if (error.response?.status === 401) {
        //     toast.error('Unauthorized: Please login again');
        // } else {
        //     toast.error(error.response?.data?.message || 'Something Went Wrong');
        // }
        return Promise.reject(error);
    }
);

// Function to merge custom headers without affecting existing calls
const mergeHeaders = (customHeaders) => ({
    headers: {
        ...api.defaults.headers.common, // Preserve existing headers
        ...customHeaders, // Override with custom headers if provided
    }
});

const request = {
    get: (route, params = {}, customHeaders = {}) => api.get(route, { ...mergeHeaders(customHeaders), params }),
    post: (route, body = {}, params = {}, customHeaders = {}) => api.post(route, body, { ...mergeHeaders(customHeaders), params }),
    put: (route, body = {}, params = {}, customHeaders = {}) => api.put(route, body, { ...mergeHeaders(customHeaders), params }),
    patch: (route, body = {}, params = {}, customHeaders = {}) => api.patch(route, body, { ...mergeHeaders(customHeaders), params }),
    delete: (route, params = {}, customHeaders = {}) => api.delete(route, { ...mergeHeaders(customHeaders), params }),
};

export default request;
