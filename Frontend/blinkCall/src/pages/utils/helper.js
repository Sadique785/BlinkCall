import Cookies from 'js-cookie';

export const handleSessionExpiredLogout = async (backendUrl) => {
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
