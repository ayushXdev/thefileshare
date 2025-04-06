import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Secure Doc Share | All Rights Reserved
            </p>
            <p className="mb-0 text-muted small">
              Securely share government documents with family members
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
