import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import registerImg from '../assets/register.jpg';

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) {
      tempErrors.name = "Name is required";
    }
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store user data (in a real app, this would be handled by your backend)
        // In your Signup.js handleSubmit function
localStorage.setItem('registeredUser', JSON.stringify({
  name: formData.name,
  email: formData.email,
  password: formData.password  // Add this line
}));
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Please login to continue',
          confirmButtonColor: '#4481eb'
        });
        
        // Redirect to login
        navigate('/');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
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
      <div className="image-container">
        <img src={registerImg} alt="register" />
        <h2>Create Account</h2>
        <p>Start your journey with us today</p>
      </div>

      <div className="forms-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          
          <div className="input-group">
            <div className={`input-field ${errors.name ? 'error' : ''}`}>
              <FaUser />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="input-group">
            <div className={`input-field ${errors.email ? 'error' : ''}`}>
              <FaEnvelope />
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

          <div className="input-group">
            <div className={`input-field ${errors.confirmPassword ? 'error' : ''}`}>
              <FaLock />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="switch-form">
            <p>Already have an account? <Link to="/">Sign in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
