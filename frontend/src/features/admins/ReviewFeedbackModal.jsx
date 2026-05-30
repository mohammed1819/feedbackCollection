import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const ReviewFeedbackModal = ({ feedback, onClose, onSubmit }) => {
  const [status, setStatus] = useState('approved')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const predefinedMessages = {
    approved: "Thank you for your feedback! We appreciate your input and have marked this as approved. We will take action on your suggestion.",
    rejected: "Thank you for your feedback. We have reviewed it and decided not to proceed with this suggestion at this time.",
    resolved: "Thank you for reporting this issue. We have successfully resolved it and appreciate your help in improving our service.",
    in_review: "Thank you for your feedback. We are currently reviewing your input and will get back to you soon."
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    // Auto-fill with predefined message if not customized
    if (!message) {
      setMessage(predefinedMessages[newStatus] || '')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(status, message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseDefault = () => {
    setMessage(predefinedMessages[status] || '')
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Review Feedback</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <p className="fw-bold text-muted">Feedback Message:</p>
              <p className="bg-light p-2 rounded">{feedback?.message}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="status" className="form-label fw-bold">
                  Status
                </label>
                <select
                  id="status"
                  className="form-select"
                  value={status}
                  onChange={handleStatusChange}
                  disabled={isSubmitting}
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="resolved">Resolved</option>
                  <option value="in_review">In Review</option>
                </select>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label htmlFor="message" className="form-label fw-bold mb-0">
                    Message to User
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleUseDefault}
                    disabled={isSubmitting}
                  >
                    Use Default
                  </button>
                </div>
                <textarea
                  id="message"
                  className="form-control"
                  rows="4"
                  placeholder="Write a message or leave empty to use default message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
                <small className="text-muted d-block mt-2">
                  {message.length > 0
                    ? `${message.length} characters`
                    : 'Leave empty to use the default message for this status'}
                </small>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewFeedbackModal
