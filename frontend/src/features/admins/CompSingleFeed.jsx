import { useEffect, useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useParams } from "react-router-dom"
import ReactStars from 'react-rating-star-with-type'
import 'bootstrap/dist/css/bootstrap.min.css'

const CompSingleFeed = () => {
  const { id } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const [feedback, setfeedback] = useState()

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axiosPrivate.get('/myfeedbacks/single', {
          params: { id }
        })
        const result = response?.data?.feedback
        console.log(result)
        setfeedback(result)
      } catch (err) {
        console.log(err?.response || err)
      }
    }
    fetchFeedback()
  }, [id])

  return (
    <div className="container mt-5">
      {
        feedback ? (
          <div className="card shadow-lg border-0 rounded-4 p-4 bg-light">
            <div className="card-body">
              <h2 className="card-title text-primary mb-3">{feedback.category}</h2>
              <p className="card-text fs-5 text-dark">
                <strong>Message:</strong> {feedback.message}
              </p>
              <p className="text-muted">
                <strong>Submitted At:</strong> {new Date(feedback.submittedAt).toLocaleString()}
              </p>

              <div className="mt-3">
                <label className="form-label fw-bold mb-1">Rating:</label>
                <div>
                  <ReactStars
                    value={feedback.rating}
                    isEdit={false}
                    activeColors={['#dc3545', '#fd7e14', '#ffc107', '#6f42c1', '#6610f2']}
                    valueShow={true}
                    isHalf={true}
                    size={32}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Loading feedback...</p>
          </div>
        )
      }
    </div>
  )
}

export default CompSingleFeed
