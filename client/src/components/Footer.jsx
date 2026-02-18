import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Floating Elements */}
      <div className="footer-float"></div>
      <div className="footer-float"></div>
      <div className="footer-float"></div>
      
      <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img 
              src="/logo.png" 
              alt="Nova Transport Logo" 
              className="footer-logo-img"
            />
            <h2 className="footer-logo-text">Nova Transport</h2>
          </div>
          <p className="footer-tagline">Your trusted ride-hailing partner</p>
          <p className="footer-description">
            Experience safe, reliable, and affordable transportation with Nova Transport. 
            We're committed to making your journey comfortable and convenient.
          </p>
          <div className="social-links">
            <a href="https://facebook.com/novatransport" className="social-link" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://twitter.com/novatransport" className="social-link" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="https://instagram.com/novatransport" className="social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/novatransport" className="social-link" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Company Section */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/press">Press</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/investors">Investors</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-section">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><a href="/help">Help Center</a></li>
            <li><a href="/safety">Safety</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/feedback">Feedback</a></li>
            <li><a href="/emergency">Emergency</a></li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="footer-section">
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><a href="/terms">Terms</a></li>
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/cookies">Cookies</a></li>
            <li><a href="/licenses">Licenses</a></li>
            <li><a href="/compliance">Compliance</a></li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="footer-section">
          <h3>Services</h3>
          <ul className="footer-links">
            <li><a href="/ride">Ride</a></li>
            <li><a href="/drive">Drive</a></li>
            <li><a href="/business">Business</a></li>
            <li><a href="/delivery">Delivery</a></li>
            <li><a href="/fleet">Fleet</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2024 Nova Transport. All rights reserved.
        </p>
        <ul className="footer-bottom-links">
          <li><a href="/sitemap">Sitemap</a></li>
          <li><a href="/accessibility">Accessibility</a></li>
          <li><a href="/language">Language</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
