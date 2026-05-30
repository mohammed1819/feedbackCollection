import { useEffect, useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

const CompanyUsers = () => {
  const axiosPrivate = useAxiosPrivate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchUsers = async () => {
      try {
        const response = await axiosPrivate.get('/companyusers')
        if (isMounted) {
          setUsers(response?.data?.users || [])
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          console.error(err?.response || err)
          setError(err?.response?.data?.message || 'Failed to fetch users')
          setLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isMounted = false
    }
  }, [axiosPrivate])

  if (loading) return <div className="alert alert-info">Loading users...</div>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!users.length) return <div className="alert alert-warning">No users found</div>

  return (
    <div className="container mt-4">
      <h2>Company Users</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td><span className="badge bg-info">{user.role}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted mt-3">Total Users: {users.length}</p>
    </div>
  )
}

export default CompanyUsers
