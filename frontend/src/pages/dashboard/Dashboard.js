import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaShareAlt, FaUpload } from 'react-icons/fa';
import axios from '../../utils/axios';
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/layout/Spinner';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    sharedWithMe: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get my documents count
        const myDocsRes = await axios.get('/api/documents');
        
        // Get shared with me count
        const sharedDocsRes = await axios.get('/api/documents/shared');
        
        setStats({
          totalDocuments: myDocsRes.data.count,
          sharedWithMe: sharedDocsRes.data.count
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container>
      <h1 className="mb-4">Dashboard</h1>
      <p className="lead">Welcome back, {user?.name}</p>
      
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <FaFileAlt className="text-primary me-2" size={24} />
                <Card.Title className="mb-0">My Documents</Card.Title>
              </div>
              <Card.Text className="mb-4">
                You have <strong>{stats.totalDocuments}</strong> documents
              </Card.Text>
              <Button 
                as={Link} 
                to="/my-documents" 
                variant="outline-primary"
                className="mt-auto"
              >
                View Documents
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <FaShareAlt className="text-success me-2" size={24} />
                <Card.Title className="mb-0">Shared With Me</Card.Title>
              </div>
              <Card.Text className="mb-4">
                <strong>{stats.sharedWithMe}</strong> documents shared with you
              </Card.Text>
              <Button 
                as={Link} 
                to="/shared-with-me" 
                variant="outline-success"
                className="mt-auto"
              >
                View Shared Documents
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <FaUpload className="text-info me-2" size={24} />
                <Card.Title className="mb-0">Upload Document</Card.Title>
              </div>
              <Card.Text className="mb-4">
                Securely store and share your important documents
              </Card.Text>
              <Button 
                as={Link} 
                to="/upload-document" 
                variant="outline-info"
                className="mt-auto"
              >
                Upload New Document
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>About Secure Doc Share</Card.Title>
              <Card.Text>
                Secure Doc Share is a platform for securely storing and sharing government documents with family members.
                Your documents are encrypted and stored safely in the cloud, and you have complete control over who can access them.
              </Card.Text>
              <Card.Text>
                Use the navigation menu to manage your documents, share them with family members, and update your profile.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
