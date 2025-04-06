import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Tab, Tabs, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaDownload, FaEdit, FaTrash, FaShare, FaSave, FaTimes } from 'react-icons/fa';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/layout/Spinner';

const DocumentDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.shareTab ? 'share' : 'details');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentType: ''
  });
  
  const [shareData, setShareData] = useState({
    email: '',
    accessLevel: 'view'
  });
  
  const [sharedUsers, setSharedUsers] = useState([]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(`/api/documents/${id}`);
        setDocument(res.data.data);
        setFormData({
          title: res.data.data.title,
          description: res.data.data.description,
          documentType: res.data.data.documentType
        });
        
        // Set shared users from the document data
        if (res.data.data.sharedWith && res.data.data.sharedWith.length > 0) {
          setSharedUsers(res.data.data.sharedWith);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch document');
        toast.error(err.response?.data?.message || 'Failed to fetch document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShareInputChange = (e) => {
    setShareData({ ...shareData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.put(`/api/documents/${id}`, formData);
      setDocument(res.data.data);
      setEditing(false);
      toast.success('Document updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update document');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`/api/documents/${id}`);
        toast.success('Document deleted successfully');
        navigate('/my-documents');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete document');
      }
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`/api/documents/${id}/share`, shareData);
      
      // Refresh document to get updated shared users
      const res = await axios.get(`/api/documents/${id}`);
      setDocument(res.data.data);
      setSharedUsers(res.data.data.sharedWith);
      
      // Reset form
      setShareData({
        email: '',
        accessLevel: 'view'
      });
      
      toast.success('Document shared successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to share document');
    }
  };

  const handleUpdateAccess = async (userId, newAccessLevel) => {
    try {
      await axios.put(`/api/documents/${id}/share/${userId}`, {
        accessLevel: newAccessLevel
      });
      
      // Refresh document to get updated shared users
      const res = await axios.get(`/api/documents/${id}`);
      setDocument(res.data.data);
      setSharedUsers(res.data.data.sharedWith);
      
      toast.success('Access level updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update access level');
    }
  };

  const handleRevokeAccess = async (userId) => {
    if (window.confirm('Are you sure you want to revoke access for this user?')) {
      try {
        await axios.delete(`/api/documents/${id}/share/${userId}`);
        
        // Refresh document to get updated shared users
        const res = await axios.get(`/api/documents/${id}`);
        setDocument(res.data.data);
        setSharedUsers(res.data.data.sharedWith);
        
        toast.success('Access revoked successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to revoke access');
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  // Use the isOwner flag from the server response
  const isOwner = document.isOwner;
  
  // Check if the user has edit access
  const canEdit = isOwner || document.sharedWith.some(share => 
    share.user && share.user._id === user._id && share.accessLevel === 'edit'
  );

  return (
    <Container>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="details" title="Document Details">
              {editing ? (
                <Form onSubmit={handleUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Document Type</Form.Label>
                    <Form.Select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select document type</option>
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      className="me-2"
                      onClick={() => setEditing(false)}
                    >
                      <FaTimes className="me-1" /> Cancel
                    </Button>
                    <Button variant="success" type="submit">
                      <FaSave className="me-1" /> Save Changes
                    </Button>
                  </div>
                </Form>
              ) : (
                <Row>
                  <Col md={8}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h2>{document.title}</h2>
                        <Badge bg="secondary" className="mb-3">
                          {document.documentType}
                        </Badge>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        href={document.fileUrl} 
                        target="_blank"
                        download
                      >
                        <FaDownload className="me-1" /> Download
                      </Button>
                    </div>
                    <p className="text-muted">
                      Uploaded by: {document.owner.name} on{' '}
                      {new Date(document.createdAt).toLocaleDateString()}
                    </p>
                    <p>{document.description}</p>
                    
                    {/* Document Preview */}
                    <div className="mb-4">
                      <h5>Document Preview:</h5>
                      {document.fileUrl && (
                        <div className="document-preview-container border rounded p-2 mb-3">
                          {document.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <img 
                              src={document.fileUrl} 
                              alt={document.title} 
                              className="img-fluid rounded" 
                              style={{ maxHeight: '500px', maxWidth: '100%' }} 
                            />
                          ) : document.fileUrl.match(/\.(pdf)$/) ? (
                            <div className="ratio ratio-16x9" style={{ height: '500px' }}>
                              <iframe 
                                src={document.fileUrl} 
                                title={document.title} 
                                allowFullScreen
                                className="rounded"
                              />
                            </div>
                          ) : (
                            <div className="text-center p-3 bg-light rounded">
                              <p>Preview not available for this file type.</p>
                              <Button variant="primary" href={document.fileUrl} target="_blank">
                                <FaDownload className="me-1" /> Download Document
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {canEdit && (
                      <div className="mb-4">
                        <Button
                          variant="primary"
                          className="me-2"
                          onClick={() => setEditing(true)}
                        >
                          <FaEdit className="me-1" /> Edit Details
                        </Button>
                        
                        {isOwner && (
                          <Button
                            variant="danger"
                            onClick={handleDelete}
                          >
                            <FaTrash className="me-1" /> Delete Document
                          </Button>
                        )}
                      </div>
                    )}
                  </Col>
                  
                  <Col md={4}>
                    <Card>
                      <Card.Body className="text-center">
                        <div className="document-preview mb-3">
                          {document.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <img
                              src={document.fileUrl}
                              alt={document.title}
                              className="img-fluid"
                            />
                          ) : (
                            <div className="document-icon">
                              <i className="fas fa-file-alt fa-5x"></i>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="primary"
                          href={document.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-100"
                        >
                          <FaDownload className="me-1" /> Download Document
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Tab>
            
            {isOwner && (
              <Tab eventKey="share" title="Share Document">
                <Row>
                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Body>
                        <Card.Title>Share with a Family Member</Card.Title>
                        <Form onSubmit={handleShare}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={shareData.email}
                              onChange={handleShareInputChange}
                              placeholder="Enter email address"
                              required
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Access Level</Form.Label>
                            <Form.Select
                              name="accessLevel"
                              value={shareData.accessLevel}
                              onChange={handleShareInputChange}
                              required
                            >
                              <option value="view">View Only</option>
                              <option value="edit">Can Edit</option>
                            </Form.Select>
                          </Form.Group>
                          
                          <Button variant="success" type="submit" className="w-100">
                            <FaShare className="me-1" /> Share Document
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Shared With</Card.Title>
                        {sharedUsers.length === 0 ? (
                          <p className="text-muted">
                            This document hasn't been shared with anyone yet.
                          </p>
                        ) : (
                          <ListGroup variant="flush">
                            {sharedUsers.map((share) => (
                              <ListGroup.Item
                                key={share.user._id}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <div>
                                  <div>{share.user.name}</div>
                                  <small className="text-muted">{share.user.email}</small>
                                  <div>
                                    <Badge
                                      bg={share.accessLevel === 'edit' ? 'success' : 'info'}
                                    >
                                      {share.accessLevel === 'edit' ? 'Can Edit' : 'View Only'}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRevokeAccess(share.user._id)}
                                >
                                  Revoke Access
                                </Button>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            )}
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DocumentDetails;
