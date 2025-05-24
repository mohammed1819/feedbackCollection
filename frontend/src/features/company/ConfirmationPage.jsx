import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "../../api/axios"

const ConfirmationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [statetoken, setstatetoken] = useState('')

  useEffect(() => {
    const confirmCompany = async () => {
      try {
        const token = searchParams.get('token')
        const response = await axios.get('/confirmCode', { params: { token } })

        if (response?.data?.message) {
          console.log(response?.data?.message)
          return
        }
        setstatetoken(response?.data?.token)
      } catch (err) {
        console.log(err?.response || err)
      }
    }
    confirmCompany()
  }, [])

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        '/confirmCode',
        JSON.stringify({ statetoken }),
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (response?.data?.message) {
        console.log(response?.data?.message)
      }
      if (response?.data?.success) {
        console.log('Confirmed successfully')
        navigate('/signup',{replace:true})
      }
    } catch (err) {
      console.log(err?.response || err)
    }
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">Confirm Company Registration</h3>
        <p className="lead text-center">
          A request was made using your company's email. Please confirm if it was you.
        </p>

        {statetoken ? (
          <div className="alert alert-info text-center">
            <strong>Confirmation Code:</strong> {statetoken}
          </div>
        ) : (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading...</p>
          </div>
        )}

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-success" onClick={handleConfirm}>
            Yes, it was me
          </button>
          <button className="btn btn-danger" onClick={() => navigate('/',{replace:true})}>
            No, take me back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage
