import { toast } from 'react-hot-toast';
import axiosInstance from '../services/axios';

// Function to handle logout logic
export const handleLogout = async (dispatch, logout, persistor, navigate) => {
  try {
    // Make API call to logout endpoint
    const response = await axiosInstance.post("/auth/logout/");
    
    if (response.status === 200) {
      // Dispatch logout action to clear auth state
      dispatch(logout());

      // Clear persisted state
      try {
        await persistor.purge();
      } catch (err) {
        console.error("Error purging persistor: ", err);
      }
      
      toast.success('Logged out successfully');
      navigate('/login');
      return true;
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error("An error occurred during logout: ", error);
    toast.error('Failed to logout');
    return false;
  }
};

// Function to check if user is authenticated
export const checkAuthStatus = () => {
  // You could implement additional checks here if needed
  // For example, checking if the token is expired
  
  // For now, we'll just return the auth state from Redux
  // This function can be expanded later
  return (state) => state.auth.isAuthenticated;
};