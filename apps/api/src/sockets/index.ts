import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { WS_EVENTS } from '@repo/shared';

// Augment Socket type to allow attaching user data
interface AuthenticatedSocket extends Socket {
    user?: { id: string; roles: string[] };
}

export const setupSockets = (io: Server) => {
    // Middleware for Socket.io auth
    io.use((socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string; roles: string[] };
            socket.user = decoded;
            next();
        } catch (_err) {
            next(new Error('Authentication error'));
        }
    });

    io.on(WS_EVENTS.CONNECT, (socket: AuthenticatedSocket) => {
        console.log(`🔌 Client connected: ${socket.id} (User: ${socket.user?.id})`);

        socket.on(WS_EVENTS.DISCONNECT, () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
};
