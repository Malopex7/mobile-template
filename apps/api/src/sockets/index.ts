import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { WS_EVENTS } from '@repo/shared';

export const setupSockets = (io: Server) => {
    // Middleware for Socket.io auth
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
            // @ts-expect-error -- attaching user to socket for downstream handlers
            socket.user = decoded; // Attach user info to socket
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on(WS_EVENTS.CONNECT, (socket) => {
        // @ts-expect-error -- attaching user to socket for downstream handlers
        console.log(`🔌 Client connected: ${socket.id} (User: ${socket.user?.id})`);

        socket.on(WS_EVENTS.DISCONNECT, () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
};
