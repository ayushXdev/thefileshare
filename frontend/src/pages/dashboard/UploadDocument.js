import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const UploadDocument = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentType: '',
    document: null
  });
  const [fileName, setFileName] = useState('Choose file');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { title, description, documentType } = formData;

  const onChange = (e) => {
    if (e.target.name === 'document') {
      setFormData({ ...formData, document: e.target.files[0] });
      setFileName(e.target.files[0].name);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !description || !documentType || !formData.document) {
      setError('Please fill in all fields and upload a document');
      toast.error('Please fill in all fields and upload a document');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (formData.document.size > maxSize) {
      setError(`File size exceeds 10MB limit (${(formData.document.size / (1024 * 1024)).toFixed(2)}MB)`);
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setError('');
    setLoading(true);

    // Create form data for file upload
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('documentType', documentType);
    data.append('document', formData.document);

    try {
      console.log('Uploading document...', {
        fileName: formData.document.name,
        fileType: formData.document.type,
        fileSize: formData.document.size
      });
      
      const response = await axios.post('/api/documents', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      
      console.log('Upload response:', response.data);
      toast.success('Document uploaded successfully');
      navigate('/my-documents');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Failed to upload document';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Upload Document</h1>
      
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Document Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Enter document title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Enter document description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="documentType">
              <Form.Label>Document Type</Form.Label>
              <Form.Select
                name="documentType"
                value={documentType}
                onChange={onChange}
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

            <Form.Group className="mb-4" controlId="document">
              <Form.Label>Upload Document</Form.Label>
              <div className="custom-file">
                <Form.Control
                  type="file"
                  name="document"
                  onChange={onChange}
                  required
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Form.Text className="text-muted">
                  Selected file: {fileName}<br/>
                  Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max size: 10MB)
                </Form.Text>
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>Uploading...</>
              ) : (
                <>
                  <FaUpload className="me-2" /> Upload Document
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UploadDocument;
