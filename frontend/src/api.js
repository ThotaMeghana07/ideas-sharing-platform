 // src/api.js
import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Ensure port is correct
});

// Your existing OTP functions
export const sendOTP = (email) => API.post('/send-otp', { email });
export const verifyOTP = (email, code) => API.post('/verify-otp', { email, code });

// --- ADD THESE FUNCTIONS IF THEY ARE MISSING OR INCORRECT ---
export const register = async (userData) => { // Make sure 'export' is here
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'An unknown error occurred during registration.' };
  }
};

export const login = async (credentials) => { // Make sure 'export' is here
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'An unknown error occurred during login.' };
  }
};

export const getCurrentUser = async (token) => { // Make sure 'export' is here
  try {
    const response = await API.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch user profile.' };
  }
};
// --- END OF FUNCTIONS TO ADD ---