import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import exampleRoutes from './routes/exampleRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();
const httpServer = createServer(app);

// Configure Socket.io
export const io = new Server(httpServer, {
    cors: {
        origin: '*', // Adjust for production
        methods: ['GET', 'POST'],
    },
});

import { setupSockets } from './sockets';
setupSockets(io);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: env.NODE_ENV });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/examples', exampleRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// Error Handling
app.use(errorHandler);

const PORT = env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
};

startServer();
