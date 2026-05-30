import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const MyFeedbacks = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosPrivate.get('/myfeedbacks');
        if (response?.data?.message) {
          setFeedbacks([]);
          return console.log('No feedbacks yet');
        }
        const feedbacksData = response?.data?.feedbacks;
        setFeedbacks(feedbacksData.map(feedback => ({ ...feedback, status: feedback.status || 'Pending' })));
      } catch (err) {
        console.log(err?.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [axiosPrivate]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'resolved':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      case 'in_review':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold mb-0">📋 My Feedbacks</h2>
        <button
          className="btn btn-outline-primary rounded-pill px-4"
          onClick={() => navigate('/feedbackform')}
        >
          ➕ Add Feedback
        </button>
      </div>

      {
        loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Loading your feedbacks...</p>
          </div>
        ) : feedbacks.length ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {
              feedbacks.map((feedback) => (
                <div className="col" key={feedback._id}>
                  <Link to={`/myfeedbacks/${feedback._id}`} className="text-decoration-none text-dark">
                    <div className="card h-100 border-0 shadow-lg rounded-4 hover-shadow transition">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title text-primary fw-semibold mb-0">
                            {feedback.category
                              ? feedback.category.map(cat => cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')
                              : 'Other'}
                          </h5>
                          <span className={`badge ${getStatusBadgeClass(feedback.status)}`}>
                            {feedback.status}
                          </span>
                        </div>
                        <p className="card-text text-secondary flex-grow-1">
                          {feedback.message.length > 120
                            ? `${feedback.message.slice(0, 120)}...`
                            : feedback.message}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                          <span className="badge bg-light text-dark border">{`⭐ ${feedback.rating}`}</span>
                          <small className="text-muted">Click to view ➜</small>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            }
          </div>
        ) : (
          <div className="text-center mt-5 py-5 bg-light rounded-4 shadow-sm">
            <p className="fs-5 text-secondary mb-3">You haven't submitted any feedback yet.</p>
            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={() => navigate('/feedbackform')}
            >
              Submit Your First Feedback
            </button>
          </div>
        )
      }
    </div>
  )
}

export default MyFeedbacks
