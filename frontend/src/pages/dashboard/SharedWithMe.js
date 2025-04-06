import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaUser } from 'react-icons/fa';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';

const SharedWithMe = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedDocuments = async () => {
      try {
        const res = await axios.get('/api/documents/shared');
        setDocuments(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch shared documents');
        toast.error(err.response?.data?.message || 'Failed to fetch shared documents');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDocuments();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container>
      <h1 className="mb-4">Documents Shared With Me</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {documents.length === 0 ? (
        <Alert variant="info">
          No documents have been shared with you yet.
        </Alert>
      ) : (
        <Row>
          {documents.map((document) => {
            // Find the share entry for the current user
            const myShare = document.sharedWith.find(
              (share) => share.user === document.owner._id
            );
            
            return (
              <Col md={4} key={document._id} className="mb-4">
                <Card className="document-card h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{document.title}</Card.Title>
                    <Badge bg="secondary" className="mb-2">
                      {document.documentType}
                    </Badge>
                    <div className="mb-2">
                      <small className="text-muted">
                        <FaUser className="me-1" /> Shared by: {document.owner.name}
                      </small>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">
                        Shared on: {new Date(myShare?.sharedAt).toLocaleDateString()}
                      </small>
                    </div>
                    <Badge 
                      bg={myShare?.accessLevel === 'edit' ? 'success' : 'info'} 
                      className="mb-3"
                    >
                      {myShare?.accessLevel === 'edit' ? 'Can Edit' : 'View Only'}
                    </Badge>
                    <Card.Text>
                      {document.description.length > 100
                        ? `${document.description.substring(0, 100)}...`
                        : document.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <div className="d-flex justify-content-center">
                      <Button
                        as={Link}
                        to={`/documents/${document._id}`}
                        variant="outline-primary"
                      >
                        <FaEye className="me-1" /> View Document
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default SharedWithMe;
