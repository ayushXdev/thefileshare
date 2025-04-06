import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaSave } from 'react-icons/fa';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/layout/Spinner';

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const { name, email, currentPassword, newPassword, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitProfile = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.put('/api/users/profile', { name });
      updateUser(res.data.data);
      setSuccess('Profile updated successfully');
      toast.success('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('Updating password...');
      
      const response = await axios.put('/api/users/password', {
        currentPassword,
        newPassword
      });
      
      console.log('Password update response:', response.data);
      
      if (response.data.success) {
        setSuccess('Password updated successfully');
        toast.success('Password updated successfully');
        
        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(response.data.message || 'Failed to update password');
        toast.error(response.data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Password update error:', err.response?.data || err.message);
      
      const errorMessage = err.response?.data?.message || 'Failed to update password';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If unauthorized, trigger logout
      if (err.response?.status === 401) {
        logout();
        toast.error('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <Container>
      <h1 className="mb-4">My Profile</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <FaUser className="text-primary me-2" size={24} />
                <Card.Title className="mb-0">Profile Information</Card.Title>
              </div>
              
              <Form onSubmit={onSubmitProfile}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    Email address cannot be changed
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : (
                    <>
                      <FaSave className="me-2" /> Update Profile
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <FaUser className="text-primary me-2" size={24} />
                <Card.Title className="mb-0">Change Password</Card.Title>
              </div>
              
              <Form onSubmit={onSubmitPassword}>
                <Form.Group className="mb-3" controlId="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={onChange}
                    placeholder="Enter current password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={onChange}
                    placeholder="Enter new password"
                    required
                    minLength="6"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    placeholder="Confirm new password"
                    required
                    minLength="6"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : (
                    <>
                      <FaSave className="me-2" /> Update Password
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
