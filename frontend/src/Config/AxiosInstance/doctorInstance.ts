import axios from "axios";
import { BASE_URL } from "../baseURL";

const doctorAxiosInstance = axios.create({
    baseURL: `${BASE_URL}/doctor`,
    headers: {
        'Content-Type': 'application/json'
    },
})

doctorAxiosInstance.interceptors.request.use(
    config => {
        const accessToken = sessionStorage.getItem("doctorToken");
        config.headers['Authorization'] = `Bearer ${accessToken}`
        return config;
    },
    error => {
        throw error
    }
)

export default doctorAxiosInstance