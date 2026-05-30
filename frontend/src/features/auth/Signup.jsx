import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate , useLocation} from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Signup = () => {

    const location = useLocation()
    const emailRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate()

    const { setAuth, setPersist,persist } = useAuth()

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [isAdmin, setisAdmin] = useState(false)
    const [companies, setcompanies] = useState([])
    const [companyCodeAdmin, setcompanyCodeAdmin] = useState('')
    const [companyCodeUser, setcompanyCodeUser] = useState('')
    const [option, setoption] = useState('')

    useEffect(()=>{
        const fetchCompanies = async () => {
            try{
                const response = await axios.get('/companies',{headers:{'Content-Type':'application/json'}})
                if(response?.data?.companies){
                    setcompanies(response?.data?.companies)
                }
            }catch(err){
                console.log(err?.response || err)
            }
        }
        fetchCompanies()
    },[])

    useEffect(() => {
        emailRef?.current?.focus();
    }, [])

    useEffect(() => {
        setValidEmail(emailRegex.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd])

    useEffect(()=>{
        setoption(isAdmin ? companyCodeAdmin : companyCodeUser)
    },[companyCodeAdmin,companyCodeUser])


    const handleSubmit = async (e) => {
        e.preventDefault()
        const v1 = emailRegex.test(email)
        const v2 = PWD_REGEX.test(pwd)
        if (!v1 || !v2) {
            setErrMsg('Invalid Entry')
            return
        }
        try {
            const role = isAdmin ? 'admin' : 'user'
            const code = isAdmin ? companyCodeAdmin : companyCodeUser
            const response = await axios.post('/signup', JSON.stringify({ email, pwd, role ,code}),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            const accessToken = response?.data?.accessToken
            const roleByServer = response?.data?.role
            const slug = response?.data?.slug
            console.log(slug,roleByServer,accessToken)
            setAuth({ email, pwd, accessToken, slug, role:roleByServer});
            localStorage.setItem('persist', true)
            setPersist(true)
            setSuccess(true)
            setEmail('')
            setPwd('')
            setMatchPwd('')
            const from = isAdmin ? (location.state?.from?.pathname || `/${slug}/dashboard`) : (location.state?.from?.pathname || '/dashboard')
            navigate(from,{replace:true})
        }catch(err){
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Email Taken');
            } else {
                setErrMsg('Registration Failed')
                console.log(err?.response?.status)
            }
            errRef.current.focus();
        }
    }

    const handleChange = () => {
        setisAdmin(prev=>!prev)
    }

    return (
       <div className="container mt-5">
  {success ? (
    <div className="alert alert-success text-center">
      <h1>Success!</h1>
      <p>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </p>
    </div>
  ) : (
    <div className="card shadow p-4">
      <h2 className="mb-4 text-center">Register</h2>
      <p
        ref={errRef}
        className={errMsg ? "alert alert-danger" : "d-none"}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Email:
            <FontAwesomeIcon icon={faCheck} className={validEmail ? "text-success ms-2" : "d-none"} />
            <FontAwesomeIcon icon={faTimes} className={!validEmail && email ? "text-danger ms-2" : "d-none"} />
          </label>
          <input
            type="email"
            className="form-control"
            id="username"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            aria-invalid={validEmail ? "false" : "true"}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
          <div className={emailFocus && email && !validEmail ? "form-text text-danger" : "d-none"}>
            <FontAwesomeIcon icon={faInfoCircle} /> Enter a valid email.
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
            <FontAwesomeIcon icon={faCheck} className={validPwd ? "text-success ms-2" : "d-none"} />
            <FontAwesomeIcon icon={faTimes} className={!validPwd && pwd ? "text-danger ms-2" : "d-none"} />
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <div className={pwdFocus && !validPwd ? "form-text text-danger" : "d-none"}>
            <FontAwesomeIcon icon={faInfoCircle} /> Must be 8–24 characters, include uppercase, lowercase, a number, and a special character.
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label htmlFor="confirm_pwd" className="form-label">
            Confirm Password:
            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "text-success ms-2" : "d-none"} />
            <FontAwesomeIcon icon={faTimes} className={!validMatch && matchPwd ? "text-danger ms-2" : "d-none"} />
          </label>
          <input
            type="password"
            className="form-control"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <div className={matchFocus && !validMatch ? "form-text text-danger" : "d-none"}>
            <FontAwesomeIcon icon={faInfoCircle} /> Must match the first password.
          </div>
        </div>

        {/* Admin Toggle */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="adminCheck"
            onChange={handleChange}
            checked={isAdmin}
          />
          <label className="form-check-label" htmlFor="adminCheck">
            Admin Signup?
          </label>
        </div>

        {/* Company Input */}
        {!isAdmin ? (
          <div className="mb-3">
            <label htmlFor="company" className="form-label">Select Your Company</label>
            <select
              className="form-select"
              name="company"
              id="company"
              value={companyCodeUser}
              onChange={(e) => setcompanyCodeUser(e.target.value)}
              required
            >
              <option value="" disabled>Select Company</option>
              {companies.map((company) => (
                <option key={company.companyCode} value={company.companyCode}>
                  {company.Name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-3">
            <label htmlFor="companyCodeAdmin" className="form-label">
              Enter Company Code
            </label>
            <input
              type="text"
              className="form-control"
              value={companyCodeAdmin}
              onChange={(e) => setcompanyCodeAdmin(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={!validEmail || !validPwd || !validMatch || !option}
        >
          Sign Up
        </button>
      </form>
      <p className="mt-3 text-center">
        Already registered? <Link to="/login">Sign In</Link>
      </p>
    </div>
  )}
</div>

    )
}

export default Signup
