import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    // const { roles } = useAuth()
    const { auth ,loggingOut} = useAuth()

    if(loggingOut && !auth.accessToken) return null

    const content = (
        auth?.accessToken
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )

    return content
}
export default RequireAuth