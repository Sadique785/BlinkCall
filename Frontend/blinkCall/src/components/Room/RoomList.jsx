import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch rooms when component mounts
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get('/room/fetch-rooms/');
      console.log('room response', response)
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div className="w-full pt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Rooms</h2>
      
      {rooms.length === 0 ? (
        <p className="text-center text-gray-500">No active rooms available</p>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div 
              key={room.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{room.name}</h3>
                  {room.description && (
                    <p className="text-gray-600 mt-1">{room.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleJoinRoom(room.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Join Room
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomList;