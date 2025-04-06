import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaUserCircle, FaFileAlt, FaShareAlt, FaUpload } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

const AppNavbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <>
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/dashboard">
          <FaFileAlt className="me-1" /> Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/my-documents">
          <FaFileAlt className="me-1" /> My Documents
        </Nav.Link>
        <Nav.Link as={Link} to="/shared-with-me">
          <FaShareAlt className="me-1" /> Shared With Me
        </Nav.Link>
        <Nav.Link as={Link} to="/upload-document">
          <FaUpload className="me-1" /> Upload
        </Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link as={Link} to="/profile">
          <FaUserCircle className="me-1" /> {user?.name || 'Profile'}
        </Nav.Link>
        <Button variant="outline-light" onClick={handleLogout}>
          <FaSignOutAlt className="me-1" /> Logout
        </Button>
      </Nav>
    </>
  );

  const guestLinks = (
    <Nav className="ms-auto">
      <Nav.Link as={Link} to="/login">Login</Nav.Link>
      <Nav.Link as={Link} to="/register">Register</Nav.Link>
    </Nav>
  );

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? '/dashboard' : '/'}>
          Secure Doc Share
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? authLinks : guestLinks}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
