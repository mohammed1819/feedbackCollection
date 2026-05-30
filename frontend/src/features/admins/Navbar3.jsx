import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 

function Navbar3() {
  const {  auth,logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate("/"); 
  };

  const slug = auth.slug

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">MyApp</a>
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

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to={`/${slug}/dashboard`} className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to={`/${slug}/companyfeedbacks`} className="nav-link">Company Feedbacks</Link>
            </li>
            <li className="nav-item">
              <Link to={`/${slug}/companyusers`} className="nav-link">Users</Link>
            </li>
            <li className="nav-item">
              <Link to={`/${slug}/analytics`} className="nav-link">Analytics</Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar3;
