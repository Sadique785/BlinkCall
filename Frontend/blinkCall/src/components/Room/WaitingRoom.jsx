import React from "react";

const WaitingRoom = ({ localVideoRef, isCreator }) => {
    return (
      <div className="flex flex-col items-center p-4">
        <div className="video-container mb-4">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-64 h-48 bg-black rounded-lg"
          />
        </div>
        <div className="mt-4 text-center">
          {isCreator ? (
            <>
              <div className="animate-pulse mb-2">Waiting for others to join...</div>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            <div>Joining the room...</div>
          )}
        </div>
      </div>
    );
  };

export default WaitingRoom