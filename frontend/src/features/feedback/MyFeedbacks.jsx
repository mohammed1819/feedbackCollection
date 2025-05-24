import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const MyFeedbacks = () => {

  const axiosPrivate = useAxiosPrivate()
  const [feedbacks, setfeedbacks] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosPrivate.get('/myfeedbacks')
        if (response?.data?.message) {
          return console.log('No feedbacks yet')
        }
        setfeedbacks(response?.data?.feedbacks)
      } catch (err) {
        console.log(err?.response || err)
      }
    }
    fetchFeedbacks()
  }, [])

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
        feedbacks.length ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {
              feedbacks.map((feedback) => (
                <div className="col" key={feedback._id}>
                  <Link to={`/myfeedbacks/${feedback._id}`} className="text-decoration-none text-dark">
                    <div className="card h-100 border-0 shadow-lg rounded-4 hover-shadow transition">
                      <div className="card-body">
                        <h5 className="card-title text-primary fw-semibold">{feedback.category}</h5>
                        <p className="card-text text-secondary">
                          {feedback.message.length > 120 
                            ? `${feedback.message.slice(0, 120)}...` 
                            : feedback.message}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="badge bg-success">{`⭐ ${feedback.rating}`}</span>
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
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Loading your feedbacks...</p>
          </div>
        )
      }
    </div>
  )
}

export default MyFeedbacks
