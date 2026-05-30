import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const { setAuth, persist, setPersist,auth} = useAuth();
    const emailRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    // const from = location.state?.from?.pathname || '/dashboard';
    
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isAdmin, setisAdmin] = useState(false);

    
    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);

    const handleChange = () => {
        setisAdmin(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = isAdmin ? 'admin' : 'user';
            const response = await axios.post('/login', JSON.stringify({ email, pwd, role }), {
                headers: { 'Content-type': 'application/json' }
            });

            const accessToken = response?.data?.accessToken;
            const slug = response?.data?.slug
            setAuth({ email, pwd, accessToken, slug, role});
            setEmail('');
            setPwd('');

            const from = isAdmin ? (location.state?.from?.pathname || `/${slug}/dashboard`) : (location.state?.from?.pathname || '/dashboard')

            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server Response');
            } else if (err?.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err?.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    const togglePersist = () => {
        setPersist(prev => !prev);
    };

    useEffect(() => {
        localStorage.setItem('persist', persist);
    }, [persist]);

    return (
        <section
            className="vh-100 d-flex align-items-center justify-content-center"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px'
            }}
        >
            <div className="card shadow-lg text-start" style={{
                width: '100%',
                maxWidth: '450px',
                borderRadius: '15px',
                border: 'none'
            }}>
                <div className="card-body p-5">
                    <h3 className="mb-4 text-center text-primary">Sign In</h3>

                    <p
                        ref={errRef}
                        className={errMsg ? "alert alert-danger" : "d-none"}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="name@example.com"
                                ref={emailRef}
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                            <label htmlFor="email">Email address</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="persist"
                                onChange={togglePersist}
                                checked={persist}
                                style={{ accentColor: '#00cffe' }}
                            />
                            <label className="form-check-label" htmlFor="persist">
                                Trust This Device
                            </label>
                        </div>

                        <div className="form-check mb-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="admin"
                                onChange={handleChange}
                                checked={isAdmin}
                                style={{ accentColor: '#00cffe' }}
                            />
                            <label className="form-check-label" htmlFor="admin">
                                Admin Login?
                            </label>
                        </div>

                        <button
                            className="btn w-100 mb-3"
                            type="submit"
                            style={{
                                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                                color: 'white',
                                border: 'none'
                            }}
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="mb-0">
                            Need an Account?{' '}
                            <Link to="/signup" className="fw-bold" style={{ color: '#007aff' }}>
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
