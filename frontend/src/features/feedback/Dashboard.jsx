import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";


const Dashboard = () => {

  const axiosPrivate = useAxiosPrivate()
  const [feedbacks, setfeedbacks] = useState([])
  const [count, setcount] = useState(null)
  const [average, setaverage] = useState(0)
  let totalRating
  let averageRating

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get('/myfeedbacks')
        if (response?.data?.message) {
          console.log(response?.data?.message)
          setcount(0)
          setaverage(0)
          return
        }
        const feedbacksData = response?.data?.feedbacks
        setfeedbacks(feedbacksData)
        setcount(feedbacksData.length)
        totalRating = feedbacksData.reduce((sum, feedback) => sum + feedback.rating, 0)
        averageRating = totalRating / feedbacksData.length
        setaverage(Number(averageRating.toFixed(2)))
      } catch (err) {
        console.log(err?.response || err)
      }
    }
    fetchData()
  }, [])


  const { auth } = useAuth()
  const decoded = jwtDecode(auth.accessToken)


  // const userName = decoded.UserInfo.username.split('@gmail.com')[0]

  return (
    <div className="container py-5">
      <h2 className="mb-4">Welcome back, !</h2>

      {/* Dashboard summary cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Feedback</h5>
              <p className="card-text fs-4">{count}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Pending Reviews</h5>
              <p className="card-text fs-4">14</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Avg. Rating</h5>
              <p className="card-text fs-4">{`${average} ★`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* More content can go here */}
      <div className="mt-5">
        <div className="mt-5 d-flex justify-content-between align-items-center">
          <h4>Recent Feedback</h4>
          <Link to="/myfeedbacks" className="btn btn-primary btn-sm">
            View All
          </Link>
        </div>
        <ul className="list-group">
          {feedbacks.length ? (
            feedbacks.slice(0, 3).map((feedback) => (
              <p
                key={feedback._id}
                className="mb-3 p-3 rounded shadow-sm text-secondary bg-light d-flex justify-content-between align-items-center"
                style={{ fontSize: '1.1rem', lineHeight: '1.4', fontWeight: '500' }}
              >
                <span>{feedback.message}</span>
                <span className="text-warning fw-bold" style={{ fontSize: '1.1rem' }}>
                  ⭐ {feedback.rating.toFixed(1)}
                </span>
              </p>
            ))
          ) : (<div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading feedbacks...</p>
          </div>)}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
