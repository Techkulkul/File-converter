import companyLogo from "/cue7ven-logo.png";
import "../css/Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header>
        <nav>
          <div className="header">
            <div className="company_logo">
              <a href="https://cue7ven.com/">
                <img
                  src={companyLogo}
                  alt="company-logo"
                  className="cue7ven-logo"
                ></img>
              </a>
            </div>
            <div className="list-box">
              <ul className="list-items">
                <Link to="/">
                  <li className="">Home</li>
                </Link>
                <Link to="/about">
                  <li>About</li>
                </Link>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
