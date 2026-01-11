// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  API_URL: 'http://localhost:3000/api',
  SOCKET_URL: 'http://localhost:3000',
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GET_USER: '/auth/me',
    
    // Vote endpoints
    CAST_VOTE: '/vote/cast',
    VOTE_STATUS: '/vote/status',
    VOTE_STATISTICS: '/vote/statistics',
    
    // Admin endpoints
    ADMIN_LOGIN: '/admin/login',
    ADMIN_STATISTICS: '/admin/statistics',
    ADMIN_USERS: '/admin/users',
    ADMIN_VOTES: '/admin/votes',
    CREATE_INITIAL_ADMIN: '/admin/create-initial-admin'
  }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
  return API_CONFIG.API_URL + API_CONFIG.ENDPOINTS[endpoint];
}

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = false) {
  const url = getApiUrl(endpoint);
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Add auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem('nirapodh_token');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Add body for POST/PUT requests
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }
    
    return result;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Storage helpers
function saveAuthToken(token) {
  localStorage.setItem('nirapodh_token', token);
}

function getAuthToken() {
  return localStorage.getItem('nirapodh_token');
}

function removeAuthToken() {
  localStorage.removeItem('nirapodh_token');
}

function saveUserData(userData) {
  localStorage.setItem('nirapodh_user', JSON.stringify(userData));
}

function getUserData() {
  const data = localStorage.getItem('nirapodh_user');
  return data ? JSON.parse(data) : null;
}

function removeUserData() {
  localStorage.removeItem('nirapodh_user');
}

function logout() {
  removeAuthToken();
  removeUserData();
  window.location.href = '/login.html';
}
