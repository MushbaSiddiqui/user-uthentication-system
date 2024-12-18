import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
// to check whether the user already loggin in or not use useeffect to check in localstorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Step 1: Check saved data
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Step 2: Set the user state
    }
    //Once the data check is done, the app removes the "Loading..." screen and shows the homepage.
    setLoading(false); // Step 3: Stop showing the loading screen
  }, []);
  //setUser(userData): Updates the app to show your name or profile after retrieving your data.
  //At the same time, your login details are saved to your phone storage (localStorage) so the
  //  app remembers you next time.
  const login = (userData) => {
    setUser(userData); //Update user state
    localStorage.setItem('user', JSON.stringify(userData)); // Save data to storage
  };

  const logout = async () => {
    await Swal.fire({
      icon: 'success',
      title: 'Logged Out Successfully',
      text: 'See you again!',
      timer: 1500,
      showConfirmButton: false
    });
    setUser(null); // Clear user state
    localStorage.removeItem('user'); // Remove saved user data
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};