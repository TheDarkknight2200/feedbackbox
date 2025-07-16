import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Send, MessageSquare, Shield, Eye } from 'lucide-react';
import { FeedbackService } from '../services/feedbackService';

export const FeedbackForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    try {
      FeedbackService.submitFeedback(message);
      setMessage('');
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="text-white">
              <div className="d-flex align-items-center gap-2">
                <MessageSquare size={20} />
                <h5 className="mb-0 fw-bold">Submit Anonymous Feedback</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 text-success mb-2">
                  <Shield size={16} />
                  <small className="fw-semibold">100% Anonymous</small>
                </div>
                <div className="d-flex align-items-center gap-2 text-info">
                  <Eye size={16} />
                  <small>No personal information is collected or stored</small>
                </div>
              </div>

              {showSuccess && (
                <Alert variant="success" className="d-flex align-items-center gap-2">
                  <Send size={16} />
                  Thank you! Your feedback has been submitted successfully.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Your Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or concerns..."
                    required
                    maxLength={2000}
                  />
                  <Form.Text className="text-muted">
                    {message.length}/2000 characters
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="dark" 
                    size="lg"
                    disabled={!message.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="me-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};