// Constants
const BASE_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'auth_token';

// Core request function
const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem(TOKEN_KEY);

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Something went wrong');
            error.status = response.status;
            error.errors = data.errors;
            throw error;
        }

        return data;
    } catch (error) {
        // Add request metadata to error
        error.endpoint = endpoint;
        error.method = options.method || 'GET';
        throw error;
    }
};

// Auth endpoints
const register = async (userData) => {
    const response = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });

    localStorage.setItem(TOKEN_KEY, response.data.token);
    return response;
};

const login = async (credentials) => {
    const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });

    localStorage.setItem(TOKEN_KEY, response.data.token);
    return response;
};

const forgotPassword = async (email) => {
    return await request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
    });
};

const resetPassword = async (email, newPassword) => {
    return await request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword })
    });
};

const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// User endpoints
const getProfile = async () => {
    return await request('/users/profile');
};

const updateProfile = async (userData) => {
    return await request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
};

const deleteProfile = async () => {
    return await request('/users/account', {
        method: 'DELETE'
    });
};

const getUser = async (userId) => {
    const validatedId = validateId(userId);
    return await request(`/users/${validatedId}`);
};

const listUsers = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/users?${queryString}`);
};

const updateUser = async (userId, userData) => {
    const validatedId = validateId(userId);
    return await request(`/users/${validatedId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
};

const deleteUser = async (userId) => {
    const validatedId = validateId(userId);
    return await request(`/users/${validatedId}`, {
        method: 'DELETE'
    });
};

// Helper functions
const validateId = (id) => {
    if (!id) {
        throw new Error('ID is required');
    }
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        throw new Error('Invalid ID format');
    }
    return parsedId;
};

const isAuthenticated = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};

const getAuthToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Error handling
const getErrorMessage = (error) => {
    if (error.message && error.message.includes('Invalid ID')) {
        return 'Invalid user ID provided';
    }
    if (error.errors && Array.isArray(error.errors)) {
        return error.errors.map(e => e.message).join('\n');
    }
    return error.message || 'Something went wrong';
};

const handleError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);

    // Check for specific error types
    if (error.status === 401) {
        // Handle unauthorized access
        logout();
        window.location.href = 'login.html';
        return 'Session expired. Please login again.';
    }

    if (error.status === 403) {
        return 'You do not have permission to perform this action.';
    }

    if (error.status === 404) {
        return 'The requested resource was not found.';
    }

    if (error.errors) {
        // Handle validation errors
        return getErrorMessage(error);
    }

    return error.message || defaultMessage;
};

// Export all functions
const api = {
    // Auth
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,

    // User
    getProfile,
    updateProfile,
    deleteProfile,
    getUser,
    listUsers,
    updateUser,
    deleteUser,

    // Helpers
    isAuthenticated,
    getAuthToken,
    handleError,
    getErrorMessage
};

// Export for use in other files
window.api = api;
