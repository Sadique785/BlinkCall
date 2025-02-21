import React, { useState, useEffect } from 'react'
import axiosInstance from '../../services/axios';
import { useNavigate } from 'react-router-dom';

function RoomForm() {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your room creation logic here
    try {
      const response = await axiosInstance.post('/room/create-room/', {
        name: roomName,
        description: description
      });

      console.log('Room created:', response.data);
      navigate(`/room/${response.data.room_id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      // Add error handling - maybe show an error message to user
    }

  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response =  await axiosInstance.get('/auth/test-auth/');

        console.log('auth check status',response)


      } catch (error) { 

        console.log(error)
        
      }

    }

    checkAuth();
  }, [])


  return (
    <div className="w-full pt-10 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Videoroom</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="roomName" className="mb-1 font-medium">
            Room Name
          </label>
          <input
            id="roomName"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder='My Room'
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1 font-medium">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='A description regarding the room'
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          />
        </div>
        
        <div className='flex justify-end mt-6'>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Create Room
        </button>

        </div>
      </form>
    </div>
  )
}

export default RoomForm;