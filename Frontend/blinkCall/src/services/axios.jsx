import axios from "axios";
import Cookies from 'js-cookie'
import { store } from "../redux/store";


const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

const axiosInstance = axios.create({
    baseURL:backendUrl,
    withCredentials:true
});


axiosInstance.interceptors.request.use(
    config => {
        const state = store.getState();
        const { accessToken, refreshToken, csrfToken: csrfTokenFromState } = state.auth;

        // Get CSRF token from cookies
        const csrfToken = Cookies.get('csrftoken') || csrfTokenFromState;

        // Add CSRF token to headers if available
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        // Add access token to Authorization header if available
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Add refresh token to headers if available
        if (refreshToken) {
            console.log('refreshToken', refreshToken)
            config.headers['X-Refresh-Token'] = refreshToken;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
