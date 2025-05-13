import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email from signup

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === '123456') { // Mock verification
      verifyOTP();
      navigate('/ideas');
    } else {
      setError('Invalid OTP - Try 123456');
    }
  };

  return (
    <div className="otp-screen">
      <h2>Verify Email</h2>
      <p>We sent a code to {email || 'your email'}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default OTPVerification;