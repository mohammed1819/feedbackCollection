import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 

function Navbar2() {
  const { setAuth, setPersist, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate("/"); 
  };

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
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/test" className="nav-link">Test</Link>
            </li>
            <li className="nav-item">
              <Link to="/feedbackform" className="nav-link">Feedback Form</Link>
            </li>
            <li className="nav-item">
              <Link to="/myfeedbacks" className="nav-link">My Feedbacks</Link>
            </li>
            <li className="nav-item">
              <Link to="/myfeedbackstats" className="nav-link">FeedBack Stats</Link>
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

export default Navbar2;
