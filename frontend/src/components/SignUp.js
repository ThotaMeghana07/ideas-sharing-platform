import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { signup, sendOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username required';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Invalid email';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      // Step 1: Sign up (stores in pendingUser)
      if (signup(userData)) {
        // Step 2: Send OTP
        if (sendOTP()) {
          // Step 3: Redirect to OTP verification with email
          navigate('/verify-otp', { 
            state: { 
              email: formData.email,
              message: "We've sent a 6-digit code to your email"
            } 
          });
        }
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error-input' : ''}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>
        
        <div className="form-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        
        <div className="form-group">
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error-input' : ''}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>
        
        <button type="submit" className="submit-btn">
          Sign Up
        </button>
      </form>
      
      <p className="login-redirect">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};

export default SignUp;