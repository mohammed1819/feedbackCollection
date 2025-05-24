import { createContext, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false)
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate()

    const logout = async () => {
        try {
            setLoggingOut(true);
            await axios.get("/logout");
            setAuth({});
            setPersist(false);
            localStorage.removeItem("persist");
            navigate('/',{replace:true}) 
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist ,loggingOut,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext