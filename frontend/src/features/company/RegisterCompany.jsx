import { useEffect, useState } from "react"
import axios from "../../api/axios"
import { useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterCompany = () => {

  const navigate = useNavigate()

  const [Name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [industry, setIndustry] = useState('Technology')
  const [mail, setMail] = useState('')
  const [mailMatch, setMailMatch] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const response = await axios.post(
        '/company-register',
        JSON.stringify({ Name, slug, industry, mail }),
        { headers: { 'Content-type': 'application/json' } }
      )

      if (response?.data?.message) {
        setMessage(response.data.message)
        return
      }

      setMessage('✅ Company registered successfully!')
      setName('')
      setSlug('')
      setIndustry('Technology')
      setMail('')
      setMailMatch(false)
      navigate('/',{replace:true})
    } catch (err) {
      setMessage('❌ Error registering company. Check console.')
      console.log(err?.response || err)
    }
  }

  useEffect(() => {
    setMailMatch(emailRegex.test(mail))
  }, [mail])

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: '600px' }}>
        <h3 className="text-center mb-4">Register Your Company</h3>

        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Company Name</label>
            <input
              type="text"
              id="name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="slug" className="form-label">Domain / Slug</label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="form-select"
            >
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Government">Government</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Company Gmail Address</label>
            <input
              type="email"
              id="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              className={`form-control ${mail && !mailMatch ? 'is-invalid' : ''}`}
              required
            />
            {!mailMatch && mail && (
              <div className="invalid-feedback">Enter a valid email address.</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!Name || !slug || !mailMatch}
          >
            Register Company
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterCompany
