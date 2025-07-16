import React, { ReactNode } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { AuthService } from '../services/authService';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/';
  };

  return (
    <div className="min-vh-100 bg-body app-container">
      <Navbar bg="dark" variant="dark" className="navbar-custom shadow-lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <MessageSquare size={28} className="brand-icon" />
            <span className="brand-text">FeedbackBox</span>
          </Navbar.Brand>
          
          <div className="navbar-controls">
            <div className="d-flex align-items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </Container>
      </Navbar>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer-custom">
        <Container>
          <div className="text-center footer-text">
            <small>
              &copy; 2025 FeedbackBox. Anonymous feedback system designed for privacy and security.
            </small>
          </div>
        </Container>
      </footer>
    </div>
  );
};