import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const {setAuth} = useAuth()
        const refresh = async () => {
        const response = await axios.get('/refresh')
        setAuth(prev => {
            return{
                ...prev,
                accessToken: response.data.accessToken ,
                slug:response.data.slug,
                role:response.data.role
            }
        })
        return response.data.accessToken
    }
    return refresh
}
export default useRefreshToken
