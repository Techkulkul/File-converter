import { Link } from "react-router-dom";
import { useState } from "react";
import companyLogo from "/cue7ven-logo.png";
import "../css/Header.css";

const Header = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleLogoLoad = () => {
    setLogoLoaded(true);
    setLogoError(false);
  };

  const handleLogoError = () => {
    setLogoError(true);
    setLogoLoaded(false);
    console.warn("Company logo failed to load");
  };

  const handleExternalLinkClick = (e, url) => {
    try {
      new URL(url);
      window.open(url, "_blank", "noopener,noreferrer");
      e.preventDefault();
    } catch (error) {
      console.error("Invalid URL:", error);
      e.preventDefault();
    }
  };

  return (
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <div className="header">
          <div className="company_logo">
            <a
              href="https://cue7ven.com/"
              onClick={(e) =>
                handleExternalLinkClick(e, "https://cue7ven.com/")
              }
              aria-label="Visit Cue7ven website"
              rel="noopener noreferrer"
            >
              {!logoError ? (
                <img
                  src={companyLogo}
                  alt="Cue7ven company logo"
                  className={`cue7ven-logo ${
                    logoLoaded ? "loaded" : "loading"
                  }`}
                  onLoad={handleLogoLoad}
                  onError={handleLogoError}
                  loading="lazy"
                />
              ) : (
                <div className="logo-fallback" aria-label="Cue7ven">
                  Cue7ven
                </div>
              )}
            </a>
          </div>

          <div className="list-box">
            <ul className="list-items" role="menubar">
              <li role="none">
                <Link
                  to="/"
                  role="menuitem"
                  aria-label="Go to home page"
                  className="nav-link"
                >
                  Home
                </Link>
              </li>
              <li role="none">
                <Link
                  to="/about"
                  role="menuitem"
                  aria-label="Go to about page"
                  className="nav-link"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
