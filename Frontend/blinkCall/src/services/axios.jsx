import axios from "axios";
import Cookies from 'js-cookie';
import { store } from "../redux/store";
import { updateTokens, logout } from "../redux/auth/authSlice";
import { persistor } from "../redux/store";
import { toast } from 'react-hot-toast';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Handle complete logout process
const handleSessionExpiredLogout = async () => {
    try {
        // First try to logout from backend
        try {
            await axios.post(
                `${backendUrl}/auth/logout/`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    }
                }
            );
        } catch (error) {
            console.error("Backend logout failed:", error);
            // Continue with frontend cleanup even if backend logout fails
        }

        // Clear Redux state
        store.dispatch(logout());

        // Clear persisted state
        try {
            await persistor.purge();
        } catch (err) {
            console.error("Error purging persistor: ", err);
        }

        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
    } catch (error) {
        console.error("Error during session expired logout:", error);
        // If everything fails, force redirect to login
        window.location.href = '/login';
    }
};

// Request interceptor
axiosInstance.interceptors.request.use(
    config => {
        const state = store.getState();
        const { accessToken, refreshToken, csrfToken: csrfTokenFromState } = state.auth;

        const csrfToken = Cookies.get('csrftoken') || csrfTokenFromState;

        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        if (refreshToken) {
            config.headers['X-Refresh-Token'] = refreshToken;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // If the error is not 401 or the request was for refreshing token, reject immediately
        if (error.response?.status !== 401 || originalRequest.url === '/auth/token/refresh/') {
            return Promise.reject(error);
        }

        if (!isRefreshing) {
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${backendUrl}/auth/token/refresh/`,
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            'X-CSRFToken': Cookies.get('csrftoken'),
                            'X-Refresh-Token': store.getState().auth.refreshToken
                        }
                    }
                );
                console.log(response)

                const { access: newAccessToken } = response.data;
                store.dispatch(updateTokens({ accessToken: newAccessToken }));
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Handle failed refresh by performing complete logout
                processQueue(refreshError, null);
                await handleSessionExpiredLogout();
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        })
            .then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }
);

export default axiosInstance;