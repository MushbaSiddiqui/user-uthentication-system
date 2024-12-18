import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import loginImg from '../assets/login.jpg';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
// Update your SweetAlert calls in components
const showAlert = (type, title, text) => {
  Swal.fire({
    icon: type,
    title: title,
    text: text,
    confirmButtonColor: '#4481eb',
    width: '300px', // Smaller width
    customClass: {
      popup: 'small-swal',
      title: 'small-swal-title',
      htmlContainer: 'small-swal-content',
      confirmButton: 'small-swal-button'
    }
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Get registered user data
        const registeredUser = localStorage.getItem('registeredUser');
        const userData = registeredUser ? JSON.parse(registeredUser) : null;

        console.log('Stored user:', userData); // Debug log
        console.log('Form data:', formData); // Debug log

        // Check if user exists and credentials match
        if (userData && userData.email === formData.email && userData.password === formData.password) {
          await Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome back!',
            timer: 1500,
            showConfirmButton: false
          });
          
          login(userData);
          navigate('/home');
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password',
            confirmButtonColor: '#4481eb'
          });
        }
      } catch (error) {
        console.error('Login error:', error); // Debug log
        await Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Please try again',
          confirmButtonColor: '#4481eb'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          
          <div className="input-group">
            <div className={`input-field ${errors.email ? 'error' : ''}`}>
              <FaUser />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <div className={`input-field ${errors.password ? 'error' : ''}`}>
              <FaLock />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            className={`btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="switch-form">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </form>
      </div>

      <div className="image-container">
        <img src={loginImg} alt="login" />
        <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info</p>
      </div>
    </div>
  );
}

export default Login;
