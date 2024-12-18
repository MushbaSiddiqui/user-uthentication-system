import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import forgotImg from '../assets/forgotpassword.jpg';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize EmailJS
  emailjs.init("CxxUf7lrk9WBpErZw"); // Replace with your EmailJS public key

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      // Get registered user data
      const registeredUser = localStorage.getItem('registeredUser');
      const userData = registeredUser ? JSON.parse(registeredUser) : null;

      console.log("Registered User:", userData); // Debug log
      console.log("Entered Email:", email); // Debug log

      if (userData && userData.email === email) {
        // Generate reset token
        const resetToken = Math.random().toString(36).slice(2);
        const resetLink = `${window.location.origin}/reset-password/${resetToken}`;

        // Store reset token
        localStorage.setItem('resetToken', JSON.stringify({
          email,
          token: resetToken,
          expires: Date.now() + 3600000 // 1 hour expiry
        }));

        // EmailJS template parameters
        const templateParams = {
          to_email: email,
          to_name: userData.name || 'User',
          reset_link: resetLink
        };

        console.log("Sending email with params:", templateParams); // Debug log

        // Send email using EmailJS
        const response = await emailjs.send(
          'service_k3z03r9', // Replace with your EmailJS service ID
          'template_53gerrp', // Replace with your EmailJS template ID
          templateParams
        );

        console.log("EmailJS Response:", response); // Debug log

        if (response.status === 200) {
          await Swal.fire({
            icon: 'success',
            title: 'Reset Link Sent!',
            text: 'Please check your email for password reset instructions',
            confirmButtonColor: '#4481eb'
          });
        } else {
          throw new Error('Failed to send email');
        }
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Email Not Found',
          text: 'No account found with this email address',
          confirmButtonColor: '#4481eb'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error); // Debug log
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send reset link. Please try again.',
        confirmButtonColor: '#4481eb'
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
            <div className={`input-field ${error ? 'error' : ''}`}>
              <FaEnvelope />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>

          <button 
            type="submit" 
            className={`btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="switch-form">
            <p>
              Remember your password? <Link to="/">Back to Login</Link>
            </p>
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