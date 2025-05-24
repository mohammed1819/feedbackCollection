
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MyApp</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacts">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/anonymousfeed">FeedBack Form</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-primary fw-bold" to="/company-register">
                Company/Admin
              </Link>
            </li>
          </ul>

          <div className="d-flex ms-3">
            <Link to="/login" className="btn btn-outline-primary me-2">Sign In</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
