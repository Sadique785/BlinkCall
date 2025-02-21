// mediaUtils.js
export const initializeMedia = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        return { stream, error: null };
    } catch (err) {
        console.error('Error accessing media devices:', err);
        return { stream: null, error: 'Error accessing media devices' };
    }
};

export const cleanupMedia = (stream, peerConnection) => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
        peerConnection.close();
    }
};