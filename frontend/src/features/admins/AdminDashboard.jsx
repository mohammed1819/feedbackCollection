import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const [feeds, setFeeds] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [average, setAverage] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchTotalFeeds = async () => {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get(`/companyfeedbacks/${auth.slug}`);
        const feedbacks = response?.data?.feedbacks;
        setFeeds(feedbacks);
        const sum = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
        setAverage(Number((sum / feedbacks.length).toFixed(2)));
      } catch (err) {
        const message = err?.response?.data?.message || 'Something went wrong';
        console.log(message);
        setIsError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTotalFeeds();
  }, []);

  useEffect(() => {
    const fetchCompanyUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get('/companyusers');
        const users = response?.data?.users;
        const count = response?.data?.count;
        setCompanyUsers(users);
        setUsersCount(count);
      } catch (err) {
        const message = err?.response?.data?.message || 'Something went wrong';
        console.log(message);
        setIsError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyUsers();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Dashboard</h2>

      {isLoading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      )}

      {isError && (
        <div className="alert alert-danger text-center">{isError}</div>
      )}

      {/* Dashboard summary cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Feedbacks</h5>
              <p className="card-text fs-4">{feeds.length}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text fs-4">{usersCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Average Rating</h5>
              <p className="card-text fs-4">{average} ★</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Feedbacks */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Recent Feedbacks</h4>
          <Link to="/companyfeedbacks" className="btn btn-primary btn-sm">
            View All
          </Link>
        </div>
        <ul className="list-group">
          {feeds.slice(0, 3).map((feed) => (
            <li
              key={feed._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{feed.message}</span>
              <span className="text-warning fw-bold">⭐ {feed.rating}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* User List */}
      <div>
        <h4 className="mb-3">Company Users</h4>
        <ul className="list-group">
          {companyUsers.slice(0, 5).map((user) => (
            <li key={user._id} className="list-group-item">
              {user.email}
            </li>
          ))}
        </ul>
        {companyUsers.length > 5 && (
          <div className="mt-3 text-end">
            <Link to="/companyusers" className="btn btn-secondary btn-sm">
              View All Users
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
