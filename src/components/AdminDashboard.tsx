import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Pagination, Row, Col, Alert } from 'react-bootstrap';
import { 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Trash2, 
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { FeedbackService } from '../services/feedbackService';
import { FeedbackMessage } from '../types';

export const AdminDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesPerPage = 10;

  const loadMessages = () => {
    const data = FeedbackService.getMessagesPaginated(currentPage, messagesPerPage);
    setMessages(data.messages);
    setTotalPages(data.totalPages);
    setTotalMessages(data.totalMessages);
    setUnreadCount(FeedbackService.getUnreadCount());
  };

  useEffect(() => {
    loadMessages();
  }, [currentPage]);

  const handleMarkAsRead = (id: string) => {
    FeedbackService.markAsRead(id);
    loadMessages();
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      FeedbackService.deleteMessage(id);
      loadMessages();
      // Adjust current page if needed
      if (messages.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0 fw-bold">Admin Dashboard</h2>
              <p className="text-muted mb-0">Manage feedback submissions</p>
            </div>
            <Button variant="dark" onClick={loadMessages}>
              <RefreshCw size={16} className="me-1" />
              Refresh
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <MessageSquare size={24} className="text-dark" />
              </div>
              <h4 className="mb-0">{totalMessages}</h4>
              <small className="text-muted">Total Messages</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <Eye size={24} className="text-warning" />
              </div>
              <h4 className="mb-0">{unreadCount}</h4>
              <small className="text-muted">Unread</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <EyeOff size={24} className="text-success" />
              </div>
              <h4 className="mb-0">{totalMessages - unreadCount}</h4>
              <small className="text-muted">Read</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <BarChart3 size={24} className="text-dark" />
              </div>
              <h4 className="mb-0">{totalPages}</h4>
              <small className="text-muted">Pages</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {messages.length === 0 ? (
        <Alert variant="info" className="text-center">
          <MessageSquare size={48} className="mb-2 opacity-50" />
          <h5>No messages found</h5>
          <p className="mb-0">
            No feedback has been submitted yet.
          </p>
        </Alert>
      ) : (
        <>
          <Row>
            {messages.map((message) => (
              <Col key={message.id} className="mb-3">
                <Card className={`h-100 ${!message.isRead ? 'border-warning' : ''}`}>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      {!message.isRead && (
                        <Badge bg="warning">New</Badge>
                      )}
                    </div>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={message.isRead}
                      >
                        {message.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-2">{message.message}</p>
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <Calendar size={14} />
                      <small>{formatDate(message.timestamp)}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First 
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};