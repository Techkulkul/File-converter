import "../css/Footer.css";
import { Link } from "react-router-dom";

import React from "react";
import {
  Facebook,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Section */}
          <div className="footer-section">
            <h3 className="section-title">Company</h3>
            <div className="company-info">
              <div className="logo">
                {/* <div className="logo-icon">
                  <img src={companyLogo} className="company-img"></img>
                </div> */}
                <span className="company-name">CUE7VEN</span>
              </div>
              <div className="social-links">
                <a
                  href="https://www.facebook.com/cue7ven"
                  className="social-link"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.youtube.com/@admincue7ven647"
                  className="social-link"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/company/cue7ven-digimark-private-limited/posts/?feedView=all"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="footer-section">
            <h3 className="section-title">Navigation</h3>
            <nav className="footer-nav">
              <Link to="/" className="home-link">
                Home
              </Link>
              <a href="https://cue7ven.com/about-us" className="nav-link">
                About Us
              </a>
              <a href="https://cue7ven.com/services" className="nav-link">
                Services
              </a>
              <a href="https://cue7ven.com/contact-us" className="nav-link">
                Contact Us
              </a>
            </nav>
          </div>

          {/* Legal Section */}
          <div className="footer-section">
            <h3 className="section-title">Legal</h3>
            <nav className="footer-nav">
              <a href="https://cue7ven.com/privacy-policy" className="nav-link">
                Privacy Policy
              </a>
              <a
                href="https://cue7ven.com/terms-condition"
                className="nav-link"
              >
                Terms & Conditions
              </a>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3 className="section-title">Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={18} />
                <a href="mailto:contact@cue7ven.com" className="contact-link">
                  contact@cue7ven.com
                </a>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <a href="tel:+1234567890" className="contact-link">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; 2025 CUE7VEN. All Rights Reserved.</p>
          </div>
          <button
            className="scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
