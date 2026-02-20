import { AppError } from '../utils/AppError';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Mongoose duplicate key
    if ((err as unknown as Record<string, unknown>).code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered',
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const mongooseErr = err as unknown as { errors: Record<string, { message: string }> };
        const message = Object.values(mongooseErr.errors).map((val) => val.message).join(', ');
        return res.status(400).json({
            success: false,
            message,
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token expired',
        });
    }

    res.status(500).json({
        success: false,
        message: 'Server Error',
    });
};
