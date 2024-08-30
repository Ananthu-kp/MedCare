import axios from "axios";
import { BASE_URL } from "../baseURL";

const adminAxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
})

adminAxiosInstance.interceptors.request.use(
    config => {
        const accessToken = sessionStorage.getItem("adminToken");
        
        config.headers['Authorization'] = `Bearer ${accessToken}`
        return config;
    },
    error => {
        throw error
    }
)

export default adminAxiosInstance