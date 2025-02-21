import React from 'react';
import Header from '../components/Home/Header';
import RoomForm from '../components/Room/RoomForm';
import JoinRoom from '../components/Room/JoinRoom';
import RecentRooms from '../components/Room/RecentRooms';
import Status from '../components/Room/Status';
import RoomList from '../components/Room/RoomList.jsx'; // Importing RoomList

function CreateRoom() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow w-full bg-gray-100 flex flex-col md:flex-row items-start justify-center">
        
        {/* Left Sidebar - Room List */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4 p-6 pt-16">
          <div className="bg-white rounded-lg shadow-md p-4">
            <RoomList />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow w-full max-w-2xl px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-8">
            <RoomForm />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <RecentRooms />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <JoinRoom />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <Status />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
