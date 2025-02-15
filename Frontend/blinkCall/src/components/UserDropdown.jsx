import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { persistor } from '../redux/store'; // Import persistor from your store
import axiosInstance from '../services/axios';


const UserDropdown = ({ isOpen, onClose, anchorEl }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen || !anchorEl) return null;

  // Get position for dropdown
  const rect = anchorEl.getBoundingClientRect();
  const dropdownStyle = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    left: `${rect.left - 100 + rect.width}px`, // Align right edge with avatar
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Make API call to logout endpoint
      const response = await axiosInstance.post("/auth/logout/");
      
      if (response.status === 200) {
        dispatch(logout());

        try {
          await persistor.purge();
        } catch (err) {
          console.error("Error purging persistor: ", err);
        }
        
        toast.success('Logged out successfully');
        navigate('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error("An error occurred during logout: ", error);
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div
        style={dropdownStyle}
        className="z-50 w-48 rounded-lg shadow-lg py-1 bg-white border border-gray-200 animate-fadeIn"
      >
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </>,
    document.body
  );
};

export default UserDropdown;