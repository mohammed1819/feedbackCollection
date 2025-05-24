import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import useAuth from "../../hooks/useAuth"
import useRefreshToken from "../../hooks/useRefreshToken"


const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();



    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])


     return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}
export default PersistLogin