import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Resetpassword from '../assets/resetpassword.jpg';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify token validity
    const resetData = JSON.parse(localStorage.getItem('resetToken'));
    if (!resetData || resetData.token !== token || Date.now() > resetData.expires) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid or Expired Link',
        text: 'Please request a new password reset link',
        confirmButtonColor: '#4481eb'
      }).then(() => {
        navigate('/forgot-password');
      });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Both fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const resetData = JSON.parse(localStorage.getItem('resetToken'));
      const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

      if (resetData && registeredUser && resetData.email === registeredUser.email) {
        // Update the password
        const updatedUser = {
          ...registeredUser,
          password: password
        };

        // Save updated user data
        localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
        
        // Remove reset token
        localStorage.removeItem('resetToken');

        await Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful!',
          text: 'You can now login with your new password',
          confirmButtonColor: '#4481eb'
        });

        navigate('/');
      } else {
        throw new Error('Invalid reset attempt');
      }
    } catch (error) {
      console.error('Reset error:', error);
      setError('Failed to reset password. Please try again.');
      
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: 'Something went wrong. Please try again.',
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
            Please enter your new password
          </p>

          <div className="input-group">
            <div className={`input-field ${error ? 'error' : ''}`}>
              <FaLock />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
            </div>
          </div>

          <div className="input-group">
            <div className={`input-field ${error ? 'error' : ''}`}>
              <FaLock />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="switch-form">
            <Link to="/">Back to Login</Link>
          </div>
        </form>
      </div>

      <div className="image-container">
        <img src={Resetpassword}  alt="reset password" />
        <h2>Reset Your Password</h2>
        <p>Enter your new password to secure your account</p>
      </div>
    </div>
  );
}

export default ResetPassword;