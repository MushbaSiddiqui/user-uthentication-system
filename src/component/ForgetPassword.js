import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from 'react-icons/fa';
import forgotImg from '../assets/forgotpassword.jpg';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }
    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email' });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ 
        type: 'success', 
        text: 'Password reset link has been sent to your email' 
      });
      // In real app, make API call to send reset link
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to send reset link. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          <p className="form-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div className="input-group">
            <div className="input-field">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="switch-form">
            <p>Remember your password? <Link to="/">Sign in</Link></p>
          </div>
        </form>
      </div>

      <div className="image-container">
        <img src={forgotImg} alt="forgot password" />
        <h2>Forgot Password?</h2>
        <p>Don't worry! It happens. Please enter your email address.</p>
      </div>
    </div>
  );
}

export default ForgotPassword;