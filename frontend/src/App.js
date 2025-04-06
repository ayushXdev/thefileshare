import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import VerifyOTP from './pages/auth/VerifyOTP';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyDocuments from './pages/dashboard/MyDocuments';
import SharedWithMe from './pages/dashboard/SharedWithMe';
import UploadDocument from './pages/dashboard/UploadDocument';
import DocumentDetails from './pages/dashboard/DocumentDetails';
import Profile from './pages/dashboard/Profile';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

// Context
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="container flex-grow-1 py-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              
              {/* Private Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/my-documents" element={<PrivateRoute><MyDocuments /></PrivateRoute>} />
              <Route path="/shared-with-me" element={<PrivateRoute><SharedWithMe /></PrivateRoute>} />
              <Route path="/upload-document" element={<PrivateRoute><UploadDocument /></PrivateRoute>} />
              <Route path="/documents/:id" element={<PrivateRoute><DocumentDetails /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
};

export default App;
