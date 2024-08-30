import axios from "axios";
import { BASE_URL } from "../baseURL";

const userAxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
})

userAxiosInstance.interceptors.request.use(
    config => {
        const accessToken = sessionStorage.getItem("userToken");
        config.headers['Authorization'] = `Bearer ${accessToken}`
        return config;
    },
    error => {
        throw error
    }
)

export default userAxiosInstance