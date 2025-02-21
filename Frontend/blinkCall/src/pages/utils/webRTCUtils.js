// webRTCUtils.js
export const initializePeerConnection = (configuration, localStream, onIceCandidate, onTrack) => {
    const peerConnection = new RTCPeerConnection(configuration);

    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    }

    peerConnection.onicecandidate = onIceCandidate;
    peerConnection.ontrack = onTrack;

    return peerConnection;
};

export const createOffer = async (peerConnection) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
};

export const handleAnswer = async (peerConnection, answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

export const createAnswer = async (peerConnection, offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
};

export const addIceCandidate = async (peerConnection, candidate) => {
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
        console.error('Error adding ICE candidate:', err);
    }
};