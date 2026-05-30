import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRole }) => {
    const location = useLocation()
    const { auth, loggingOut } = useAuth()

    const role = auth.role

    if (loggingOut && !auth.accessToken) return null


    const content = (
        !auth?.accessToken
            ? <Navigate to="/login" state={{ from: location }} replace />
            : (allowedRole && role != allowedRole)
                ? <Navigate to="/unauthorized" replace />
                : <Outlet />
    )

    return content
}
export default RequireAuth