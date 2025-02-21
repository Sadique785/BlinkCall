import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { Toaster } from 'react-hot-toast';
import CreateRoom from "./pages/CreateRoom";
import ProtectedRoute from "./Protected/ProtectedRoute";
import RoomPage from "./pages/RoomPage";



function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            padding: '14px',
            background: '#f1f5f9', // Light gray-blue background
            color: '#1e293b', // Dark blue-gray text
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow
          },
          success: {
            style: {
              background: '#d1fae5', // Light green
              color: '#065f46', // Dark green text
            },
          },
          error: {
            style: {
              background: '#fb8c74', // Light red
              color: '#991b1b', // Dark red text
            },
          },
          info: {
            style: {
              background: '#dbeafe', // Light blue
              color: '#1e40af', // Dark blue text
            },
          },
          warning: {
            style: {
              background: '#d1fae5', // Light green (same as success)
              color: '#065f46', // Dark green text (same as success)
            },
          },
        }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        <Route path="/room"
        element={
          <ProtectedRoute>
            <CreateRoom/>
          </ProtectedRoute>
        }
        />

        <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;