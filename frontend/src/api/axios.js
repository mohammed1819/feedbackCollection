import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3500'

export default axios.create({
    baseURL:baseURL,
    withCredentials:true
})

export const axiosPrivate = axios.create({
    baseURL:baseURL,
    headers:{'Content-Type':'application/json'},
    withCredentials:true
})
