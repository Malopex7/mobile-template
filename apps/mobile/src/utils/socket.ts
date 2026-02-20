import { io, Socket } from 'socket.io-client';
import { getSecureToken } from './secureStore';

// Expose the raw socket if needed
export let socket: Socket | null = null;

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://YOUR_LOCAL_IP:5001';

export const connectSocket = async () => {
    const token = await getSecureToken('accessToken');
    if (!token) return;

    if (socket) {
        socket.disconnect();
    }

    socket = io(API_URL, {
        auth: {
            token,
        },
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket?.id);
    });

    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
