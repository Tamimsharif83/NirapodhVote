// assets/js/api-config.js
const API_BASE_URL = 'http://localhost:3000/api';

// API endpoints
const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        PRECHECK: `${API_BASE_URL}/auth/precheck`,
        SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
        VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        ME: `${API_BASE_URL}/auth/me`
    },
    // Admin endpoints
    ADMIN: {
        LOGIN: `${API_BASE_URL}/admin/login`,
        STATISTICS: `${API_BASE_URL}/admin/statistics`,
        USERS: `${API_BASE_URL}/admin/users`,
        VOTES: `${API_BASE_URL}/admin/votes`
    },
    // Vote endpoints
    VOTING: {
        BALLOTS: `${API_BASE_URL}/vote/ballots`,
        VOTE: `${API_BASE_URL}/vote/vote`,
        STATUS: `${API_BASE_URL}/vote/status`,
        STATISTICS: `${API_BASE_URL}/vote/statistics`
    },
    // Ballot endpoints
    BALLOT: {
        CREATE: `${API_BASE_URL}/ballot/create`,
        LIST: `${API_BASE_URL}/ballot/list`,
        ALL: `${API_BASE_URL}/ballot/all`
    },
    // Notice endpoints
    NOTICE: {
        CREATE: `${API_BASE_URL}/notice/create`,
        LIST: `${API_BASE_URL}/notice/list`
    },
    // Complaint endpoints
    COMPLAINT: {
        CREATE: `${API_BASE_URL}/complaint/create`,
        MY: `${API_BASE_URL}/complaint/my`,
        ALL: `${API_BASE_URL}/complaint/all`
    }
};

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to set auth token
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Helper function to remove auth token
function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// Helper function to make API calls
async function apiCall(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}