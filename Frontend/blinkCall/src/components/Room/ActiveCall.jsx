import React, { useEffect } from "react";

const ActiveCall = ({ localVideoRef, remoteVideoRef, localStream, remoteStream, onEndCall }) => {
    useEffect(() => {
        console.log('ActiveCall mounted');
        
        // Set streams explicitly
        if (localVideoRef.current && localStream) {
            console.log('Setting local stream in ActiveCall');
            localVideoRef.current.srcObject = localStream;
        }
        
        if (remoteVideoRef.current && remoteStream) {
            console.log('Setting remote stream in ActiveCall');
            remoteVideoRef.current.srcObject = remoteStream;
        }

        // Monitor stream states
        const localVideoElement = localVideoRef.current;
        const remoteVideoElement = remoteVideoRef.current;

        const handleLocalPlay = () => console.log('Local video playing');
        const handleRemotePlay = () => console.log('Remote video playing');
        const handleLocalError = (e) => console.error('Local video error:', e);
        const handleRemoteError = (e) => console.error('Remote video error:', e);

        localVideoElement?.addEventListener('play', handleLocalPlay);
        remoteVideoElement?.addEventListener('play', handleRemotePlay);
        localVideoElement?.addEventListener('error', handleLocalError);
        remoteVideoElement?.addEventListener('error', handleRemoteError);

        return () => {
            localVideoElement?.removeEventListener('play', handleLocalPlay);
            remoteVideoElement?.removeEventListener('play', handleRemotePlay);
            localVideoElement?.removeEventListener('error', handleLocalError);
            remoteVideoElement?.removeEventListener('error', handleRemoteError);
        };
    }, [localStream, remoteStream]);

    return (
        <div className="relative h-screen">
            {/* Main remote video */}
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
            
            {/* Local video overlay */}
            <div className="absolute top-4 right-4">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-48 h-36 bg-black rounded-lg shadow-lg"
                />
            </div>
            
            {/* Controls overlay */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <button
                    onClick={onEndCall}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Debug info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
                <p>Local Tracks: {localStream?.getTracks().length || 0}</p>
                <p>Remote Tracks: {remoteStream?.getTracks().length || 0}</p>
            </div>
        </div>
    );
};

export default ActiveCall;