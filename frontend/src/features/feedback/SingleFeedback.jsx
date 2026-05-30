import { useParams, useNavigate, Link } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useEffect, useState } from "react"
import ReactStars from 'react-rating-star-with-type'
import 'bootstrap/dist/css/bootstrap.min.css'

const SingleFeedback = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true)
        const response = await axiosPrivate.get('/myfeedbacks/single', {
          params: { id }
        })
        const result = response?.data?.feedback
        setFeedback(result)
      } catch (err) {
        console.log(err?.response || err)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchFeedback()
    }
  }, [id, axiosPrivate])

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
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
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>

      {
        loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Loading feedback...</p>
          </div>
        ) : feedback ? (
          <div className="card shadow-lg border-0 rounded-4 p-4 bg-light">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="card-title text-primary mb-0">
                  {feedback.category
                    ? feedback.category.map(cat => cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')
                    : 'Other'}
                </h2>
                <span className={`badge ${getStatusBadgeClass(feedback.status || 'Pending')} fs-6 px-3 py-2`}>
                  {feedback.status || 'Pending'}
                </span>
              </div>
              
              <div className="p-3 bg-white rounded-3 border mb-4">
                <p className="card-text fs-5 text-dark mb-0">
                  <strong>Message:</strong>
                </p>
                <p className="fs-5 text-secondary mt-1 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {feedback.message}
                </p>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <span className="text-muted fw-bold">Submitted At:</span>
                  <p className="text-dark">
                    {feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                
                <div className="col-md-6 mb-3">
                  <span className="text-muted fw-bold">Rating:</span>
                  <div className="mt-1">
                    <ReactStars
                      value={feedback.rating || 0}
                      isEdit={false}
                      activeColors={['#dc3545', '#fd7e14', '#ffc107', '#6f42c1', '#6610f2']}
                      valueShow={true}
                      isHalf={true}
                      size={28}
                    />
                  </div>
                </div>
              </div>

              {feedback.adminMessage && (
                <div className="mt-4 p-3 bg-info-subtle border border-info-subtle rounded-3">
                  <h5 className="text-info-emphasis fw-bold">Admin Response</h5>
                  <p className="text-dark-emphasis mb-1">{feedback.adminMessage}</p>
                  {feedback.reviewedAt && (
                    <small className="text-muted">
                      Reviewed on: {new Date(feedback.reviewedAt).toLocaleString()}
                    </small>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center mt-5">
            <p className="text-danger fs-5">Feedback not found.</p>
            <Link to="/myfeedbacks" className="btn btn-primary mt-2">
              Back to My Feedbacks
            </Link>
          </div>
        )
      }
    </div>
  )
}

export default SingleFeedback
