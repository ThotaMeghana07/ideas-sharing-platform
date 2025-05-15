import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const sendOTP = (email) => API.post('/send-otp', { email });
export const verifyOTP = (email, code) => API.post('/verify-otp', { email, code });