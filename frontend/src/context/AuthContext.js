import React, { createContext, useState, useEffect } from 'react';
import axios, { setAuthToken } from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (token) {
          setAuthToken(token);
          const res = await axios.get('/api/auth/me');
          setUser(res.data.data);
          setIsAuthenticated(true);
        } else {
          setAuthToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error loading user:', err.response?.data?.message || err.message);
        setToken(null);
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Refresh token on mount and when token changes
  useEffect(() => {
    const refreshToken = async () => {
      try {
        if (token) {
          setAuthToken(token);
        }
      } catch (err) {
        console.error('Error refreshing token:', err);
        logout();
      }
    };

    refreshToken();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Verify OTP
  const verifyOTP = async (verifyData) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', verifyData);
      const { token, user } = res.data;
      
      // Set token first
      setToken(token);
      setAuthToken(token);
      
      // Then set other state
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      // Clear everything on verification failure
      setToken(null);
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  };

  // Resend OTP
  const resendOTP = async (email) => {
    try {
      const res = await axios.post('/api/auth/resend-otp', { email });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      throw err;
    }
  };

  // Login user
  const login = async (loginData) => {
    try {
      const res = await axios.post('/api/auth/login', loginData);
      const { token, user } = res.data;
      
      // Set token first to ensure it's available for subsequent requests
      setToken(token);
      setAuthToken(token);
      
      // Then set other state
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      // Clear everything on login failure
      setToken(null);
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  };

  // Update user profile
  const updateUser = (updatedUserData) => {
    setUser({ ...user, ...updatedUserData });
  };

  // Logout user
  const logout = () => {
    // Clear token first
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('token');
    
    // Then clear other state
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        verifyOTP,
        resendOTP,
        login,
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
