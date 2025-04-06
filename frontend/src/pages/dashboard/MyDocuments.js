import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaTrash, FaShare, FaEdit } from 'react-icons/fa';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get('/api/documents');
        setDocuments(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch documents');
        toast.error(err.response?.data?.message || 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`/api/documents/${id}`);
        setDocuments(documents.filter(doc => doc._id !== id));
        toast.success('Document deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete document');
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Documents</h1>
        <Button as={Link} to="/upload-document" variant="primary">
          Upload New Document
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {documents.length === 0 ? (
        <Alert variant="info">
          You don't have any documents yet. Click the button above to upload your first document.
        </Alert>
      ) : (
        <Row>
          {documents.map((document) => (
            <Col md={4} key={document._id} className="mb-4">
              <Card className="document-card h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{document.title}</Card.Title>
                  <Badge bg="secondary" className="mb-2">
                    {document.documentType}
                  </Badge>
                  <Card.Text className="text-muted small">
                    Uploaded: {new Date(document.createdAt).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text className="mb-3">
                    {document.description.length > 100
                      ? `${document.description.substring(0, 100)}...`
                      : document.description}
                  </Card.Text>
                  <Card.Text className="text-muted small">
                    Shared with: {document.sharedWith.length} people
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="d-flex justify-content-between">
                    <Button
                      as={Link}
                      to={`/documents/${document._id}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      <FaEye className="me-1" /> View
                    </Button>
                    <Button
                      as={Link}
                      to={`/documents/${document._id}`}
                      variant="outline-success"
                      size="sm"
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      as={Link}
                      to={`/documents/${document._id}`}
                      state={{ shareTab: true }}
                    >
                      <FaShare className="me-1" /> Share
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(document._id)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyDocuments;
