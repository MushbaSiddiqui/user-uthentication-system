import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <main className="dashboard">
        <div className="profile">
          <img src="https://www.w3schools.com/w3images/avatar2.png" alt="Profile" className="profile-img" />
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <p className="welcome-message">Welcome to your dashboard!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </main>
    </div>
  );
}

export default Home;
