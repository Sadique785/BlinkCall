import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ActiveCall from '../components/Room/ActiveCall';
import WaitingRoom from '../components/Room/WaitingRoom';
import { useNavigate } from 'react-router-dom';


function RoomPage() {
  const navigate = useNavigate();
    const { roomId } = useParams();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const websocketRef = useRef(null);
    const peerConnectionRef = useRef(null);
    
    // State management
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isActiveCall, setIsActiveCall] = useState(false);
    const [canConnect, setCanConnect] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const userId = useSelector((state) => state.auth.userId);
    console.log('isCreator', isCreator)

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
        ]
    };

    // Initialize WebRTC peer connection
    const initializePeerConnection = () => {
      console.log('Initializing peer connection...');
      peerConnectionRef.current = new RTCPeerConnection(configuration);


      peerConnectionRef.current.onconnectionstatechange = (event) => {
        console.log('Connection state changed:', peerConnectionRef.current.connectionState);
        if (peerConnectionRef.current.connectionState === 'connected') {
            console.log('WebRTC peers are now fully connected!');
            setIsActiveCall(true);
        }
    };
        // Debug ICE connection state
        peerConnectionRef.current.oniceconnectionstatechange = (event) => {
            console.log('ICE connection state:', peerConnectionRef.current.iceConnectionState);
        };

        if (localStream) {
          console.log('Adding local stream tracks to peer connection...', localStream.getTracks());
          localStream.getTracks().forEach(track => {
              peerConnectionRef.current.addTrack(track, localStream);
          });
      }

      peerConnectionRef.current.ontrack = (event) => {
        console.log('Received remote track:', event.streams[0]);
        console.log('Remote tracks:', event.streams[0].getTracks());
        
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
            console.log('Setting remote video stream');
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('Sending ICE candidate:', event.candidate);
            const message = {
                type: 'ice_candidate',
                candidate: event.candidate,
                room_id: roomId,
                user_id: userId
            };
            websocketRef.current.send(JSON.stringify(message));
        }
    };


    
    };


    // Handle initial media setup
    useEffect(() => {
      const initializeMedia = async () => {
          try {
              console.log('Requesting media devices...');
              const stream = await navigator.mediaDevices.getUserMedia({ 
                  video: true, 
                  audio: true 
              });
              console.log('Got local stream:', stream.getTracks());
              setLocalStream(stream);
              
              if (localVideoRef.current) {
                  console.log('Setting local video stream');
                  localVideoRef.current.srcObject = stream;
              }
              setIsVideoReady(true);
              setIsConnecting(false);
          } catch (err) {
              console.error('Error accessing media devices:', err);
              setError('Error accessing media devices');
              setIsConnecting(false);
          }
      };

      initializeMedia();

      return () => {
          if (localStream) {
              localStream.getTracks().forEach(track => track.stop());
          }
          if (peerConnectionRef.current) {
              peerConnectionRef.current.close();
          }
      };
  }, []);

    // Connect to WebSocket and handle messages
    useEffect(() => {
      if (!isVideoReady) return;

      const WS_URL = `ws://localhost:8000/ws/room/${roomId}/`;
      websocketRef.current = new WebSocket(WS_URL);

      websocketRef.current.onopen = () => {
          console.log('WebSocket Connected');
          const message = {
              type: 'join_room',
              room_id: roomId,
              user_id: userId,
          };
          websocketRef.current.send(JSON.stringify(message));
      };

      websocketRef.current.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
          
          switch (data.type) {
              case 'user_joined':
                  console.log('New user joined:', data.user_id);
                  // Set creator status based on creator_id from server
                  setIsCreator(userId === data.creator_id);
                  
                  // Only show connect button to creator when non-creator joins
                  if (userId === data.creator_id && data.user_id !== userId) {
                      setCanConnect(true);
                  }
                  break;

              case 'offer':
                  if (data.user_id !== userId) {
                      initializePeerConnection();
                      try {
                          await peerConnectionRef.current.setRemoteDescription(
                              new RTCSessionDescription(data.offer)
                          );
                          const answer = await peerConnectionRef.current.createAnswer();
                          await peerConnectionRef.current.setLocalDescription(answer);
                          
                          const message = {
                              type: 'answer',
                              answer: answer,
                              room_id: roomId,
                              user_id: userId
                          };
                          websocketRef.current.send(JSON.stringify(message));
                      } catch (err) {
                          console.error('Error handling offer:', err);
                      }
                  }
                  break;

              case 'answer':
                  if (data.user_id !== userId) {
                      try {
                          await peerConnectionRef.current.setRemoteDescription(
                              new RTCSessionDescription(data.answer)
                          );
                      } catch (err) {
                          console.error('Error handling answer:', err);
                      }
                  }
                  break;

              case 'ice_candidate':
                  if (data.user_id !== userId) {
                      try {
                          await peerConnectionRef.current.addIceCandidate(
                              new RTCIceCandidate(data.candidate)
                          );
                      } catch (err) {
                          console.error('Error adding ICE candidate:', err);
                      }
                  }
                  break;

              case 'user_left':
                  console.log('User left:', data.user_id);
                  if (remoteVideoRef.current) {
                      remoteVideoRef.current.srcObject = null;
                  }
                  setIsActiveCall(false);
                  setCanConnect(false);
                  break;
          }
      };

      websocketRef.current.onerror = (error) => {
          console.error('WebSocket Error:', error);
          setError('WebSocket connection error');
      };

      websocketRef.current.onclose = () => {
          console.log('WebSocket Disconnected');
      };

      return () => {
          if (websocketRef.current) {
              websocketRef.current.close();
          }
      };
  }, [roomId, isVideoReady, userId]);

  
    // Handle connect button click
    const handleConnect = async () => {
      console.log('Connect button clicked, creating offer...');
      initializePeerConnection();
      try {
          const offer = await peerConnectionRef.current.createOffer();
          console.log('Created offer:', offer);
          await peerConnectionRef.current.setLocalDescription(offer);
          
          const message = {
              type: 'offer',
              offer: offer,
              room_id: roomId,
              user_id: userId
          };
          console.log('Sending offer message:', message);
          websocketRef.current.send(JSON.stringify(message));
      } catch (err) {
          console.error('Error creating offer:', err);
          setError('Failed to create connection offer');
      }
  };


    // Handle end call
    const handleEndCall = () => {
      // Close peer connection
      if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
      }

      // Stop all tracks in both streams
      if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
      }
      if (remoteStream) {
          remoteStream.getTracks().forEach(track => track.stop());
      }

      // Close WebSocket connection
      if (websocketRef.current) {
          websocketRef.current.close();
      }

      // Reset states
      setIsActiveCall(false);
      setLocalStream(null);
      setRemoteStream(null);

      // Navigate to rooms page
      navigate('/room');
  };

    // Render different states
    if (isConnecting) {
      return <div className="flex items-center justify-center h-screen">
          <div>Connecting to room...</div>
      </div>;
  }

  if (error) {
      return <div className="flex items-center justify-center h-screen">
          <div className="text-red-500">{error}</div>
      </div>;
  }


  if (isActiveCall) {
    console.log('Switching to ActiveCall view');
    console.log('Local stream tracks:', localStream?.getTracks());
    console.log('Remote stream tracks:', remoteStream?.getTracks());
    
    return (
        <ActiveCall
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            localStream={localStream}
            remoteStream={remoteStream}
            onEndCall={handleEndCall}
        />
    );
}

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="mb-4">
                Connection Status: {peerConnectionRef.current?.connectionState || 'Not initialized'}
            </div>
            <WaitingRoom
                localVideoRef={localVideoRef}
                isCreator={isCreator}
            />
            {isCreator && canConnect && (
                <button
                    onClick={handleConnect}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
                >
                    Connect
                </button>
            )}
            {isActiveCall && (
                <ActiveCall
                    localVideoRef={localVideoRef}
                    remoteVideoRef={remoteVideoRef}
                    onEndCall={handleEndCall}
                />
            )}
        </div>
    );


}

export default RoomPage;