import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import ReviewFeedbackModal from "./ReviewFeedbackModal"
import 'bootstrap/dist/css/bootstrap.min.css'

const CompanyFeedbacks = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [feeds, setFeeds] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const fetchFeeds = async () => {
    setIsLoading(true)
    try {
      const response = await axiosPrivate.get(`/companyfeedbacks/${auth.slug}`)
      const feedbacks = response?.data?.feedbacks
      console.log(response.data.feedbacks)
      setFeeds(feedbacks)
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong'
      console.log(message)
      setIsError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeeds()
  }, [auth.slug])

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'warning',
      in_review: 'info',
      approved: 'success',
      rejected: 'danger',
      resolved: 'secondary'
    }
    return colors[status] || 'secondary'
  }

  const handleReviewClick = (feedback) => {
    setSelectedFeedback(feedback)
    setShowReviewModal(true)
  }

  const handleCloseModal = () => {
    setShowReviewModal(false)
    setSelectedFeedback(null)
  }

  const handleReviewSubmit = async (status, message) => {
    try {
      await axiosPrivate.patch(`/companyfeedbacks/${auth.slug}/review`, {
        feedbackId: selectedFeedback._id,
        status,
        adminMessage: message
      })
      setShowReviewModal(false)
      setSelectedFeedback(null)
      // Refresh the feedbacks list
      fetchFeeds()
    } catch (err) {
      console.error('Error reviewing feedback:', err)
      alert('Failed to review feedback')
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Company Feedbacks</h2>

      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading feedbacks...</p>
        </div>
      )}

      {isError && <div className="alert alert-danger">{isError}</div>}

      {!isLoading && !isError && feeds?.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {feeds.map((feed) => (
            <div className="col" key={feed._id}>
              <div className="card h-100 shadow-sm border-0 rounded-4 bg-light p-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`badge bg-${getStatusBadgeColor(feed.status)}`}>
                      {feed.status}
                    </span>
                    <span className="badge bg-primary fs-6">
                      Rating: {feed.rating} ⭐
                    </span>
                  </div>
                  <p className="card-text text-dark">
                    {feed.message.length > 120
                      ? `${feed.message.slice(0, 120)}...`
                      : feed.message}
                  </p>
                  {feed.adminMessage && (
                    <div className="alert alert-info small mb-2">
                      <strong>Admin Message:</strong> {feed.adminMessage}
                    </div>
                  )}
                  <div className="d-flex gap-2">
                    <Link
                      to={`/${auth.slug}/companyfeedbacks/${feed._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </Link>
                    {feed.status === 'pending' && (
                      <button
                        onClick={() => handleReviewClick(feed)}
                        className="btn btn-sm btn-outline-success"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && !isError && (
          <p className="text-muted text-center">No feedbacks available.</p>
        )
      )}

      {showReviewModal && (
        <ReviewFeedbackModal
          feedback={selectedFeedback}
          onClose={handleCloseModal}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  )
}

export default CompanyFeedbacks
