import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Collect Feedback That Matters</h1>
          <p className="lead mt-3">
            Empower your product decisions with real insights from real users — whether they’re signed in or not.
          </p>
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link to="/anonymousfeed" className="btn btn-outline-secondary btn-lg">
              Give Anonymous Feedback
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" id="features">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose Us?</h2>
            <p className="text-muted">We make feedback simple, fast, and effective — for everyone.</p>
          </div>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="h5">Quick Surveys</div>
              <p>Create customizable forms in seconds.</p>
            </div>
            <div className="col-md-4 mb-4">
              <div className="h5">Live Feedback</div>
              <p>See responses roll in instantly — anonymously or logged in.</p>
            </div>
            <div className="col-md-4 mb-4">
              <div className="h5">Powerful Analytics</div>
              <p>Track trends and make data-driven decisions from any type of feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-primary text-white text-center py-5" id="cta">
        <div className="container">
          <h2 className="fw-bold">Start Collecting Feedback Today</h2>
          <p className="lead">No credit card required. Easy setup in under 5 minutes.</p>
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-3">
            <Link to="/signup" className="btn btn-light btn-lg">
              Sign Up Now
            </Link>
            <Link to="/anonymousfeed" className="btn btn-outline-light btn-lg">
              Submit Anonymous Feedback
            </Link>
            <Link to="/register-company" className="btn btn-outline-light btn-lg">
              Register as a Company
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
